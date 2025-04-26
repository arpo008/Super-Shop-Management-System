import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from './handleJWTService';
import { Customer } from '../models/Customer';
import { UserBuilder } from '../models/user';
import DatabaseSingleton from '../database/index';

export class CustomerAuthService {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const result = await Customer.register(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      console.error("Signup error:", err.message);
      res.status(500).json({ message: err.message });
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
  
      const db = DatabaseSingleton.getInstance().getClient();
      const result = await db.query('SELECT * FROM customers WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
  
      const customer = result.rows[0];
  
      const passwordMatch = await bcrypt.compare(password, customer.password);
      if (!passwordMatch) {
        res.status(401).json({ message: 'Wrong password' });
        return;
      }
  
      const token = generateToken({ user_id: customer.customer_id, role: 'customer' });

  
      res.status(200).json({
        message: 'Login successful',
        web_tokens: token,
      });
  
    } catch (err: any) {
      console.error('[Customer Login Error]', err.message);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  }
}  