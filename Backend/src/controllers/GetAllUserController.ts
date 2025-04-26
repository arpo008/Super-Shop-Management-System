// DeleteUserController.ts
import { Request, Response } from 'express';
import { gatAllUserService } from '../services/getAllUserService';

const service = new gatAllUserService();

export class GetAllUserController {

    async getAllUser (req: Request, res: Response): Promise<void> {

        try {

            await service.getAllUser(req, res);
        } catch (error: any) {
            console.error('Error in deleteUserController:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
