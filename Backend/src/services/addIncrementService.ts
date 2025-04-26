// Purpose: Service for adding increment to user's salary.
import { Request, Response } from 'express';
import { User, UserBuilder } from '../models/user';
import { Admin} from '../models/Admin';
import { HRmanager} from '../models/HRmanager';
import { ProductManager} from '../models/ProductManager';
import { ShopManager} from '../models/ShopManager';
import { EmployeeFactory } from '../models/shopListener';
import { verifyToken } from '../services/handleJWTService'; 

import DatabaseSingleton from '../database/index';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const deleteUserSchema = z.object({
    "user_id": z.number().int(), // Ensure user_id is a 
    "increment": z.number(),
});

export class addIncrementService {

    async addIncrement (req: Request, res: Response): Promise<void> {

        try {

            const token = req.headers.authorization?.split(' ')[1];

            if ( !token ) {
                res.status(401).json({ message: 'Login First' });
                return;
            }

            const tokenVerified = verifyToken(token);

            if ( tokenVerified == null ) {
                res.status(401).json({ message: 'Invalid Token' });
                return;
            }

            const parsedBody = deleteUserSchema.parse(req.body);
            let { user_id, increment } = parsedBody;


            const userBuilder = new UserBuilder()
                    .setId(tokenVerified.user_id)
                    .setRole(tokenVerified.role);
            
            let admin;
            if ( tokenVerified.role === 'Admin' ) {
                admin = new Admin (userBuilder.build());
            } else if ( tokenVerified.role === 'HR Manager' ) {
                admin = new HRmanager(userBuilder.build());
            }

            admin?.addIncrement(user_id, increment).then((result) => {
                res.status(200).json(result);
            }
            ).catch((error) => {
                res.status(500).json({ message: error.message });
            });

        } catch (error: any) {
            console.error('Error executing query:', error.message);
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Invalid data type"});
            } else {
                res.status(500).json({ message: error.message });
            }
        }

    }
}
