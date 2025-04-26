import DatabaseSingleton from '../database/index';
import bcrypt from 'bcrypt';
import { loginQuery } from '../queries/userQueries';
import { loginUser } from '../queries/userQueries';
import { generateToken } from '../services/handleJWTService';
import { Request, Response } from 'express';    

export const logInService = async (user_id: number, providedPassword: string) => {
    try {
        const db = DatabaseSingleton.getInstance().getClient();
        const result = await db.query(loginUser, [user_id]);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        } 

        if (result.rows[0].status === 'inactive') {
            throw new Error('User is inactive');
        }
        
        const passwordMatch = await bcrypt.compare(providedPassword, result.rows[0].password);
        if (!passwordMatch) {
            throw new Error('Wrong Password');
        } else {
            let userData = result.rows[0];
            delete userData.password;

            const database = DatabaseSingleton.getInstance();
            const client = database.getClient();   
            
            let staus = await client.query(loginQuery, [user_id, 'active']);

            if (staus.rows.length === 0) {
                throw new Error('User not found');
            }

            const token = generateToken(userData);
            return { message: 'Login successful', web_tokens: token };
        }
        
    } catch (error: any) {
        return { error: error.message };
    }
};