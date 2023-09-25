DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

SELECT DATABASE();
-- view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
CREATE TABLE departments
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,

CREATE TABLE roles
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    department INT,
    FOREIGN KEY (department)
    REFERENCES department(id)

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first name VARCHAR(50) NOT NULL,
  last name VARCHAR(100) NOT NULL,
  department INT 
  FOREIGN KEY (departments)
  REFERENCES (departments(id))
  role INT 




  ON DELETE SET NULL
);