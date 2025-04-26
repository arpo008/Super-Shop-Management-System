import { Request, Response } from 'express';
import { logInService } from '../services/logInService';

export class LoginController {
    // Note: Assuming logInService is a static method or a separately imported function
    // If logInService is supposed to be an instance method, you'll need to instantiate it differently

    async logIn(req: Request, res: Response): Promise<void> {
        try {
            const { user_id, password } = req.body;

            // Call the login service with user provided ID and password
            const result = await logInService(user_id, password);
            // Handle the result based on the login attempt outcome
            if (result.error) {
                // Send generic error response
                res.status(500).json({ message: result.error });
            } else {
                // Set the token in the response cookie
                res.cookie('authToken', result.web_tokens, {
                    httpOnly: true,    // The cookie is not accessible via client-side JS
                    secure: process.env.NODE_ENV !== 'development',  // Use secure flag in production
                    maxAge: 3600000    // Cookie expiration time in milliseconds (1 hour)
                });
    
                // Send response with success message and token
                res.status(200).json({
                    message: result.message,
                    web_tokens: result.web_tokens
                });
            }

            
        } catch (error: any) {
            // Capture and return any unexpected errors
            res.status(500).json({
                "message": error.message
            });
        }
    }
}
