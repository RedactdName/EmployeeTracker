// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
const db = require("./config/connection")
db.promise().query("SELECT * FROM employee_db").then(data => {
    console.log(data)
});

//  variables for queries and prompt response
let dbRows = [];
let inquirerOutput = [];

// switch for all user input cases
switch (select) {
    // id, name
    case "View All Departments":
        dbRows = await db.query("SELECT * FROM department");
        console.table(dbRows[0]);
        break;

    // role id, job title, department value, salary value
    case "View All Roles":
        dbRows = await db.query(`
                SELECT
                    role_id,
                    role_title,
                    role_salary,
                    department_name AS department
                FROM role
                JOIN department ON role.department_id = department.id
                `);
        console.table(dbRows[0]);
        break;

    // employee id, first name, last name, job title, department, salary and manager
    case "View All Employees":
        dbRows = await db.query(`
                SELECT
                    employee_id,
                    employee.first_name,
                    employee.last_name,
                    role.title AS title,
                    department.name AS department,
                    role.salary AS salary,
                    CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager_table.first_name,' ', manager_table.last_name) ELSE NULL END AS manager
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                JOIN employee manager_table ON employee.manager_id = manager_table.id
                `);
        console.table(dbRows[0]);
        break;
}