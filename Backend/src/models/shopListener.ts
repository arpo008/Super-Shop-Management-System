
import { User } from './user';
import { Employee, Products } from './interfaces';
import DatabaseSingleton from '../database/index';
import { getSalesRecordQ, addSoldProductsQ, getProductQ, updateQuantityQ } from '../queries/userQueries';
import { Customer } from './Customer';
import { ProductFactory } from './extendedProduct';
import { HalalMeat, Hardware, Software, HaramMeat, GroceryProduct, Other } from './extendedProduct';
import { number } from 'zod';

export class Seller extends User implements Employee {
    constructor(user: User) {
        // Directly pass the user data to the parent class (User)
        super(
            user.user_id,
            user.first_name,
            user.last_name,
            user.address,
            user.gender,
            user.dob,
            user.telephone,
            user.age,
            user.salary,
            user.password,
            'Seller'  // Set the role as Seller for the Seller class
        );
    }

    completeTask(number: Number): void {
        console.log(`Task ${number} completed by seller`);
    }

    async getAllProducts(): Promise<Object> {
        
        const db = DatabaseSingleton.getInstance().getClient();
        const result = await db.query('SELECT * FROM products');

        if (result.rows.length > 0) {

            for (let i = 0; i < result.rows.length; i++) {
                const product = result.rows[i]; 
                const productInstance = ProductFactory.createProduct(
                    product.name, 
                    product.price, 
                    product.category, 
                    product.stock_quantity
                );
                result.rows[i].type = productInstance.getType();
            }

            return { 'message' : 'Products Found', 'Products': result.rows};
        } else {
            return {'message': 'No Products Found'};
        }
    }

    async buyProduct(products: Products[]): Promise<Object> {
        const db = DatabaseSingleton.getInstance().getClient();
        let result = await db.query(getSalesRecordQ, [this.user_id, 0]);
        let record_id: number;
        const boughtProducts: { productId: number, quantity: number, price: number, UnitType: string }[] = [];
        const errorMessages: string[] = [];
        let totalAmount = 0;
    
        // Check if sales record exists
        if (result.rows.length > 0) {
            record_id = result.rows[0].record_id;
    
            // If record_id is found, start processing the products
            if (record_id != null) {
                // Iterate through each product
                for (let product of products) {
                    // Fetch the product from the products table to check availability
                    const productResult = await db.query('SELECT * FROM products WHERE product_id = $1', [product.id]);


    
                    // Check if the product exists and has enough quantity
                    if (productResult.rows.length > 0) {
                        const availableProduct = productResult.rows[0]; 
                        console.log(availableProduct.category);
                        let productInstance = ProductFactory.createProduct(
                            availableProduct.name, 
                            availableProduct.price, 
                            availableProduct.category, 
                            availableProduct.stock_quantity
                        );
                        
                        let type = productInstance.getType();
                        // Check the type of the productInstance using instanceof
                        // if (productInstance instanceof HalalMeat) {
                        //     ty
                        // } else if (productInstance instanceof Hardware) {
                        //     console.log("Created a Hardware instance");
                        // } else if (productInstance instanceof Software) {
                        //     console.log("Created a Software instance");
                        // } else if (productInstance instanceof HaramMeat) {
                        //     console.log("Created a HaramMeat instance");
                        // } else if (productInstance instanceof GroceryProduct) {
                        //     console.log("Created a GroceryProduct instance");
                        // } else if (productInstance instanceof Other) {
                        //     console.log("Created an Other product instance");
                        // }

                        if (availableProduct.stock_quantity >= product.quantity) {
                            // Update the product quantity in the products table
                            await db.query('UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2', [product.quantity, product.id]);
    
                            // Add product details to the bought products array
                            boughtProducts.push({
                                productId: product.id,
                                quantity: product.quantity,
                                price: availableProduct.price * product.quantity,
                                UnitType: type
                            });
    
                            // Add to total amount
                            totalAmount += availableProduct.price * product.quantity;
    
                            // Insert the sold product into sales_products table
                            await db.query(addSoldProductsQ, [record_id, product.id, product.quantity]);
                        } else {
                            // Add error message if not enough stock is available
                            errorMessages.push(`Product with ID ${product.id} is not available with your requested quantity.`);
                        }
                    } else {
                        // Add error message if the product is not found
                        errorMessages.push(`Product with ID ${product.id} does not exist.`);
                    }
                }
    
                // After all products have been processed, update the sales_records table with total amount
                if (boughtProducts.length > 0) {
                    await db.query('UPDATE sales_records SET total_amount = $1 WHERE record_id = $2', [totalAmount, record_id]);
                }
            }
        } else {
            // Handle the case where no sales record exists for the user
            return { "Failed": "No active sales record found for the user." };
        }
    
        // Return the result with bought products and error messages
        return {
            "Bought Products": boughtProducts,
            "Failed": errorMessages
        };
    }

