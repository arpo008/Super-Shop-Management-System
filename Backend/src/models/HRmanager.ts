import { User } from './user';
import DatabaseSingleton from '../database/index';
import { insertNewUser, deleteUserQ, findUserQ, updateUserSalary, getAttendance, submitReportQ} from '../queries/userQueries';
import { UserManagement, PerformanceManagement } from './interfaces';


export class HRmanager extends User implements UserManagement, PerformanceManagement {
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
            "HR Manager"  // Set the role as Admin for the Admin class
        );
    }

    async addNewUser(user: User): Promise<Object> {
        
        if (user.role === 'Admin') {
            return {'message': 'You cannot add an Admin'};
        }

        const { first_name, last_name, address, gender, dob, telephone, age, salary, password, role} = user;
        const values = [first_name, last_name, address, gender, dob, telephone, age, salary, password, role];
            
        const db = DatabaseSingleton.getInstance().getClient();
        const result = await db.query(insertNewUser, values);

        if (result.rows.length > 0) {
            return { 'message' : 'User Added', 'user_id': result.rows[0].user_id};
        } else {
            return {'message': 'User not added'};
        }
    }

    async removeUser(number : Number) : Promise<Object> {
        
        const db = DatabaseSingleton.getInstance().getClient();

        const data = await db.query(findUserQ, [number]);

        if (data.rows.length === 0) {
            return {'message': 'User not found'};
        } else if ( data.rows[0].role === 'Admin') {
            return {'message': 'You cannot Block Admin'};
        } 

        const result = await db.query(deleteUserQ, [number]);

        if (result.rows.length > 0) {
            if ( result.rows[0].status === 'active') {
                return { 'message' : result.rows[0].first_name + ' Activated', 'user_id': result.rows[0].user_id};
            } else {
                return { 'message' : result.rows[0].first_name + ' Deactivated', 'user_id': result.rows[0].user_id};
            }
        } else {
            return {'message': 'User not founded'};
        }
    }

    async addIncrement(number: number, increment: number) : Promise<Object> {
        
        const db = DatabaseSingleton.getInstance().getClient();
        let result = await db.query(findUserQ, [number]);

        if (result.rows.length === 0) {
            return {'message': 'User not found'};
        }

        let salary = Number(result.rows[0].salary);
        
        increment /= 100;
        let temp = salary * increment;
        salary = salary + temp;
        if (salary < 0) {
            salary = 1;
        }

        result = await db.query(updateUserSalary, [salary, number]);

        if (result.rows.length === 0) {
            return {'message': 'User not found'};
        } 

        const user = result.rows[0];

        if (result.rows.length === 0) {
            return {'message': 'User not found'};
        } else {
            return {'message': 'New salary is ' + user.salary + 'BDT'};
        }
        
    }

    async getAttendece(user_id: number, date1: string, date2: string ): Promise<Object> {
        
        const db = DatabaseSingleton.getInstance().getClient();
        let result = await db.query(getAttendance, [user_id, date1, date2]);

        if (result.rows.length > 0) {
            return { 'message' : 'User Founded', 'Attendence': result.rows};
        } else {
            return {'message': 'No Data Found'};
        }
    }

    async submitReport(id: number, score : number, comment : string): Promise<Object> {


        const db = DatabaseSingleton.getInstance().getClient();
        let result = await db.query(findUserQ, [id]);

        if (result.rows.length === 0) {
            return {'message': 'User not found'};
        } else if ( result.rows[0].role === 'Admin') {
            return {'message': 'You cannot submit report for ADMIN'};
        } else if ( result.rows[0].role === 'HR Manager') {
            return {'message': 'You cannot submit report for Yourself'};
        }
        
        result = await db.query(submitReportQ, [id, this.user_id, score, comment]);
        
        if (result.rows.length > 0) {
            return { 'message' : 'Report Submitted'};
        } else {
            return {'message': 'Report not submitted'};
        }
    }

    async getAllUsers(): Promise<Object> {
            
        const db = DatabaseSingleton.getInstance().getClient();
        const result = await db.query('SELECT * FROM users');

        result.rows = result.rows.filter(user => user.role !== 'Admin');
        
        if (result.rows.length > 0) {
            result.rows.forEach(user => {
                delete user.password;
            });
            return { 'message' : 'Users Found', 'Users': result.rows};
        } else {
            return {'message': 'No Users Found'};
        }
    }
}