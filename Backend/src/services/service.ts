import { deleteUserQ } from "../queries/userQueries";
import { Request, Response } from 'express';

import DatabaseSingleton from '../database/index';
import { verifyToken } from '../services/handleJWTService'; 
import { UserBuilder } from '../models/user';
import { Admin } from '../models/Admin';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { HRmanager } from "../models/HRmanager";


export class service {

    async myData(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
    
            if (!token) {
                res.status(401).json({ message: 'Login First' });
                return;
            }
    
            const tokenVerified = verifyToken(token);
            if (!tokenVerified) {
                res.status(401).json({ message: 'Invalid Token' });
                return;
            }
    
            const db = DatabaseSingleton.getInstance().getClient();
    
            if (tokenVerified.role === 'customer') {
                const result = await db.query(
                  'SELECT user_id, first_name, last_name, email, mobile FROM customers WHERE user_id = $1',
                  [tokenVerified.user_id]
                );
              
                if (result.rows.length === 0) {
                  res.status(404).json({ message: 'Customer not found' });
                  return;
                }
              
                res.status(200).json({ Data: result.rows[0] });
              }
              
             else {
                // You can extend this for seller/admin/HR/etc.
                res.status(200).json({ Data: tokenVerified });
            }
    
        } catch (error: any) {
            console.error('Error executing query:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
    
    
}
