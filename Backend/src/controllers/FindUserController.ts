import { Response, Request } from "express";
import { findUserService } from "../services/findUserService";

const service = new findUserService();

export class FindUserController {

    async findUser (req: Request, res: Response): Promise<void> {

        try {

            await service.findUser(req, res);
        } catch (error: any) {
            console.error('Error in findUserController:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}