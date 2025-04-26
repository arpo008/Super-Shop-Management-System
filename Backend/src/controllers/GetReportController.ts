// DeleteUserController.ts
import { Request, Response } from 'express';
import { getReportService } from '../services/getReportService';

const service = new getReportService();

export class GetReportController {

    async getReport (req: Request, res: Response): Promise<void> {

        try {

            await service.getReport(req, res);
        } catch (error: any) {
            console.error('Error in deleteUserController:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
