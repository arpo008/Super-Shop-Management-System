/**
 * @file app.ts
 * @description This file sets up the Express application, configures middleware, and defines routes.
 * 
 * Middleware:
 * - Parses JSON bodies.
 *   @see https://expressjs.com/en/api.html#express.json
 * - Enables Cross-Origin Resource Sharing (CORS).
 *   @see https://expressjs.com/en/resources/middleware/cors.html
 * 
 * Routes:
 * - User routes.
 *   @see ./API/userRoutes
 * 
 * Server:
 * - The port the application will listen on.
 *   @type {number}
 * - Starts the Express server.
 *   @param {number} PORT - The port number.
 *   @param {Function} callback - The callback function to execute once the server is running.
 */

import express, { Express } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './API/userRoutes';
import cors from 'cors';
import { WebSocketServer } from 'ws'; 

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use('/api', userRoutes);
const PORT = 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ----------------------------------------------------------------------------------
// Set up WebSocket server to listen on the same HTTP server
const wss = new WebSocketServer({ server });

const userConnections: Map<string, any> = new Map();
const roleConnections: Map<string, Set<any>> = new Map(); // role -> Set of WebSocket connections


wss.on('connection', (ws) => {
    console.log('A client connected to the WebSocket server');
  
    // When the client sends their userId and role for registration
    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
  
      if (data.type === 'register') {
        const { userId, role } = data;
  
        // Register the userId with the current WebSocket connection
        userConnections.set(userId, { ws, role });
  
        // Add the connection to the role group
        if (!roleConnections.has(role)) {
          roleConnections.set(role, new Set());
        }
        roleConnections.get(role)?.add(ws);
  
        console.log(`User registered with ID: ${userId} and role: ${role}`);
      }
  
      if (data.type === 'message') {
        const { senderId, recipientId, content, targetRole } = data;
  
        if (targetRole) {
          // Send the message to all users with the targetRole
          const roleWsSet = roleConnections.get(targetRole);
          if (roleWsSet) {
            roleWsSet.forEach((clientWs) => {
              clientWs.send(JSON.stringify({
                type: 'message',
                senderId,
                content,
              }));
            });
            console.log(`Message sent to all users with role: ${targetRole}`);
          } else {
            console.log(`No users found with the role: ${targetRole}`);
          }
        } else if (recipientId) {
          // Send message to a specific user
          const recipient = userConnections.get(recipientId);
          if (recipient) {
            recipient.ws.send(JSON.stringify({
              type: 'message',
              senderId,
              content,
            }));
            console.log(`Message sent from ${senderId} to ${recipientId}: ${content}`);
          } else {
            console.log(`Recipient ${recipientId} not found.`);
          }
        }
      }
    });
  
    // Handle client disconnecting
    ws.on('close', () => {
      userConnections.forEach((data, userId) => {
        if (data.ws === ws) {
          userConnections.delete(userId);
          console.log(`User ${userId} disconnected.`);
          // Remove the connection from the role group
          roleConnections.forEach((wsSet, role) => {
            if (wsSet.has(ws)) {
              wsSet.delete(ws);
              console.log(`Removed ${userId} from role group ${role}`);
            }
          });
        }
      });
    });
  });

export default app;