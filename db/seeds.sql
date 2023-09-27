USE employee_db;
INSERT INTO department(dept_name)
VALUES ("Admin"), ("HR"), ("IT"), ("Sales");

INSERT INTO role (title,salary,department_id) 
VALUES ("CEO",100000,1), ("Manager", 500000,2), ("Associate", 500000,3), ("Tech Wizard", 800000,4);

INSERT INTO employee(first_name,last_name,role_id,manager_id) 
VALUES ("Taylor", "Vaughn",1,NULL),("Robert", "Pipedream",2,1), ("Fairuza", "Balk",3,2),("Skeet", "Ulrich",4,3);