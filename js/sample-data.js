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

    // Função para gerar horário aleatório dentro de um intervalo
    function generateRandomTime(baseHour, baseMinute, variation) {
        const minutes = baseMinute + Math.floor(Math.random() * variation);
        const hours = baseHour + Math.floor(minutes / 60);
        const finalMinutes = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
    }

    // Função para gerar dados de ponto para um mês
    function generateMonthlyTimesheet(employee) {
        const timesheet = [];
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= Math.min(26, daysInMonth); day++) {
            const date = new Date(year, month, day);
            
            // Pula fins de semana
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            // 90% de chance de presença
            const isPresent = Math.random() < 0.9;

            if (isPresent) {
                timesheet.push({
                    date: date.toISOString().split('T')[0],
                    name: employee.nome,
                    department: employee.departamento,
                    role: employee.cargo,
                    morningIn: generateRandomTime(6, 25, 10),    // 6:25 - 6:35
                    morningOut: generateRandomTime(11, 25, 10),  // 11:25 - 11:35
                    afterIn: generateRandomTime(12, 55, 10),     // 12:55 - 13:05
                    afterOut: generateRandomTime(16, 55, 10),    // 16:55 - 17:05
                    checkMorning: true,
                    checkAfter: true
                });
            } else {
                // Dia com falta
                timesheet.push({
                    date: date.toISOString().split('T')[0],
                    name: employee.nome,
                    department: employee.departamento,
                    role: employee.cargo,
                    morningIn: "00:00",
                    morningOut: "00:00",
                    afterIn: "00:00",
                    afterOut: "00:00",
                    checkMorning: false,
                    checkAfter: false
                });
            }
        }

        return timesheet;
    }

    // Function to initialize the employee list with random data if it's empty
    function initializeEmployeeList() {
        let employees = getEmployees();
        let pointData = JSON.parse(localStorage.getItem('pointData')) || [];
        
        // Só gera novos dados se não existirem funcionários E pontos
        if (employees.length === 0 && pointData.length === 0) {
            console.log('Gerando dados aleatórios...');
            
            // Gerar funcionários aleatórios
            for (let i = 0; i < 10; i++) {
                employees.push(generateRandomEmployee(i + 1));
            }
            saveEmployees(employees);
            console.log('Funcionários gerados:', employees.length);

            // Gerar pontos aleatórios para cada funcionário
            let allTimesheet = [];
            employees.forEach(employee => {
                const timesheet = generateMonthlyTimesheet(employee);
                allTimesheet = [...allTimesheet, ...timesheet];
                console.log(`Pontos gerados para ${employee.nome}:`, timesheet.length);
            });

            // Salvar dados de ponto
            localStorage.setItem('pointData', JSON.stringify(allTimesheet));
            console.log('Total de pontos salvos:', allTimesheet.length);
        }
        
        // Verificar se os dados foram salvos
        const savedEmployees = getEmployees();
        const savedPoints = JSON.parse(localStorage.getItem('pointData')) || [];
        console.log('Funcionários no storage:', savedEmployees.length);
        console.log('Pontos no storage:', savedPoints.length);
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