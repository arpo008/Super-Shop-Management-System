// DeleteUserController.ts
import { Request, Response } from 'express';
import { getAttendeceService } from '../services/getAttendenceService';

const service = new getAttendeceService();

export class GetAttendenceController {

    async getAttendence (req: Request, res: Response): Promise<void> {

        try {

            await service.getAttendece(req, res);
        } catch (error: any) {
            console.error('Error in deleteUserController:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
