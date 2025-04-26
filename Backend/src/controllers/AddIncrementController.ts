// DeleteUserController.ts
import { Request, Response } from 'express';
import { addIncrementService } from '../services/addIncrementService';
import { add } from 'date-fns';

const service = new addIncrementService();
export class AddIncrementController {

    async addIncrement (req: Request, res: Response): Promise<void> {

        try {

            await service.addIncrement(req, res);
        } catch (error: any) {
            console.error('Error in add_Increment_Controller:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
