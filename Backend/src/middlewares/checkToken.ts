import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/handleJWTService'; // Assuming you have this function to verify the token

// Define the middleware function to check user validity
const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Login First' }); 
    } else {

        const tokenVerified = verifyToken(token);
        if (!tokenVerified) {
            res.status(401).json({ message: 'Unauthorized User here' });  
        } else {
            next();
        }
    }   
}

export default checkToken;
