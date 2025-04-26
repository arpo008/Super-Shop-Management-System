import { getReportfrAdmninQ} from "../queries/userQueries";
import { Request, Response } from 'express';

import DatabaseSingleton from '../database/index';
import { verifyToken } from '../services/handleJWTService'; 
import { UserBuilder } from '../models/user';
import { Admin } from '../models/Admin';
import { z } from 'zod';

const getReportSchema = z.object({
    "user_id": z.number().int(), // Ensure user_id is a number
});

export class getReportService {

    async getReport (req: Request, res: Response): Promise<void> {

        try {

            // authorize user by token  

            const parsedBody = getReportSchema.parse(req.body);
            const { user_id } = parsedBody;

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
                if (tokenVerified.role !== 'Admin') {
                    res.status(403).json({ message: 'You are Unauthorized for this.' });
                    return;
                }

                admin = new Admin (adminBuilder.build());
                
                admin.viewReport(user_id).then((result) => {
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
