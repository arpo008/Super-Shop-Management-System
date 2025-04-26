// DeleteUserController.ts
import { Request, Response } from 'express';
import { deleteUserService } from '../services/deleteUserService';

const service = new deleteUserService();

export class DeleteUserController {

    async deleteUser (req: Request, res: Response): Promise<void> {

        try {

            await service.deleteUser(req, res);
        } catch (error: any) {
            console.error('Error in deleteUserController:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
