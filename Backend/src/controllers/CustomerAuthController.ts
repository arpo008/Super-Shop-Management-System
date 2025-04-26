import { Request, Response } from 'express';
import { CustomerAuthService } from '../services/customerAuthService';

const service = new CustomerAuthService();

export class CustomerAuthController {
  static addUser: any;
  async signup(req: Request, res: Response): Promise<void> {
    try {
      await service.signup(req, res);
    } catch (err: any) {
      console.error("Signup error:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("Login request received with body:", req.body);  // Log the incoming request data
      
      // Call the service's login method
      await service.login(req, res);  // No need for return here
  
      console.log("Login process completed successfully.");
    } catch (err: any) {
      console.error("Login error:", err.message);  // Log detailed error message
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  }
}