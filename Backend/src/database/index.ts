// import { Pool } from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

// export default pool;\


import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

class DatabaseSingleton {
  [x: string]: any;
  private static instance: DatabaseSingleton | null = null;
  private client: Client;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL, // Using the environment variable for connection string
    });

    this.client.connect()
      .then(() => console.log('Database connected'))
      .catch((err: Error) => console.error('Connection error', err.stack));
  }

  // Public method to get the instance of the class
  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  // Method to get the database client (the connection object)
  public getClient(): Client {
    return this.client;
  }

  // Optionally, you can implement a method to close the connection
  public closeConnection(): void {
    this.client.end()
      .then(() => console.log('Database connection closed'))
      .catch((err: Error) => console.error('Error closing connection', err.stack));
  }
}

export default DatabaseSingleton;
