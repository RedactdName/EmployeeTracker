// GIVEN a command-line application that accepts user input
const db = require("./config/connection")
// db.promise().query("SELECT * FROM employee_db").then(data => {
//     console.log(data)
// });
const inquirer = require("inquirer");

async function getDb(select) {
    try {
        // const db = await mysql.createConnection({
        //     host: "localhost",
        //     user: DB_USER,
        //     password: DB_PASSWORD,
        //     database: DB_NAME,
        // });

        //  variables for queries and prompt response
        let dbRows = [];
        let inquirerOutput = [];

        // switch for all user input cases
        switch (select) {
            // WHEN I choose to view all departments
            // THEN I am presented with a formatted table showing department names and department ids
            case "View All Departments":
                dbRows = db.query("SELECT * FROM department");
                console.table(dbRows[0]);
                break;


            // WHEN I choose to view all roles
            // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
            case "View All Roles":
                dbRows = db.query(`
                        SELECT
                        role_id,
                        role_title,
                        role_salary,
                        department_name AS department
                        FROM role
                        JOIN department ON role.department_id = department.id
                        `).then(data => {

                });
                console.table(dbRows[0]);
                break;


            // WHEN I choose to view all employees
            // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
            case "View All Employees":
                dbRows = db.query(`
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
                            `).then(data => {

                }
                );
                console.table(dbRows[0]);
                break;
            // enter name; department added to db
            // WHEN I choose to add a department
            // THEN I am prompted to enter the name of the department and that department is added to the database
            case "Add a Department":
                inquirerOutput = await inquirer.prompt([
                    {
                        name: "department",
                        message: "Enter New Department Name:",
                    },
                ]);

                try {
                    // Run the update query here:
                    dbRows = await db.query(
                        `INSERT INTO department (name) VALUES ('${inquirerOutput.department}');`
                    );
                } catch (error) {
                    console.log("Cannot insert duplicate Department");
                }

                break;

            // enter name, salary, department; role added to db
            // WHEN I choose to add a role
            // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
            case "Add a Role":
                // Prompt user for values needed for new Role
                inquirerOutput = await inquirer.prompt([{
                    name: "roleName",
                    message: "Enter New Role Name:",
                },
                {
                    name: "roleSalary",
                    message: "Enter New Role Salary:",
                },
                {
                    name: "roleDpt",
                    message: "Enter New Role Department:",
                },
                ]);

                // Destructure inquirerOutput
                const { roleName, roleSalary, roleDpt } = inquirerOutput;

                // Make a variable to store value from the DB call to get department id
                const showDeptId = await db.query(
                    `SELECT IFNULL((SELECT id FROM department WHERE name = "${roleDpt}"), "Department Does Not Exist")`
                );

                // Write a query to get the department id from the name
                const [rows] = showDeptId;
                const department_id = Object.values(rows[0])[0];

                // Check to see if the id exist in the DB or not and return a "Department Doesn't Exist!" or something like that
                if (department_id === "Department Does Not Exist") {
                    console.log("Enter a Role in an Existing Department!");
                    break;
                }   // Write the query to add a role to the db:
                dbRows = await db.query(
                    ` INSERT INTO role (title, salary, department_id) VALUES ('${roleName}', '${roleSalary}', '${department_id}');`
                );

                break;

            // enter employee fname, lname, role, manager; employee added to db
            // WHEN I choose to add an employee
            // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
            case "Add an Employee":
                inquirerOutput = await inquirer.prompt([
                    {
                        name: "first_name",
                        message: "Enter New Employee's First Name:",
                    },
                    {
                        name: "last_name",
                        message: "Enter New Employee's Last Name:",
                    },
                    {
                        name: "role",
                        message: "Enter New Employee's Role:",
                    },
                    {
                        name: "manager",
                        message: "Enter New Employee's Manager:",
                    },
                ]);

                const showDeptIdRoles = await db.query("select * from role;");
                const showManagers = await db.query("select * from employee where manager_id is null;"
                );

                const { first_name, last_name, role, manager } = inquirerOutput;

                const role_data = allRoles[0].filter((r) => {
                    return r.title === role;
                });

                const manager_data = showManagers[0].filter((m) => {
                    return `${m.first_name} ${m.last_name}` === manager;
                });

                dbRows = await db.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_data[0].id}, ${manager_data[0].id})`
                );

                break;


            // WHEN I choose to update an employee role
            // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
            case "Update an Employee Role":
                currentEmployees = await db.query(`
                                SELECT id, first_name, last_name FROM employee;`);

                currentRoles = await db.query(`
                                SELECT id, title FROM role;`);

                const employeeList = currentEmployees[0].map((employee) => {
                    return {
                        name: `${employee["first_name"]} ${employee.last_name}`,
                        value: employee.id,
                    };
                });

                const roleList = currentRoles[0].map((role) => {
                    return {
                        name: role.title,
                        value: role.id,
                    };
                });

                inquirerOutput = await inquirer.prompt([
                    {
                        type: "list",
                        name: "employeeId",
                        message: "Choose an Employee to Update:",
                        choices: employeeList,
                    },
                    {
                        type: "list",
                        name: "newRole",
                        message: "What is Employee's New Role?",
                        choices: roleList,
                    },
                ]);

                console.log(inquirerOutput);

                // Run the update query here:
                dbRows = await db.query(`
                UPDATE employee
                SET role_id = ${inquirerOutput.newRole}                  
                WHERE employee.id = ${inquirerOutput.employeeId};`);

                break;
        }
    }
    catch (err) {
        console.log(err);

    };
}
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
function inqPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "select",
            message: "What can I help you with?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
                new inquirer.Separator(),
                "Quit",
            ],
        },
    ])
        .then(async (res) => {
            await getDb(res.select);
            res.select === "Quit" ? process.exit() : inqPrompt();
        })
        .catch((err) => {
            if (error.isTtyError) {
            } else {
                err;
            }
        });
}
inqPrompt()
// getDb()
