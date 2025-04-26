
import { Product } from "./interfaces";

export class MeatProduct implements Product {

    name: string;
    price: number;
    category: string;
    stock_quantity: number;
  
    constructor(name: string, price: number, catagory: string, stock_quantity: number) {
      this.name = name;
      this.price = price;
      this.category = catagory;
      this.stock_quantity = stock_quantity;
    }
  
    // Optionally, you can add methods related to the product if needed, for example:
    updateStock(newQuantity: number): void {
        
    }

    buyProduct(quantity: number): void {
        
    }

    getPrice(): number {
        return this.price;
    }

    getCategory(): string {
        return this.category;
    }

    getType(): string {
        return "Kg";
    }
}

export class HalalMeat extends MeatProduct {
    
    constructor(name: string, price: number, catagory: string, stock_quantity: number) {
        super(name, price, catagory, stock_quantity);
    }

    isHalal(): string {
        return "Yes";
    }

    getType(): string {
        return "Kg";
    }
}

export class HaramMeat extends MeatProduct {
    
    constructor(name: string, price: number, catagory: string, stock_quantity: number) {
        super(name, price, catagory, stock_quantity);
    }

    isHalal(): string {
        return "No";
    }

    getType(): string {
        return "Kg";
    }
}

export class ElectronicProduct implements Product {

    name: string;
    price: number;
    category: string;
    stock_quantity: number;
  
    constructor(name: string, price: number, catagory: string, stock_quantity: number) {
      this.name = name;
      this.price = price;
      this.category = catagory;
      this.stock_quantity = stock_quantity;
    }
  
    // Optionally, you can add methods related to the product if needed, for example:
    updateStock(newQuantity: number): void {
        
    }

    buyProduct(quantity: number): void {
        
    }

    getPrice(): number {
        return this.price;
    }

    getCategory(): string {
        return this.category;
    }

    getType(): string {
        return "Unit";
    }
}


export class Hardware extends ElectronicProduct {
        
    constructor(name: string, price: number, catagory: string, stock_quantity: number) {
        super(name, price, catagory, stock_quantity);
    }

    provideSoftware(): string {
        return "No";
    }

    getType(): string {
        return "Unit";
    }
}

export class Software extends ElectronicProduct {
        
    constructor(name: string, price: number, catagory: string, stock_quantity: number) {
        super(name, price, catagory, stock_quantity);
    }

    getType(): string {
        return "Unit";
    }
}

export class GroceryProduct implements Product {

    name: string;
    price: number;
    category: string;
    stock_quantity: number;
  
    constructor(name: string, price: number, catagory: string, stock_quantity: number) {
      this.name = name;
      this.price = price;
      this.category = catagory;
      this.stock_quantity = stock_quantity;
    }
  
    // Optionally, you can add methods related to the product if needed, for example:
    updateStock(newQuantity: number): void {
        
    }

    buyProduct(quantity: number): void {
        
    }

    getPrice(): number {
        return this.price;
    }

    getCategory(): string {
        return this.category;
    }

    getType(): string {
        return "Kg";
    }
}

export class Other implements Product {

    name: string;
    price: number;
    category: string;
    stock_quantity: number;
  
    constructor(name: string, price: number, catagory: string, stock_quantity: number) {
      this.name = name;
      this.price = price;
      this.category = catagory;
      this.stock_quantity = stock_quantity;
    }
  
    // Optionally, you can add methods related to the product if needed, for example:
    updateStock(newQuantity: number): void {
        
    }

    buyProduct(quantity: number): void {
        
    }

    getPrice(): number {
        return this.price;
    }

    getCategory(): string {
        return this.category;
    }

    getType(): string {
        return "Unit";
    }
}
  
// ProductFactory Class
export class ProductFactory {
    // Static method to create the appropriate Product instance
    static createProduct(name: string, price: number, category: string, stock_quantity: number): Product {
      switch (category) {
        case 'Halal Meat':
          return new HalalMeat(name, price, category, stock_quantity);
        case 'Hardware':
          return new Hardware(name, price, category, stock_quantity);
        case 'Software':
          return new Software(name, price, category, stock_quantity);
        case 'Haram Meat':
            return new HaramMeat(name, price, category, stock_quantity);
        case 'Grocery Product':
            return new GroceryProduct(name, price, category, stock_quantity);
        case 'Other':
            return new Other(name, price, category, stock_quantity);
        default:
          console.log("Unknown product type, " + category);
          throw new Error("Unknown product type, " + category);
      }
    }
}
  