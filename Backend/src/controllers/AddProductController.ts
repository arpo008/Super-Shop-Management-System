// DeleteUserController.ts
import { Request, Response } from 'express';
import { addProductService } from '../services/addProductservice';
import { add } from 'date-fns';

const service = new addProductService();
export class AddProductController {

    async addProduct (req: Request, res: Response): Promise<void> {

        try {

            await service.addProduct(req, res);
        } catch (error: any) {
            console.error('Error in add_Increment_Controller:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
