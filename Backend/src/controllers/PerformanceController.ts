
import { Request, Response } from 'express';
import { PerformanceService } from '../services/performanceService';

const service = new PerformanceService();

export class PerformanceController {
    // Submit a performance report
    async submitReport(req: Request, res: Response): Promise<void> {
        
        try {
            await service.submitReport(req, res);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}