/**
 * @module UserRoutes
 * @description This module defines the routes for user-related HTTP requests.
 */

/**
 * @route POST /api/addNewUser
 * @description Route to add a new user.
 * @access Public
 */

/**
 * @route GET /
 * @description Route to respond with "hi" at the root URL.
 * @access Public
 */
import express from 'express';
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { addUserService } from '../services/addUserService';
import { logInService } from '../services/logInService';
import { LoginController } from '../controllers/loginController';
import { FindUserController } from '../controllers/FindUserController';
import { DeleteUserController } from '../controllers/DeleteUserController';
import { AddIncrementController } from '../controllers/AddIncrementController';
import { LogoutController } from '../controllers/LogoutController';
import { GetAttendenceController } from '../controllers/GetAttendenceController';
import { PerformanceController } from '../controllers/PerformanceController';
import { GetReportController } from '../controllers/GetReportController';
import { GetAllUserController } from '../controllers/GetAllUserController';
import { AddProductController } from '../controllers/AddProductController';
import { CustomerAuthController } from '../controllers/CustomerAuthController';
import { DeleteProductController } from '../controllers/DeleteProductController';
import { ProductController } from '../controllers/ProductController';
import { Controller } from '../controllers/Controller';

import hrManagerValidity  from '../middlewares/HrManagerValidity';
import { add } from 'date-fns';


const router = express.Router();
const userService = new addUserService();
const userController = new UserController(userService);
const loginController = new LoginController();
const findUserController = new FindUserController();
const deleteUserController = new DeleteUserController();
const addIncrementController = new AddIncrementController();
const logoutController = new LogoutController();
const getAttendenceController = new GetAttendenceController();
const performanceController = new PerformanceController();
const getReportController = new GetReportController();
const getAllUserController = new GetAllUserController();
const addProductController = new AddProductController();
const deleteProductController = new DeleteProductController();
const customerController = new CustomerAuthController(); 
const productController = new ProductController();
const controller = new Controller();
const app = express();

// router.post('/addNewUser', userController.addUser.bind(userController));
router.post('/addNewUser', hrManagerValidity, (req, res) => {
  userController.addUser(req, res);
});

router.post('/login', (req, res) => {
  loginController.logIn(req, res);
});

router.post('/findUser', hrManagerValidity, (req, res) => {
  findUserController.findUser(req, res);
});

router.post('/deleteUser', hrManagerValidity, (req, res) => {
  deleteUserController.deleteUser(req, res);
});

router.post('/addIncrement', hrManagerValidity, (req, res) => {
  addIncrementController.addIncrement(req, res);
});

router.post('/logout', (req, res) => {
  logoutController.logout(req, res);
});

router.post('/getAttendence', (req, res) => {
  getAttendenceController.getAttendence(req, res);
});

router.post('/submitPerformance', (req, res) => {
  performanceController.submitReport(req, res);
});

router.post('/getReport', (req, res) => {
  getReportController.getReport(req, res);
});

router.post('/getAllUser', (req, res) => {
  getAllUserController.getAllUser(req, res);
});

router.post('/addProduct', (req, res) => {
  addProductController.addProduct(req, res);
});

router.post('/deleteProduct', (req, res) => {
  deleteProductController.deleteProduct(req, res);
});

router.post('/updateProductQuantity', (req, res) => {
  productController.updateQuantity(req, res);
});

router.post('/getAllProduct', (req, res) => {
  productController.getAllProduct(req, res);
});


router.post('/updateProduct', (req, res) => {
  productController.updateProduct(req, res);
});

router.post('/buyProduct', (req, res) => {
  productController.buyProduct(req, res);
});

router.post('/getProduct', (req, res) => {
  productController.getProduct(req, res);
});

router.post('/myData', (req, res) => {
  controller.myData(req, res);
});

router.post('/getAllSales', (req, res) => { 
  productController.getAllSales(req, res);
}); 

router.post('/getProductSale', (req, res) => { 
  productController.getProductSales(req, res);
});
router.post('/signup',(req, res) => {
  customerController.signup(req, res);
});

router.post('/customer/login', (req, res) => {
  customerController.login(req, res);
});
router.get('/', (req, res) => {
    res.send('-----------------hi-----------------');
  });

export default router;
