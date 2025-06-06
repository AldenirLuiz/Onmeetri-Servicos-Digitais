document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("report-table-body");
    const totalFuncionarios = document.getElementById("total-funcionarios");
    const mediaSalarial = document.getElementById("media-salarial");
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let visibleData = [...employees]; // para armazenar os dados visíveis
    let chartDepartamento, chartSalario;


    const filterContract = document.getElementById("filter-contract");
    const sortBy = document.getElementById("sort-by");
    

    function renderTable(data) {
        tableBody.innerHTML = "";

        data.forEach(emp => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp.nome}</td>
                <td>${emp.cargo}</td>
                <td>${emp.departamento}</td>
                <td>R$ ${parseFloat(emp.salario).toFixed(2)}</td>
                <td>${emp.contrato}</td>
                <td>${emp.admissao}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function updateMetrics(data) {
        totalFuncionarios.textContent = data.length;

        const totalSalarios = data.reduce((acc, emp) => acc + parseFloat(emp.salario), 0);
        const media = data.length > 0 ? totalSalarios / data.length : 0;

        mediaSalarial.textContent = `R$ ${media.toFixed(2)}`;
    }

    function applyFiltersAndSort() {
        let filtered = [...employees];

        const contratoSelecionado = filterContract.value;
        if (contratoSelecionado) {
            filtered = filtered.filter(emp => emp.contrato === contratoSelecionado);
        }

        const ordem = sortBy.value;
        if (ordem === "salario") {
            filtered.sort((a, b) => parseFloat(b.salario) - parseFloat(a.salario));
        } else if (ordem === "admissao") {
            filtered.sort((a, b) => new Date(b.admissao) - new Date(a.admissao));
        }

        visibleData = filtered;

        renderTable(visibleData);
        updateMetrics(visibleData);
        updateCharts(visibleData); // 👈 atualiza os gráficos também
    }


    function updateCharts(data) {
        // Dados por departamento
        const porDepartamento = {};
        data.forEach(emp => {
            porDepartamento[emp.departamento] = (porDepartamento[emp.departamento] || 0) + 1;
        });

        const depLabels = Object.keys(porDepartamento);
        const depValues = Object.values(porDepartamento);

        // Dados salariais
        const nomes = data.map(emp => emp.nome);
        const salarios = data.map(emp => parseFloat(emp.salario));

        // Destrói gráficos anteriores se existirem
        if (chartDepartamento) chartDepartamento.destroy();
        if (chartSalario) chartSalario.destroy();

        // Gráfico de pizza (departamentos)
        chartDepartamento = new Chart(document.getElementById("departamentoChart"), {
            type: "pie",
            data: {
                labels: depLabels,
                datasets: [{
                    data: depValues,
                    backgroundColor: ["#6495ED", "#90EE90", "#FFA07A", "#FFDEAD", "#DDA0DD"]
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });

        // Gráfico de barras (salários)
        chartSalario = new Chart(document.getElementById("salarioChart"), {
            type: "bar",
            data: {
                labels: nomes,
                datasets: [{
                    label: "Salário (R$)",
                    data: salarios,
                    backgroundColor: "#6495ED"
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
}


    // Eventos
    filterContract.addEventListener("change", applyFiltersAndSort);
    sortBy.addEventListener("change", applyFiltersAndSort);

    // Inicialização
    applyFiltersAndSort();
    document.getElementById("export-excel").addEventListener("click", () => {
        const exportData = visibleData.map(emp => ({
            Nome: emp.nome,
            Cargo: emp.cargo,
            Departamento: emp.departamento,
            Salário: parseFloat(emp.salario).toFixed(2),
            Contrato: emp.contrato,
            Admissão: emp.admissao
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Funcionários");

        XLSX.writeFile(workbook, "relatorio_funcionarios.xlsx");
    });

    document.getElementById("export-pdf").addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const exportData = visibleData.map(emp => [
            emp.nome,
            emp.cargo,
            emp.departamento,
            `R$ ${parseFloat(emp.salario).toFixed(2)}`,
            emp.contrato,
            emp.admissao
        ]);

        doc.text("Relatório de Funcionários", 14, 15);
        doc.autoTable({
            head: [["Nome", "Cargo", "Departamento", "Salário", "Contrato", "Admissão"]],
            body: exportData,
            startY: 20,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [90, 131, 177] },
        });

        doc.save("relatorio_funcionarios.pdf");
    });
});

