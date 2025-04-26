// DeleteUserController.ts
import { Request, Response } from 'express';
import { productService } from '../services/productServices';
import { add } from 'date-fns';

const service = new productService();
export class ProductController {

    async updateQuantity (req: Request, res: Response): Promise<void> {

        try {

            await service.updatQuantity(req, res);
        } catch (error: any) {
            console.error('Error in update_product_Controller:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getAllProduct (req: Request, res: Response): Promise<void> {

        try {

            await service.getAllProduct(req, res);
        } catch (error: any) {
            console.error('Error in get_all_product_Controller:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async updateProduct (req: Request, res: Response): Promise<void> {

        try {

            await service.updateProduct(req, res);
        } catch (error: any) {
            console.error('Error in update_product_Controller:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async buyProduct (req: Request, res: Response): Promise<void> {
            
        try {

            await service.buyProduct(req, res);
        } catch (error: any) {
            console.error('Error in buy product controller:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getProduct (req: Request, res: Response): Promise<void> {
            
        try {

            await service.getProduct(req, res);
        } catch (error: any) {
            console.error('Error in search a single product:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getAllSales (req: Request, res: Response): Promise<void> {
                
        try {

            await service.getAllSales(req, res);
        } catch (error: any) {
            console.error('Error in get all sales:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductSales(req: Request, res: Response): Promise<void> {
        try {
            // Call the service layer method to get product sales
            await service.getProductSales(req, res);
        } catch (error: any) {
            console.error('Error in get product sales:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

}
