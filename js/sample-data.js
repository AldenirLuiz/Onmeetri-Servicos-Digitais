document.addEventListener('DOMContentLoaded', function () {
    const employeeList = document.getElementById('employee-list');
    const searchInput = document.getElementById('searchInput');
    const form = document.querySelector('.form');
    const saveButton = document.getElementById('form-btt-save');
    const clearButton = document.getElementById('form-btt-clear');

    // Function to generate a random employee
    function generateRandomEmployee(id) {
        const nomes = ['João', 'Maria', 'José', 'Ana', 'Paulo', 'Carla', 'Ricardo', 'Fernanda', 'Pedro', 'Juliana'];
        const lastnomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Ferreira', 'Almeida', 'Machado', 'Nascimento', 'Costa'];
        const cargos = ['Desenvolvedor', 'Analista', 'Gerente', 'Designer', 'Estagiário'];
        const departamentos = ['Tecnologia', 'Marketing', 'Financeiro', 'Recursos Humanos', 'Vendas'];
        const contratos = ['CLT', 'PJ', 'Estágio'];

        const randomnome = nomes[Math.floor(Math.random() * nomes.length)];
        const randomLastnome = lastnomes[Math.floor(Math.random() * lastnomes.length)];
        const randomcargo = cargos[Math.floor(Math.random() * cargos.length)];
        const randomdepartamento = departamentos[Math.floor(Math.random() * departamentos.length)];
        const randomsalario = (Math.random() * (10000 - 2000) + 2000).toFixed(2);
        console.log(randomsalario)
        const randomcontrato = contratos[Math.floor(Math.random() * contratos.length)];
        const randomadmissao = new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 365)));
        const formattedDate = randomadmissao.toLocaleDateString('pt-BR');

        return {
            nome: `${randomnome} ${randomLastnome}`,
            cargo: randomcargo,
            departamento: randomdepartamento,
            salario: `${randomsalario}`,
            contrato: randomcontrato,
            admissao: formattedDate
        };
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
        } else {
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
                employee.nome.toLowerCase().includes(searchTerm) ||
                employee.cargo.toLowerCase().includes(searchTerm) ||
                employee.departamento.toLowerCase().includes(searchTerm)
            );
        });
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