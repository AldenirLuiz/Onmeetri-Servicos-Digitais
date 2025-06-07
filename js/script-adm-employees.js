let editMode = false;
let editIndex = null;
// script-adm-employees.js

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");
    const employeeList = document.getElementById("employee-list");
    const btnClear = document.getElementById("form-btt-clear");

    // Função para carregar funcionários salvos
    function loadEmployees() {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    employeeList.innerHTML = ""; // Limpa antes de recarregar
    employees.forEach((emp, idx) => addEmployeeToTable(emp, idx));
    }
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const employees = JSON.parse(localStorage.getItem("employees")) || [];

        const filtered = employees.filter(emp =>
            emp.nome.toLowerCase().includes(query) ||
            emp.cargo.toLowerCase().includes(query) ||
            emp.departamento.toLowerCase().includes(query)
        );

        employeeList.innerHTML = "";
        filtered.forEach((emp, idx) => addEmployeeToTable(emp, idx));
    });



    // Função para adicionar funcionário na tabela
    function addEmployeeToTable(employee, index) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${employee.nome}</td>
        <td>${employee.cargo}</td>
        <td>${employee.departamento}</td>
        <td>R$ ${parseFloat(employee.salario).toFixed(2)}</td>
        <td>${employee.contrato}</td>
        <td>${employee.admissao}</td>
        <td>
            <button class="btn-edit" data-index="${index}">Editar</button>
            <button class="btn-delete" data-index="${index}">Excluir</button>
        </td>
    `;

    employeeList.appendChild(tr);
    }



    // Função para salvar funcionário
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const inputs = form.querySelectorAll("input");
        const [nome, cargo, departamento, salario, contrato, admissao] = [...inputs].map(i => i.value.trim());

        if (!nome || !cargo || !departamento || !salario || !contrato || !admissao) {
            alert("Preencha todos os campos.");
            return;
        }

        const employees = JSON.parse(localStorage.getItem("employees")) || [];
        const newEmployee = { nome, cargo, departamento, salario, contrato, admissao };

        if (editMode) {
            employees[editIndex] = newEmployee;
            editMode = false;
            editIndex = null;
        } else {
            employees.push(newEmployee);
        }

        localStorage.setItem("employees", JSON.stringify(employees));
        form.reset();
        loadEmployees();
    });

    // Event delegation para excluir
    employeeList.addEventListener("click", function (e) {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];

    if (e.target.classList.contains("btn-delete")) {
        const index = parseInt(e.target.dataset.index);
        employees.splice(index, 1);
        localStorage.setItem("employees", JSON.stringify(employees));
        loadEmployees();
    }

    if (e.target.classList.contains("btn-edit")) {
        editIndex = parseInt(e.target.dataset.index);
        const emp = employees[editIndex];

        const inputs = form.querySelectorAll("input");
        inputs[0].value = emp.nome;
        inputs[1].value = emp.cargo;
        inputs[2].value = emp.departamento;
        inputs[3].value = emp.salario;
        inputs[4].value = emp.contrato;
        inputs[5].value = emp.admissao;

        editMode = true;
    }
});



    // Botão limpar
    btnClear.addEventListener("click", function (e) {
        e.preventDefault();
        form.reset();
    });

    // Inicializar dados salvos
    loadEmployees();
});

// Exemplo de uso em mensagens
alert(langManager.translate('saveSuccess'));

// Exemplo de uso em elementos dinâmicos
element.textContent = langManager.translate('department');

