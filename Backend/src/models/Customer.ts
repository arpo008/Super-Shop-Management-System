import DatabaseSingleton from '../database/index';
import bcrypt from 'bcrypt';
import { ProductFactory } from './extendedProduct';
import { insertNewCustomer, findCustomerByEmail, getSalesRecordQ, addSoldProductsQ } from '../queries/userQueries';
import { Products } from './interfaces';

export class Customer {
  customer_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  gender: string;
  dob: Date;
  mobile: string;
  age: number;
  password: string;

  constructor(data: any) {
    this.customer_id = data.customer_id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.address = data.address;
    this.gender = data.gender;
    this.dob = data.dob;
    this.mobile = data.mobile;
    this.age = data.age;
    this.password = data.password;
  }

  static async register(data: any): Promise<Object> {
    const db = DatabaseSingleton.getInstance().getClient();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const values = [
      data.first_name, data.last_name, data.email,
      data.address, data.gender, data.dob, data.mobile, data.age, hashedPassword
    ];

    const result = await db.query(insertNewCustomer, values);

    if (result.rows.length > 0) {
      return { message: 'Customer registered', customer_id: result.rows[0].customer_id };
    } else {
      return { message: 'Registration failed' };
    }
  }

  static async login(email: string): Promise<any> {
    const db = DatabaseSingleton.getInstance().getClient();
    const result = await db.query(findCustomerByEmail, [email]);
    return result.rows[0];
  }

  async buyProduct(products: { id: number; quantity: number; }[]): Promise<Object> {
    const db = DatabaseSingleton.getInstance().getClient();
    // ✅ Create new sales record for each purchase
let result = await db.query(`
  INSERT INTO sales_records (sold_by, sale_date, total_amount)
  VALUES ($1, CURRENT_TIMESTAMP, $2)
  RETURNING record_id;
`, [this.customer_id, 0]);

let record_id = result.rows[0].record_id;

    
    const boughtProducts: { name: string; price: number; quantity: number }[] = [];
    let totalAmount = 0;

    if (result.rows.length > 0) {
      record_id = result.rows[0].record_id;

      for (let product of products) {
        const productResult = await db.query('SELECT * FROM products WHERE product_id = $1', [product.id]);

        if (productResult.rows.length > 0) {
          const availableProduct = productResult.rows[0];

          if (availableProduct.stock_quantity >= product.quantity) {
            await db.query(
              'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2',
              [product.quantity, product.id]
            );

            await db.query(addSoldProductsQ, [record_id, product.id, product.quantity]);

            boughtProducts.push({
              name: availableProduct.name,
              price: availableProduct.price,
              quantity: product.quantity
            });

            totalAmount += availableProduct.price * product.quantity;
          }
        }
      }

      await db.query('UPDATE sales_records SET total_amount = $1 WHERE record_id = $2', [totalAmount, record_id]);

      return {
        message: "Purchase successful",
        products: boughtProducts,
        totalPrice: totalAmount
      };
    } else {
      return { message: "No active sales record found" };
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

      return { 'message': 'Products Found', 'Products': result.rows };
    } else {
      return { 'message': 'No Products Found' };
    }
  }
}
