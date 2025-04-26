import { Request, Response } from 'express';
import { logoutService } from '../services/logoutService';

const service = new logoutService();

export class LogoutController {

    async logout(req: Request, res: Response): Promise<void> {
        try {
            
            await service.logout(req, res);
        } catch (error) {
            console.error('Server Error:', error);
            // Capture and return any unexpected errors
            res.status(500).json({
                message: 'An unknown error occurred during login'
            });
        }
    }
}
