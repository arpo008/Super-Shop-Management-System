// Purpose: Service for adding increment to user's salary.
import { Request, Response } from 'express';
import { User, UserBuilder } from '../models/user';
import { Admin} from '../models/Admin';
import { HRmanager} from '../models/HRmanager';
import { ProductManager} from '../models/ProductManager';
import { ProductFactory } from '../models/extendedProduct';
import { ShopManager} from '../models/ShopManager';
import { EmployeeFactory } from '../models/shopListener';
import { verifyToken } from '../services/handleJWTService'; 

import DatabaseSingleton from '../database/index';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const addProductSchema = z.object({
    "name": z.string() ,
    "price": z.number(),
    "category": z.string(),
    "quantity": z.number(),
});

export class addProductService {

    async addProduct (req: Request, res: Response): Promise<void> {

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

            const parsedBody = addProductSchema.parse(req.body);
            let { name, price, category, quantity} = parsedBody;


            const userBuilder = new UserBuilder()
                    .setId(tokenVerified.user_id)
                    .setRole(tokenVerified.role);
            
            let admin;
            if ( tokenVerified.role === 'Admin' ) {
                admin = new Admin (userBuilder.build());
            } else if ( tokenVerified.role === 'Product Manager' ) {
                admin = new ProductManager(userBuilder.build());
            } else {
                res.status(401).json({ message: 'You are Unauthorized for this' });
                return;
            }

            admin?.addProduct(name, price, category, quantity).then((result) => {
                res.status(200).json(result);
            }
            ).catch((error : any) => {
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
