CREATE DATABASE IF NOT EXISTS people_hub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
 
USE people_hub;
 
-- departments
CREATE TABLE IF NOT EXISTS departments (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  departmentName VARCHAR(100) NOT NULL,
  createdAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Employees
CREATE TABLE IF NOT EXISTS employees (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  employeeCode   VARCHAR(20)    UNIQUE,
  fullName       VARCHAR(100)   NOT NULL,
  email          VARCHAR(100)   UNIQUE,
  mobile         VARCHAR(15),
  departmentId   INT,
  designation    VARCHAR(100),
  salary         DECIMAL(10,2),
  status         ENUM('Active','Inactive') DEFAULT 'Active',
  createdAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (departmentId) REFERENCES departments(id)
);
 
-- Sample departments
INSERT INTO departments (departmentName) VALUES
  ('Engineering'),
  ('Human Resources'),
  ('Finance'),
  ('Sales');
 
-- Sample employees
INSERT INTO employees
  (employeeCode, fullName, email, mobile, departmentId, designation, salary, status)
VALUES
  ('EMP001', 'Arjun Sharma',    'arjun.sharma@example.com',    '9812345601', 1, 'Software Engineer',  78000.00, 'Active'),
  ('EMP002', 'Priya Verma',     'priya.verma@example.com',     '9812345602', 2, 'HR Manager',         65000.00, 'Active'),
  ('EMP003', 'Rohit Mehta',     'rohit.mehta@example.com',     '9812345603', 3, 'Accountant',         52000.00, 'Inactive'),
  ('EMP004', 'Ananya Iyer',     'ananya.iyer@example.com',     '9812345604', 1, 'DevOps Engineer',    82000.00, 'Active'),
  ('EMP005', 'Vikram Nair',     'vikram.nair@example.com',     '9812345605', 4, 'Sales Executive',    60000.00, 'Active');