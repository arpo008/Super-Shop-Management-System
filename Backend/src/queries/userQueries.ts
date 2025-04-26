const getUserById: string = `
  SELECT * FROM users WHERE id = $1;
`;

const getAllUsers: string = `
  SELECT * FROM users;
`;

const insertNewUser: string = `
  INSERT INTO users(first_name, last_name, address, gender, dob, telephone, age, salary, password, role) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
  RETURNING *;
`;

const loginUser: string = `
  SELECT * FROM users WHERE user_id = $1;
`;

const findUserQ: string = `
  SELECT * FROM users WHERE user_id = $1;
`;

const deleteUserQ: string = `
  UPDATE users
  SET status = CASE
      WHEN status = 'active' THEN 'inactive'
      ELSE 'active'
  END
  WHERE user_id = $1
  RETURNING *;
`;

const updateUserSalary: string = `
  UPDATE users
  SET salary = $1
  WHERE user_id = $2
  RETURNING *;
`;

const logoutQuery: string = `
  UPDATE attendance
  SET 
      clock_out_time = CURRENT_TIMESTAMP,  -- Set clock_out_time to current time
      status = 'completed'  -- Change status to 'completed'
  WHERE user_id = $1  -- Replace $1 with the provided user_id
    AND date = CURRENT_DATE  -- Ensure the attendance record is for today
  AND status = 'active';  -- Only update if the user is still logged in

`;

const loginQuery: string = `
  INSERT INTO attendance (user_id, clock_in_time, status)
  VALUES ($1, CURRENT_TIMESTAMP, $2) 
  RETURNING *;
`;

const getAttendance: string = `
  SELECT * FROM attendance
  WHERE user_id = $1
    AND date BETWEEN $2 AND $3;
`;

const submitReportQ: string = `
  INSERT INTO performance_reports(employee_id, reported_by, review_date, score, notes)
  VALUES ($1, $2, CURRENT_DATE, $3, $4)
  RETURNING *;
`;

const getReportfrAdmninQ: string = `
  SELECT * FROM performance_reports
  WHERE employee_id = $1;
`;

const insertProductQ: string = `
  INSERT INTO products(name, price, category, stock_quantity, created_at, updated_at) 
  VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
  RETURNING *;
`;

const deleteProductQ: string = `
  DELETE FROM products WHERE product_id = $1 RETURNING *;
`;

const updateQuantityQ: string = `
  UPDATE products
  SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP
  WHERE product_id = $2
  RETURNING *;
`;

const updateProductQ: string = `
  UPDATE products
  SET name = $1, price = $2, category = $3, stock_quantity = $4, updated_at = CURRENT_TIMESTAMP
  WHERE product_id = $5
  RETURNING *;
`;

const getSalesRecordQ: string = `
  INSERT INTO sales_records (sold_by, sale_date, total_amount)
  VALUES ($1, CURRENT_TIMESTAMP, $2)
  RETURNING record_id;
`;

const addSoldProductsQ: string = `
  INSERT INTO sales_products (record_id, product_id, quantity_sold)
  VALUES ($1, $2, $3);
`;

const getProductQ: string = `
  SELECT * FROM products WHERE product_id = $1;
`;

const getDailySalesBetweenDates: string = `
  SELECT s.sale_date, COALESCE(SUM(sp.quantity_sold * p.price), 0) AS total_sales
    FROM sales_records s
    JOIN sales_products sp ON s.record_id = sp.record_id
    JOIN products p ON sp.product_id = p.product_id
    WHERE s.sale_date BETWEEN $1 AND $2
    GROUP BY s.sale_date
    ORDER BY s.sale_date;
`;

const getDailyProductSalesBetweenDates: string = `
  WITH date_range AS (
        SELECT generate_series($1::date, $2::date, '1 day'::interval)::date AS sale_date
    )
    SELECT 
        dr.sale_date, 
        p.name AS product_name, 
        COALESCE(SUM(sp.quantity_sold), 0) AS quantity_sold,
        COALESCE(SUM(sp.quantity_sold * p.price), 0) AS total_sales
    FROM date_range dr
    LEFT JOIN sales_records s ON s.sale_date = dr.sale_date
    LEFT JOIN sales_products sp ON s.record_id = sp.record_id
    LEFT JOIN products p ON sp.product_id = p.product_id
    WHERE sp.product_id = $3  -- Filter by the specific product
    GROUP BY dr.sale_date, p.product_id
    ORDER BY dr.sale_date;
`;
const insertNewCustomer: string = `
  INSERT INTO customers(first_name, last_name, email,address,gender,dob,mobile,age ,password,role)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,'customer')
  RETURNING *;
`;

const findCustomerByEmail = `
  SELECT * FROM customers WHERE email = $1;
`;


export {  
  getUserById,
  getAllUsers,
  insertNewUser,
  loginUser,
  findUserQ,
  deleteUserQ,
  updateUserSalary,
  logoutQuery,
  loginQuery,
  getAttendance,
  submitReportQ,
  getReportfrAdmninQ,
  insertProductQ,
  deleteProductQ,
  updateQuantityQ,
  updateProductQ,
  getSalesRecordQ,
  addSoldProductsQ,
  getProductQ,
  getDailySalesBetweenDates,
  insertNewCustomer,
   findCustomerByEmail,
  getDailyProductSalesBetweenDates

};