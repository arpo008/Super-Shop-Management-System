import { logoutQuery } from "../queries/userQueries";
import { Request, Response } from 'express';

import DatabaseSingleton from '../database/index';
import { verifyToken } from '../services/handleJWTService'; 
import { UserBuilder } from '../models/user';
import { Admin } from '../models/Admin';
import bcrypt from 'bcrypt';
import { z } from 'zod';


export class logoutService {

    async logout (req: Request, res: Response): Promise<void> {

        try {

            const token = req.headers.authorization?.split(' ')[1];
             
            if ( !token ) {
                res.status(401).json({ message: 'Login First' });
            } else {

                const tokenVerified = verifyToken(token);
                if ( tokenVerified == null ) {
                    res.status(401).json({ message: 'Invalid Token' });
                    return;
                }

                const database = DatabaseSingleton.getInstance();
                const client = database.getClient();

                const result = await client.query(logoutQuery, [tokenVerified.user_id]);

                if ( result.rowCount == 0 ) {
                    res.status(404).json({ message: 'No active session found' });
                } else {
                    res.status(200).json({ message: 'Logged out successfully' });
                }
            }

        } catch (error: any) {
            console.error('Error executing query:', error.message);
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Invalid data type"});
                return;
            }
            res.status(500).json({ message: error.message });
        }
    }
}
