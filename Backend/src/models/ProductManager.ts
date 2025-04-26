
import { User } from "./user";
import { Product } from "./interfaces";
import DatabaseSingleton from '../database/index';
import { insertProductQ, updateProductQ, getProductQ, getDailySalesBetweenDates, getDailyProductSalesBetweenDates } from '../queries/userQueries';
import { ProductFactory } from './extendedProduct';

export class ProductManager extends User {
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
            "Product Manager"
        );
    }

    async addProduct(name: string, price: number, category: string, quantity: number): Promise<Object> {
        
        const db = DatabaseSingleton.getInstance().getClient();
        const product = await db.query('SELECT * FROM products WHERE name = $1', [name]);

        if (product.rows.length > 0) {
            throw new Error ('Product already exists');  
        }

        try {
            const tempo = ProductFactory.createProduct(name, price, category, quantity);

            if (price < 0) {
                throw new Error ('Price cannot be negative');
            }

            if ( quantity < 0 ) {
                throw new Error ('Quantity cannot be negative');
            }
        } catch (error : any) {
            throw new Error (error.message);
        }
        
        const result = await db.query(insertProductQ, [ name, price, category, quantity]);

        if (result.rows.length > 0) {
            return { 'message' : 'Product Added', 'product_id': result.rows[0].product_id};
        } else {
            throw new Error ('Product not added');
        }
    }

    async removeProduct(id: number): Promise<Object> {
        throw new Error("Method not implemented.");
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

        result = await db.query('UPDATE products SET stock_quantity = $1 WHERE product_id = $2', [quantity, id]);

        if (result.rows.length > 0) {
            return { 'message' : 'Quantity Updated', 'product_id': result.rows[0].product_id, 'new_quantity': result.rows[0].stock_quantity};
        } else {
            throw new Error ('Quantity not updated');
        }
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

    async updateProduct(id: number, name: string, price: number, category: string, quantity: number): Promise<Object> {
        
        try {
            const tempo = ProductFactory.createProduct(name, price, category, quantity);

            if (price < 0) {
                throw new Error ('Price cannot be negative');
            }

            if ( quantity < 0 ) {
                throw new Error ('Quantity cannot be negative');
            }

            const db = DatabaseSingleton.getInstance().getClient();
            let result = await db.query(updateProductQ, [name, price, category, quantity, id]);

            if (result.rows.length > 0) {
                return { 'message' : 'Product Updated', 'product_id': result.rows[0].product_id};
            } else {
                throw new Error ('Product not existed');
            }
        } catch (error : any) {
            throw new Error (error.message);
        }
        
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

    async getDailySalesBetweenDates (startDate: string, endDate: string): Promise<Object> {

        try {
    
            // Execute the query with the provided start and end date
            const db = DatabaseSingleton.getInstance().getClient();
            const result = await db.query(getDailySalesBetweenDates, [startDate, endDate]);
    
            // Format the result into the desired structure
            const salesData = result.rows.map(row => ({
                date: row.sale_date.toISOString().split('T')[0], // Full date in YYYY-MM-DD format
                sales: parseFloat(row.total_sales), // Sales amount
            }));
    
            // Return the response with the sales data
            return {
                'message': 'success',
                'sales': salesData,
            };
        } catch (error) {
            console.error('Error fetching daily sales:', error);
            return {
                'message': 'error',
                'sales': [],
            };
        }
    }

    async getProductSalesBetweenDates(startDate: string, endDate: string, productId: number): Promise<Object> {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            // Subtract one day from the start date and add one day to the end date
            start.setDate(start.getDate() - 1);
            end.setDate(end.getDate() + 1);
    
            // Convert the modified dates back to 'YYYY-MM-DD' format
            const modifiedStartDate = start.toISOString().split('T')[0];
            const modifiedEndDate = end.toISOString().split('T')[0];
    
            const db = DatabaseSingleton.getInstance().getClient();
            const result = await db.query(getDailyProductSalesBetweenDates, [modifiedStartDate, modifiedEndDate, productId]);
    
            // Format the result into the desired structure
            const salesData = result.rows.map(row => ({
                date: row.sale_date.toISOString().split('T')[0], // Full date in YYYY-MM-DD format
                product_name: row.product_name, // Product name
                quantity_sold: parseInt(row.quantity_sold), // Quantity sold
                sales: parseFloat(row.total_sales), // Sales amount
            }));
    
            // Return the response with the sales data
            return {
                message: 'success',
                sales: salesData,
            };
        } catch (error) {
            console.error('Error fetching product sales:', error);
            return {
                message: 'error',
                sales: [],
            };
        }
    }
}