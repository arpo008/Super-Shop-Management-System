
import DatabaseSingleton from '../database/index';
import { User, UserBuilder } from '../models/user';
import { Admin} from '../models/Admin';
import { HRmanager} from '../models/HRmanager';
import { ProductManager} from '../models/ProductManager';
import { ShopManager} from '../models/ShopManager';
import { EmployeeFactory } from '../models/shopListener';
import { verifyToken } from '../services/handleJWTService'; 
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

export class addUserService {
    async addUser(req: Request, res: Response): Promise<void> {

        try {
            const token = req.headers.authorization?.split(' ')[1];
             
            if ( req.body instanceof User ) {

                res.status(400).json({ message: 'Invalid request body' });
            } else if ( !token ) {

                res.status(401).json({ message: 'Login First' });
            } else {

                const tokenVerified = verifyToken(token);
                if ( tokenVerified == null ) {
                    res.status(401).json({ message: 'Invalid Token' });
                    return;
                }

                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const userBuilder = new UserBuilder()
                    .setFirstName(req.body.first_name)
                    .setLastName(req.body.last_name)
                    .setAddress(req.body.address)
                    .setGender(req.body.gender)
                    .setDOB(new Date(req.body.dob))  // Ensuring date conversion
                    .setTelephone(req.body.telephone)
                    .setAge(req.body.age)
                    .setSalary(req.body.salary)  // Handle binary data as necessary
                    .setPassword(hashedPassword) 
                    .setRole(req.body.role)

                const adminBuilder = new UserBuilder()
                    .setId(tokenVerified.user_id)
                    .setRole(tokenVerified.role);

                let admin;
                if ( tokenVerified.role === 'Admin' ) {
                    admin = new Admin(adminBuilder.build());
                } else if ( tokenVerified.role === 'HR Manager' ) {
                    admin = new HRmanager(adminBuilder.build());
                } else {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                
                let newUser;

                if ( req.body.role === 'HR Manager' ) {
                    newUser = new HRmanager(userBuilder.build());  
                } else if ( req.body.role === 'Admin' ) {
                    res.status(400).json({ message: 'Admin cannot be added' });
                    return;
                } else if ( req.body.role === 'Product Manager' ) {
                    newUser = new ProductManager(userBuilder.build());
                } else if ( req.body.role === 'Shop Manager' ) {
                    newUser = new ShopManager(userBuilder.build());
                } else if ( req.body.role === 'Seller' || req.body.role === 'Cleaner' || req.body.role === 'Guard' || req.body.role === 'Worker' ) {
                    const employeeFactory = new EmployeeFactory();
                    newUser = employeeFactory.getEmployee(userBuilder.build());
                } else {
                    res.status(400).json({ message: 'Invalid role' });
                    return ;
                }
                
                admin.addNewUser(newUser).then((result) => {
                    if (result) {
                        res.status(201).json({ result});
                    } else {
                        res.status(400).json({ 'message': 'User could not be created' });
                    }
                });
            }
            
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error executing query:', error.message);
                throw new Error('Failed to insert new user');
            } else {
                console.error('An unknown error occurred:', error);
                throw new Error('An unknown error occurred');
            }
        }
    }
}