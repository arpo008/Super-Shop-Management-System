/**
 * @module UserController
 * @description This module defines the UserController class, which handles user-related HTTP requests.
 * 
 * @class UserController
 * @description Controller class for handling user-related HTTP requests.
 * 
 * @constructor
 * @param {addUserService} addUserService - An instance of addUserService to handle user operations.
 * 
 * @method addUser
 * @description Handles the HTTP POST request to add a new user.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>}
 */

import { Request, Response } from 'express';
import { addUserService } from '../services/addUserService';
import { UserBuilder } from '../models/user';
import { User } from '../models/user';
import { verifyToken } from '../services/handleJWTService';


const service = new addUserService();

export class UserController {
    private addUserService: addUserService;

    constructor(addUserService: addUserService) {
        this.addUserService = addUserService;
    }

    async addUser(req: Request, res: Response): Promise<void> {
        try {

            await service.addUser(req, res);
            
        } catch (error: any) {
            console.error('Failed to add user.', error);
            res.status(500).json({ message: error.message });
        }
    }
}