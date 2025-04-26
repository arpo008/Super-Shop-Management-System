import { Request, Response } from 'express';
import { service } from '../services/service';

const Service = new service();

export class Controller {
    login(req: Request, res: Response): void {
        throw new Error('Method not implemented.');
    }

    signup(req: Request, res: Response): void {
        throw new Error('Method not implemented.');
    }

    async myData(req: Request, res: Response): Promise<void> {
        try {
            await Service.myData(req, res);
        } catch (error: any) {
            console.error('Error in Controller:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
