import { deleteUserQ } from "../queries/userQueries";
import { Request, Response } from 'express';

import DatabaseSingleton from '../database/index';
import { verifyToken } from '../services/handleJWTService'; 
import { UserBuilder } from '../models/user';
import { Admin } from '../models/Admin';
import { HRmanager } from '../models/HRmanager';
import { ShopManager } from "../models/ShopManager";
import { z } from 'zod';


const deleteUserSchema = z.object({
    "user_id": z.number().int(),
    "score" : z.number().int(),
    "comment" : z.string()
});

export class PerformanceService {
    
    async submitReport(req: Request, res: Response): Promise<void> {
        
        try { 

            const parsedBody = deleteUserSchema.parse(req.body);
            const { user_id, score, comment } = parsedBody;

            const token = req.headers.authorization?.split(' ')[1];
             
            if ( !token ) {

                res.status(401).json({ message: 'Login First' });
            } else {

                const tokenVerified = verifyToken(token);
                if ( tokenVerified == null ) {
                    res.status(401).json({ message: 'Invalid Token' });
                    return;
                }

                const adminBuilder = new UserBuilder()
                    .setId(tokenVerified.user_id)
                    .setRole(tokenVerified.role);

                let admin;
                if ( tokenVerified.role === 'Admin') {
                    admin = new Admin(adminBuilder.build());
                } else if ( tokenVerified.role === 'HR Manager') {
                    admin = new HRmanager(adminBuilder.build());
                } else if ( tokenVerified.role === 'Shop Manager') {
                    admin = new ShopManager(adminBuilder.build());
                } else {
                    res.status(403).json({ message: 'You are not allowed to submit performance' });
                    return;
                }

                if ( score < 0 || score > 100 ) {
                    res.status(400).json({ message: 'Invalid score' });
                    return;
                }

                admin.submitReport(user_id, score, comment).then((result) => {
                    res.status(200).json(result);

                }).catch((error) => {
                    res.status(500).json({ message: error.message });
                });
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