import { findUserQ } from "../queries/userQueries";
import { Request, Response } from 'express';

import DatabaseSingleton from '../database/index';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const FindUserSchema = z.object({
    "user_id": z.number().int(), // Ensure user_id is a number
});

export class findUserService {

    async findUser (req: Request, res: Response): Promise<void> {

        try {

            // authorize user by token  

            const parsedBody = FindUserSchema.parse(req.body);
            const { user_id } = parsedBody;

            const db = DatabaseSingleton.getInstance().getClient();
            const result = await db.query(findUserQ, [user_id]);

            if (result.rows.length === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            } 

            const user = result.rows[0];
            delete user.password;

            if (result.rows.length === 0) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.status(200).json({ message: 'user founded', user: user });
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
