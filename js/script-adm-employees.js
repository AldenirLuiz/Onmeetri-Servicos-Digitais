let editMode = false;
let editIndex = null;
// script-adm-employees.js

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");
    const employeeList = document.getElementById("employee-list");
    const employeeCards = document.getElementById("employee-cards");
    const btnClear = document.getElementById("form-btt-clear");
    const searchInput = document.getElementById("searchInput");
    const formInputs = {
        name: document.getElementById("name"),
        cargo: document.getElementById("cargo"),
        dept: document.getElementById("dept"),
        salario: document.getElementById("salario"),
        contrato: document.getElementById("contrato"),
        admission: document.getElementById("admission")
    };

    // Função para carregar funcionários salvos
    function loadEmployees() {
        const employees = JSON.parse(localStorage.getItem("employees")) || [];
        employeeList.innerHTML = ""; // Limpa antes de recarregar
        employeeCards.innerHTML = ""; // Limpa cards
        employees.forEach((emp, idx) => {
            addEmployeeToTable(emp, idx);
            addEmployeeCard(emp, idx);
        });
    }

    // Função para adicionar funcionário na tabela (desktop)
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

    // Função para adicionar funcionário em card (mobile)
    function addEmployeeCard(employee, index) {
        const card = document.createElement("div");
        card.className = "employee-card";
        card.innerHTML = `
            <div class="card-header">
                <h3>${employee.nome}</h3>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="card-field-label">Cargo:</span>
                    <span class="card-field-value">${employee.cargo}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Departamento:</span>
                    <span class="card-field-value">${employee.departamento}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Salário:</span>
                    <span class="card-field-value">R$ ${parseFloat(employee.salario).toFixed(2)}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Contrato:</span>
                    <span class="card-field-value">${employee.contrato}</span>
                </div>
                <div class="card-field">
                    <span class="card-field-label">Admissão:</span>
                    <span class="card-field-value">${employee.admissao}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-edit" data-index="${index}">Editar</button>
                <button class="btn-delete" data-index="${index}">Excluir</button>
            </div>
        `;
        employeeCards.appendChild(card);
    }


    // Evento de busca
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const employees = JSON.parse(localStorage.getItem("employees")) || [];

        const filtered = employees.filter(emp =>
            emp.nome.toLowerCase().includes(query) ||
            emp.cargo.toLowerCase().includes(query) ||
            emp.departamento.toLowerCase().includes(query)
        );

        employeeList.innerHTML = "";
        employeeCards.innerHTML = "";
        filtered.forEach((emp, idx) => {
            addEmployeeToTable(emp, idx);
            addEmployeeCard(emp, idx);
        });
    });
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = formInputs.name.value.trim();
        const cargo = formInputs.cargo.value.trim();
        const departamento = formInputs.dept.value.trim();
        const salario = formInputs.salario.value.trim();
        const contrato = formInputs.contrato.value.trim();
        const admissao = formInputs.admission.value.trim();

        if (!nome || !cargo || !departamento || !salario || !contrato || !admissao) {
            alert("Preencha todos os campos.");
            return;
        }

        const employees = JSON.parse(localStorage.getItem("employees")) || [];
        const employeeId = editMode && employees[editIndex] && employees[editIndex].id ? employees[editIndex].id : Date.now().toString();
        const newEmployee = { id: employeeId, nome, cargo, departamento, salario, contrato, admissao };

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

    // Event delegation para editar e excluir
    function handleEmployeeAction(e) {
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

            formInputs.name.value = emp.nome;
            formInputs.cargo.value = emp.cargo;
            formInputs.dept.value = emp.departamento;
            formInputs.salario.value = emp.salario;
            formInputs.contrato.value = emp.contrato;
            formInputs.admission.value = emp.admissao;

            editMode = true;
            // Scroll to form
            form.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Event listeners para desktop (tabela)
    employeeList.addEventListener("click", handleEmployeeAction);

    // Event listeners para mobile (cards)
    employeeCards.addEventListener("click", handleEmployeeAction);



    // Botão limpar
    btnClear.addEventListener("click", function (e) {
        e.preventDefault();
        form.reset();
    });

    // Inicializar dados salvos
    loadEmployees();
});