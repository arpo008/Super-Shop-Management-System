// DeleteUserController.ts
import { Request, Response } from 'express';
import { deleteProductService } from '../services/deleteProductService';
import { add } from 'date-fns';

const service = new deleteProductService();
export class DeleteProductController {

    async deleteProduct (req: Request, res: Response): Promise<void> {

        try {

            await service.deletProduct(req, res);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