    async getProduct(id: number): Promise<Object> {
        
        const db = DatabaseSingleton.getInstance().getClient();
        const result = await db.query(getProductQ, [id]);

        if (result.rows.length > 0) {
            return { 'message' : 'Product Found', 'Product': result.rows};
        } else {
            return {'message': 'No Product Found'};
        }
    }

    async updateQuantity(id: number, quantity: number): Promise<Object> {
            
        const db = DatabaseSingleton.getInstance().getClient();
        let result = await db.query('SELECT * FROM products WHERE product_id = $1', [id]);

        if (result.rows.length === 0) {
            throw new Error ('Product not found');
        }

        if (quantity < 0) {
            throw new Error ('Quantity cannot be negative');
        }

        quantity += result.rows[0].stock_quantity;

        result = await db.query(updateQuantityQ, [quantity, id]);

        if (result.rows.length > 0) {
            return { 'message' : 'Quantity Updated', 'product_id': result.rows[0].product_id, 'new_quantity': result.rows[0].stock_quantity};
        } else {
            throw new Error ('Quantity not updated');
        }
    }
    
}

export class ShopWorker extends User implements Employee {
    constructor(user: User) {
        // Directly pass the user data to the parent class (User)
        super(
            user.user_id,
            user.first_name,
            user.last_name,
            user.address,
            user.gender,
            user.dob,
            user.telephone,
            user.age,
            user.salary,
            user.password,
            'Shop Worker'  // Set the role as Seller for the Seller class
        );
    }

    completeTask(number: number): void {
        console.log(`Task ${number} completed`);
    }
}

export class Cleaner extends User implements Employee {
    constructor(user: User) {
        // Directly pass the user data to the parent class (User)
        super(
            user.user_id,
            user.first_name,
            user.last_name,
            user.address,
            user.gender,
            user.dob,
            user.telephone,
            user.age,
            user.salary,
            user.password,
            'Cleaner'  // Set the role as Seller for the Seller class
        );
    }

    completeTask(number: number): void {
        console.log(`Task ${number} completed by cleaner`);
    }
}


export class Guard extends User implements Employee {
    constructor(user: User) {
        // Directly pass the user data to the parent class (User)
        super(
            user.user_id,
            user.first_name,
            user.last_name,
            user.address,
            user.gender,
            user.dob,
            user.telephone,
            user.age,
            user.salary,
            user.password,
            'Guard'  // Set the role as Seller for the Seller class
        );
    }

    completeTask(number: number): void {
        console.log(`Task ${number} completed`);
    }
}

export class EmployeeFactory {

    getEmployee(user: User): Employee {
        switch (user.role) {
            case 'Seller':
                return new Seller(user);
            case 'ShopWorker':
                return new ShopWorker(user);
            case 'Cleaner':
                return new Cleaner(user);
            case 'Guard':
                return new Guard(user);
            default:
                throw new Error('Invalid role');
        }
    }
}