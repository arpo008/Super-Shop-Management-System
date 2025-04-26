export class User {
    user_id: number | null;
    first_name: string;
    last_name: string;
    address: string;
    gender: string;
    dob: Date;
    telephone: string;
    age: number;
    salary: number;
    password: string;  // Assuming the image is stored as a binary data
    role: string;

    constructor(
        user_id: number | null = null,
        first_name: string = 'First Name Not provided',
        last_name: string = 'Last Name Not provided',
        address: string = '',
        gender: string = '',
        dob: Date = new Date(),
        telephone: string = '',
        age: number = 0,
        salary: number = 0.0,
        password: string = '',
        role: string = 'user'
    ) {
        this.user_id = user_id;  // user_id is auto-assigned by the database
        this.first_name = first_name;
        this.last_name = last_name;
        this.address = address;
        this.gender = gender;
        this.dob = dob;
        this.telephone = telephone;
        this.age = age;
        this.salary = salary;
        this.password = password;
        this.role = role;
    }
}

export class UserBuilder {
    private user_id: number = 0;
    private first_name: string = 'Not provided';
    private last_name: string = 'Not provided';
    private address: string = 'Not provided';
    private gender: string  = 'Not provided';
    private dob: Date = new Date();
    private telephone: string = 'Not provided';
    private age: number = 0;
    private salary: number = 0.0;
    private password: string = 'Not provided';  // Assuming the image is stored as a binary data
    private role: string = 'user';

    setId(user_id: number): UserBuilder {
        this.user_id = user_id;
        return this;
    }

    setFirstName(first_name: string): UserBuilder {
        this.first_name = first_name;
        return this;
    }

    setLastName(last_name: string): UserBuilder {
        this.last_name = last_name;
        return this;
    }

    setAddress(address: string): UserBuilder {
        this.address = address;
        return this;
    }

    setGender(gender: string): UserBuilder {
        this.gender = gender;
        return this;
    }

    setDOB(dob: Date): UserBuilder {
        this.dob = dob;
        return this;
    }

    setTelephone(telephone: string): UserBuilder {
        this.telephone = telephone;
        return this;
    }

    setAge(age: number): UserBuilder {
        this.age = age;
        return this;
    }

    setSalary(salary: number): UserBuilder {
        this.salary = salary;
        return this;
    }

    setPassword(password: string): UserBuilder {
        this.password = password;
        return this;
    }   

    setRole(role: string): UserBuilder {
        this.role = role;
        return this;
    }

    build(): User {
        return new User (this.user_id, this.first_name, this.last_name, this.address, this.gender, this.dob, this.telephone, this.age, this.salary, this.password, this.role);  // Return the fully constructed User object
    }
}