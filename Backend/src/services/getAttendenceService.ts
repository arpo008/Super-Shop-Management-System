
import { Request, Response } from 'express';
import { verifyToken } from '../services/handleJWTService'; 
import { UserBuilder } from '../models/user';
import { Admin } from '../models/Admin';
import { HRmanager } from '../models/HRmanager';
import { z } from 'zod';

const getAttendenceSchema = z.object({
    "user_id": z.number().int(),
    "Starting": z.string(),
    "Ending": z.string(),
});

export class getAttendeceService {

    async getAttendece (req: Request, res: Response): Promise<void> {

        try {

            // authorize user by token  

            const parsedBody = getAttendenceSchema.parse(req.body);
            const { user_id, Starting, Ending } = parsedBody;

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
                if ( tokenVerified.role === 'Admin' ) {
                    admin = new Admin(adminBuilder.build());
                } else if ( tokenVerified.role === 'HR Manager' ) {
                    admin = new HRmanager(adminBuilder.build());
                } else {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }

                admin.getAttendece(user_id, Starting, Ending ).then((result) => {
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
