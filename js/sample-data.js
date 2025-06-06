document.addEventListener('DOMContentLoaded', function () {
    const employeeList = document.getElementById('employee-list');
    const searchInput = document.getElementById('searchInput');
    const form = document.querySelector('.form');
    const saveButton = document.getElementById('form-btt-save');
    const clearButton = document.getElementById('form-btt-clear');

    // Function to generate a random employee
    function generateRandomEmployee(id) {
        const names = ['João', 'Maria', 'José', 'Ana', 'Paulo', 'Carla', 'Ricardo', 'Fernanda', 'Pedro', 'Juliana'];
        const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Ferreira', 'Almeida', 'Machado', 'Nascimento', 'Costa'];
        const roles = ['Desenvolvedor', 'Analista', 'Gerente', 'Designer', 'Estagiário'];
        const departments = ['Tecnologia', 'Marketing', 'Financeiro', 'Recursos Humanos', 'Vendas'];
        const contracts = ['CLT', 'PJ', 'Estágio'];

        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        const randomDepartment = departments[Math.floor(Math.random() * departments.length)];
        const randomSalary = (Math.random() * (10000 - 2000) + 2000).toFixed(2);
        const randomContract = contracts[Math.floor(Math.random() * contracts.length)];
        const randomAdmission = new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 365)));
        const formattedDate = randomAdmission.toLocaleDateString('pt-BR');

        return {
            id: id,
            name: `${randomName} ${randomLastName}`,
            role: randomRole,
            department: randomDepartment,
            salary: `R$ ${randomSalary}`,
            contract: randomContract,
            admission: formattedDate
        };
    }

    // Function to populate the table with employee data
    function populateTable(employees) {
        employeeList.innerHTML = '';
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.role}</td>
                <td>${employee.department}</td>
                <td>${employee.salary}</td>
                <td>${employee.contract}</td>
                <td>${employee.admission}</td>
            `;
            employeeList.appendChild(row);
        });
    }

    // Function to get employees from local storage
    function getEmployees() {
        const employees = localStorage.getItem('employees');
        return employees ? JSON.parse(employees) : [];
    }

    // Function to save employees to local storage
    function saveEmployees(employees) {
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    // Function to initialize the employee list with random data if it's empty
    function initializeEmployeeList() {
        let employees = getEmployees();
        if (employees.length === 0) {
            for (let i = 0; i < 10; i++) {
                employees.push(generateRandomEmployee(i + 1));
            }
            saveEmployees(employees);
            populateTable(employees);
        } else {
            populateTable(employees);
        }
    }

    // Initial population of the table
    initializeEmployeeList();

    // Search functionality
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const employees = getEmployees();
        const filteredEmployees = employees.filter(employee => {
            return (
                employee.name.toLowerCase().includes(searchTerm) ||
                employee.role.toLowerCase().includes(searchTerm) ||
                employee.department.toLowerCase().includes(searchTerm)
            );
        });
        populateTable(filteredEmployees);
    });

    // Form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        // You can add your form submission logic here
    });

    // Clear button functionality
    clearButton.addEventListener('click', function () {
        // You can add your clear form logic here
    });
});