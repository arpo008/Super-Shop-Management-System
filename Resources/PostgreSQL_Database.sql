CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address TEXT,
    gender CHAR(1),
    dob DATE,
    telephone VARCHAR(15),
    age INT,
    salary DECIMAL(10, 2),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(100),  -- Column to specify user types like 'Admin', 'HR Manager', 'Product Manager', etc.
    status VARCHAR(10) DEFAULT 'active'  -- New column for status (active/inactive)
);
CREATE TABLE customers (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(100),
    address TEXT,
    gender CHAR(1),
    dob DATE,
    mobile VARCHAR(15),
    age INTEGER,
    password VARCHAR(255),
    role VARCHAR(100)
);


CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    assigned_to INT REFERENCES users(user_id),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'accepted'  -- New column for task status
);

CREATE TABLE performance_reports (
    report_id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES users(user_id),
    reported_by INT REFERENCES users(user_id),
    review_date DATE,
    score INT CHECK (score BETWEEN 0 AND 100),  -- Assuming score is a percentage
    notes TEXT
);
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) CHECK (price >= 0),
    category VARCHAR(255),
    stock_quantity INT CHECK (stock_quantity >= 0), 
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sales_records (
    record_id SERIAL PRIMARY KEY,
    sold_by INT REFERENCES users(user_id),  -- User who made the sale
    sale_date DATE,  -- Date of the sale
    total_amount DECIMAL(10, 2)  -- Total amount of the sale (optional, can be calculated)
);  

CREATE TABLE sales_products (
    record_id INT REFERENCES sales_records(record_id),  -- Link to sales_records
    product_id INT REFERENCES products(product_id),  -- Link to products
    quantity_sold INT CHECK (quantity_sold >= 0),  -- Quantity of the product sold
    PRIMARY KEY (record_id, product_id)  -- Composite primary key
);

CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id), -- User who is logging in
    date DATE DEFAULT CURRENT_DATE, -- Date of the attendance record
    clock_in_time TIMESTAMP, -- Time when the employee logs in
    clock_out_time TIMESTAMP, -- Time when the employee logs out
    total_hours DECIMAL(5, 2) GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (clock_out_time - clock_in_time)) / 3600) STORED, -- Total hours worked
    status VARCHAR(50) DEFAULT 'active' -- 'active' means the employee is still logged in, 'completed' means they've logged out
);

INSERT INTO users (first_name, last_name, address, gender, dob, telephone, age, salary, role, password)
VALUES 
('Alice', 'Smith', '123 Main St, Cityville', 'F', '1990-05-15', '123-456-7890', 34, 75000.50, 'Admin', '$2b$10$TVUYSV63PgdguQf16yXjIeKL/pLdt905U515z3iclYSje0e6F3B06'),
('Bob', 'Johnson', '456 Elm St, Townsville', 'M', '1985-09-10', '234-567-8901', 39, 65000.00, 'HR Manager', '$2b$10$TVUYSV63PgdguQf16yXjIeKL/pLdt905U515z3iclYSje0e6F3B06'),
('Charlie', 'Brown', '789 Maple St, Villagetown', 'M', '1992-12-05', '345-678-9012', 31, 55000.75, 'Product Manager', '$2b$10$TVUYSV63PgdguQf16yXjIeKL/pLdt905U515z3iclYSje0e6F3B06'),
('Charlie', 'Brown', '789 Maple St, Villagetown', 'M', '1992-12-05', '345-678-9012', 31, 55000.75, 'Seller', '$2b$10$TVUYSV63PgdguQf16yXjIeKL/pLdt905U515z3iclYSje0e6F3B06');

INSERT INTO tasks (assigned_to, description, created_at, status)
VALUES 
(4, 'Samner baranda ta poriskar koro', '2024-12-06 10:00:00', 'In Progress');

INSERT INTO performance_reports (employee_id, reported_by, review_date, score, notes)
VALUES 
(1, 2, '2024-11-01', 85, 'Good performance with room for improvement.'),
(2, 1, '2024-11-05', 90, 'Excellent management of HR activities.'),
(3, 1, '2024-11-10', 75, 'Needs to focus more on meeting project deadlines.');

INSERT INTO products (name, price, category, stock_quantity, created_at, updated_at)
VALUES 
('Laptop', 1200.00, 'Hardware', 50, '2024-10-01 12:00:00', '2024-10-01 12:00:00'),
('Desk Chair', 150.50, 'Other', 200, '2024-10-05 15:30:00', '2024-10-05 15:30:00'),
('Wireless Mouse', 25.99, 'Hardware', 300, '2024-10-10 10:00:00', '2024-10-10 10:00:00');

INSERT INTO sales_records (sold_by, sale_date, total_amount)
VALUES 
(1, '2024-11-12', 1400.00),
(2, '2024-11-13', 300.50),
(3, '2024-11-14', 60.00);

INSERT INTO sales_products (record_id, product_id, quantity_sold)
VALUES 
(1, 1, 1),  -- 1 Laptop sold in record 1
(2, 2, 2),  -- 2 Desk Chairs sold in record 2
(3, 3, 3);  -- 3 Wireless Mice sold in record 3

INSERT INTO attendance (user_id, date, clock_in_time, clock_out_time, status)
VALUES 
(1, '2024-11-12', '2024-11-12 09:00:00', '2024-11-12 17:00:00', 'completed'),
(2, '2024-11-13', '2024-11-13 08:30:00', '2024-11-13 16:30:00', 'completed'),
(3, '2024-11-14', '2024-11-14 09:15:00', NULL, 'active');