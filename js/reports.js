document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("report-table-body");
    const totalFuncionarios = document.getElementById("total-funcionarios");
    const mediaSalarial = document.getElementById("media-salarial");
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let visibleData = [...employees]; // para armazenar os dados visíveis
    let chartDepartamento, chartSalario;


    const filterField = document.getElementById("filter-field");
    const filterValue = document.getElementById("filter-value");
    const chartGroup = document.getElementById("chart-group");
    const sortBy = document.getElementById("sort-by");
    const reportType = document.getElementById("report-type");
    const dateFromInput = document.getElementById("date-from");
    const dateToInput = document.getElementById("date-to");
    const dateRangeGroup = document.querySelector(".date-range-group");
    const toggleAdvanced = document.getElementById("toggle-advanced");
    const advancedOptions = document.getElementById("advanced-options");
    const chart1Title = document.getElementById("chart1-title");
    const chart2Title = document.getElementById("chart2-title");
    const pointData = JSON.parse(localStorage.getItem("pointData")) || [];
    const tableHead = document.querySelector("#report-table-body").closest("table").querySelector("thead");

    function parsePTBRDate(dateString) {
        if (!dateString) return null;
        const [day, month, year] = dateString.split("/");
        return new Date(`${year}-${month}-${day}`);
    }

    function parseISODate(dateString) {
        return dateString ? new Date(dateString) : null;
    }

    function isWithinDateRange(valueDate, startDate, endDate) {
        if (!valueDate || isNaN(valueDate.getTime())) return false;
        if (startDate && valueDate < startDate) return false;
        if (endDate && valueDate > endDate) return false;
        return true;
    }

    function formatDateForDisplay(dateString) {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    function setDefaultDateRange() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        dateFromInput.value = `${year}-${month}-01`;
        dateToInput.value = `${year}-${month}-15`;
    }

    function getUniqueFilterValues(field) {
        return [...new Set(employees.map(emp => emp[field] || ""))]
            .filter(value => value !== "")
            .sort((a, b) => a.localeCompare(b, "pt-BR"));
    }

    function populateFilterValues() {
        const field = filterField.value;
        const values = getUniqueFilterValues(field);
        filterValue.innerHTML = "<option value=\"\">Todos</option>";

        values.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            filterValue.appendChild(option);
        });
    }

    function getGroupLabel() {
        return chartGroup.value === "cargo" ? "Cargo" : "Departamento";
    }

    function updateDateRangeVisibility() {
        if (reportType.value === "presence") {
            dateRangeGroup.style.display = "flex";
            if (!dateFromInput.value && !dateToInput.value) {
                setDefaultDateRange();
            }
        } else {
            dateRangeGroup.style.display = "none";
            dateFromInput.value = "";
            dateToInput.value = "";
        }
    }

    function updateTableHeaders() {
        if (reportType.value === "presence") {
            tableHead.innerHTML = `
                <tr>
                    <th>Nome</th>
                    <th>Departamento</th>
                    <th>Contrato</th>
                    <th>Dias Registrados</th>
                    <th>Manhã</th>
                    <th>Tarde</th>
                    <th>Total de Presenças</th>
                    <th>Taxa de Presença</th>
                </tr>
            `;
        } else {
            tableHead.innerHTML = `
                <tr>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Departamento</th>
                    <th>Salário</th>
                    <th>Contrato</th>
                    <th>Admissão</th>
                </tr>
            `;
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = "";

        if (reportType.value === "presence") {
            data.forEach(emp => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td class="name">${emp.nome}</td>
                    <td>${emp.departamento}</td>
                    <td>${emp.contrato}</td>
                    <td>${emp.totalDays}</td>
                    <td>${emp.presentMorning}</td>
                    <td>${emp.presentAfternoon}</td>
                    <td>${emp.totalPresences}</td>
                    <td>${emp.presenceRate.toFixed(2)}%</td>
                `;
                tableBody.appendChild(tr);
            });
        } else {
            data.forEach(emp => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td class="name">${emp.nome}</td>
                    <td>${emp.cargo}</td>
                    <td>${emp.departamento}</td>
                    <td>R$ ${parseFloat(emp.salario).toFixed(2)}</td>
                    <td>${emp.contrato}</td>
                    <td>${emp.admissao}</td>
                `;
                tableBody.appendChild(tr);
            });
        }
    }

    const metric1Label = document.getElementById("metric-1-label");
    const metric2Label = document.getElementById("metric-2-label");

    function updateMetrics(data) {
        totalFuncionarios.textContent = data.length;

        if (reportType.value === "presence") {
            metric1Label.textContent = "Total de Funcionários:";
            metric2Label.textContent = "Média de Presença:";

            const totalRecords = data.reduce((acc, emp) => acc + emp.totalDays, 0);
            const avgPresence = data.length > 0 ? data.reduce((acc, emp) => acc + emp.presenceRate, 0) / data.length : 0;

            mediaSalarial.textContent = `${avgPresence.toFixed(2)}% (${totalRecords} registros)`;
        } else {
            metric1Label.textContent = "Total de Funcionários:";
            metric2Label.textContent = "Média Salarial:";

            const totalSalarios = data.reduce((acc, emp) => acc + parseFloat(emp.salario), 0);
            const media = data.length > 0 ? totalSalarios / data.length : 0;

            mediaSalarial.textContent = `R$ ${media.toFixed(2)}`;
        }
    }

    function getPresenceData(filteredEmployees) {
        return filteredEmployees.map(emp => {
            const fromDate = dateFromInput.value ? new Date(dateFromInput.value) : null;
            const toDate = dateToInput.value ? new Date(dateToInput.value) : null;
            const entries = pointData.filter(entry => {
                const matchesEmployee = String(entry.employeeId) === String(emp.id) || entry.name === emp.nome;
                const entryDate = parseISODate(entry.date);
                return matchesEmployee && (!fromDate && !toDate || isWithinDateRange(entryDate, fromDate, toDate));
            });
            const totalDays = entries.length;
            const presentMorning = entries.filter(entry => entry.checkMorning).length;
            const presentAfternoon = entries.filter(entry => entry.checkAfter).length;
            const totalPresences = presentMorning + presentAfternoon;
            const presenceRate = totalDays > 0 ? (totalPresences / (totalDays * 2)) * 100 : 0;

            return {
                ...emp,
                totalDays,
                presentMorning,
                presentAfternoon,
                totalPresences,
                presenceRate
            };
        });
    }

    function applyFiltersAndSort() {
        let filtered = [...employees];

        const selectedField = filterField.value;
        const selectedValue = filterValue.value;
        if (selectedValue) {
            filtered = filtered.filter(emp => emp[selectedField] === selectedValue);
        }

        const startDate = dateFromInput.value ? new Date(dateFromInput.value) : null;
        const endDate = dateToInput.value ? new Date(dateToInput.value) : null;

        if (reportType.value === "employees" && (startDate || endDate)) {
            filtered = filtered.filter(emp => {
                const admissionDate = parsePTBRDate(emp.admissao);
                return isWithinDateRange(admissionDate, startDate, endDate);
            });
        }

        const ordem = sortBy.value;
        if (reportType.value === "presence") {
            let presenceData = getPresenceData(filtered);

            if (startDate || endDate) {
                presenceData = presenceData.filter(emp => emp.totalDays > 0);
            }

            if (ordem === "salario") {
                presenceData.sort((a, b) => b.presenceRate - a.presenceRate);
            } else if (ordem === "admissao") {
                presenceData.sort((a, b) => b.totalDays - a.totalDays);
            }
            visibleData = presenceData;
        } else {
            if (ordem === "salario") {
                filtered.sort((a, b) => parseFloat(b.salario) - parseFloat(a.salario));
            } else if (ordem === "admissao") {
                filtered.sort((a, b) => parsePTBRDate(b.admissao) - parsePTBRDate(a.admissao));
            }
            visibleData = filtered;
        }

        updateTableHeaders();
        renderTable(visibleData);
        updateMetrics(visibleData);
        updateCharts(visibleData);
    }

    function updateCharts(data) {
        if (reportType.value === "presence") {
            const groupLabel = getGroupLabel();
            chart1Title.textContent = "Taxa de Presença por Cargo";
            chart2Title.textContent = `Presença Média por ${groupLabel}`;

            // Agrupar por cargo
            const cargoRates = {};
            data.forEach(emp => {
                const cargo = emp.cargo || 'Sem Cargo';
                if (!cargoRates[cargo]) cargoRates[cargo] = [];
                cargoRates[cargo].push(emp.presenceRate);
            });

            const cargoLabels = Object.keys(cargoRates);
            const cargoValues = cargoLabels.map(cargo => {
                const rates = cargoRates[cargo];
                return rates.reduce((acc, rate) => acc + rate, 0) / rates.length;
            });

            const groupRates = {};
            data.forEach(emp => {
                const key = emp[chartGroup.value] || `Sem ${groupLabel}`;
                if (!groupRates[key]) groupRates[key] = [];
                groupRates[key].push(emp.presenceRate);
            });

            const depLabels = Object.keys(groupRates);
            const depValues = depLabels.map(label => {
                const values = groupRates[label];
                return values.reduce((acc, value) => acc + value, 0) / values.length;
            });

            if (chartDepartamento) chartDepartamento.destroy();
            if (chartSalario) chartSalario.destroy();

            chartDepartamento = new Chart(document.getElementById("departamentoChart"), {
                type: "bar",
                data: {
                    labels: cargoLabels,
                    datasets: [{
                        label: "Presença (%)",
                        data: cargoValues.map(v => v.toFixed(2)),
                        backgroundColor: "#6495ED"
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });

            chartSalario = new Chart(document.getElementById("salarioChart"), {
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
        } else {
            const groupLabel = getGroupLabel();
            chart1Title.textContent = `Funcionários por ${groupLabel}`;
            chart2Title.textContent = `Distribuição Salarial`;

            const groupCounts = {};
            data.forEach(emp => {
                const groupKey = emp[chartGroup.value] || `Sem ${groupLabel}`;
                groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;
            });

            const depLabels = Object.keys(groupCounts);
            const depValues = Object.values(groupCounts);

            const nomes = data.map(emp => emp.nome);
            const salarios = data.map(emp => parseFloat(emp.salario));

            if (chartDepartamento) chartDepartamento.destroy();
            if (chartSalario) chartSalario.destroy();

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
    }


    // Eventos
    filterField.addEventListener("change", () => {
        populateFilterValues();
        applyFiltersAndSort();
    });
    filterValue.addEventListener("change", applyFiltersAndSort);
    chartGroup.addEventListener("change", applyFiltersAndSort);
    sortBy.addEventListener("change", applyFiltersAndSort);
    reportType.addEventListener("change", () => {
        updateDateRangeVisibility();
        applyFiltersAndSort();
    });
    dateFromInput.addEventListener("change", applyFiltersAndSort);
    dateToInput.addEventListener("change", applyFiltersAndSort);
    toggleAdvanced.addEventListener("click", () => {
        advancedOptions.classList.toggle("hidden");
        toggleAdvanced.textContent = advancedOptions.classList.contains("hidden") ? "Mais opções ▾" : "Menos opções ▴";
    });

    // Inicialização
    setDefaultDateRange();
    updateDateRangeVisibility();
    populateFilterValues();
    applyFiltersAndSort();
    document.getElementById("export-excel").addEventListener("click", () => {
        let exportData;
        let sheetName;
        let fileName;

        if (reportType.value === "presence") {
            exportData = visibleData.map(emp => ({
                Nome: emp.nome,
                Departamento: emp.departamento,
                Contrato: emp.contrato,
                "Dias Registrados": emp.totalDays,
                "Manhã": emp.presentMorning,
                "Tarde": emp.presentAfternoon,
                "Total de Presenças": emp.totalPresences,
                "Taxa de Presença (%)": emp.presenceRate.toFixed(2)
            }));
            sheetName = "Presença";
            fileName = "relatorio_presenca.xlsx";
        } else {
            exportData = visibleData.map(emp => ({
                Nome: emp.nome,
                Cargo: emp.cargo,
                Departamento: emp.departamento,
                Salário: parseFloat(emp.salario).toFixed(2),
                Contrato: emp.contrato,
                Admissão: emp.admissao
            }));
            sheetName = "Funcionários";
            fileName = "relatorio_funcionarios.xlsx";
        }

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, fileName);
    });

    document.getElementById("export-pdf").addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPosition = 15;

        let exportData;
        let heading;
        let headers;

        if (reportType.value === "presence") {
            heading = "Relatório de Presença";
            headers = [["Nome", "Departamento", "Contrato", "Dias Registrados", "Manhã", "Tarde", "Total Presenças", "Taxa de Presença (%)"]];
            exportData = visibleData.map(emp => [
                emp.nome,
                emp.departamento,
                emp.contrato,
                emp.totalDays,
                emp.presentMorning,
                emp.presentAfternoon,
                emp.totalPresences,
                emp.presenceRate.toFixed(2)
            ]);
        } else {
            heading = "Relatório de Funcionários";
            headers = [["Nome", "Cargo", "Departamento", "Salário", "Contrato", "Admissão"]];
            exportData = visibleData.map(emp => [
                emp.nome,
                emp.cargo,
                emp.departamento,
                `R$ ${parseFloat(emp.salario).toFixed(2)}`,
                emp.contrato,
                emp.admissao
            ]);
        }

        doc.text(heading, 14, yPosition);
        const periodLabel = dateFromInput.value || dateToInput.value
            ? `Período: ${formatDateForDisplay(dateFromInput.value)} - ${formatDateForDisplay(dateToInput.value)}`
            : "Período: Todos";
        doc.text(periodLabel, 14, yPosition + 8);
        
        // Adicionar gráficos com proporção correta
        try {
            const chartDepartamentoCanvas = document.getElementById("departamentoChart");
            const chartSalarioCanvas = document.getElementById("salarioChart");
            
            if (chartDepartamentoCanvas && chartSalarioCanvas) {
                const chart1Image = chartDepartamentoCanvas.toDataURL("image/png");
                const chart2Image = chartSalarioCanvas.toDataURL("image/png");
                
                // Calcular proporção dos canvas
                const ratio1 = chartDepartamentoCanvas.width / chartDepartamentoCanvas.height;
                const ratio2 = chartSalarioCanvas.width / chartSalarioCanvas.height;
                
                // Dimensões ajustadas mantendo proporção
                const height1 = 45;
                const width1 = height1 * ratio1;
                const height2 = 45;
                const width2 = height2 * ratio2;
                
                // Adicionar gráficos com proporção mantida
                yPosition += 25;
                doc.addImage(chart1Image, "PNG", 12, yPosition, width1, height1);
                doc.addImage(chart2Image, "PNG", 12 + width1 + 10, yPosition, width2, height2);
                
                yPosition += height1 + 10;
            }
        } catch (error) {
            console.error("Erro ao adicionar gráficos:", error);
        }
        
        doc.autoTable({
            head: headers,
            body: exportData,
            startY: yPosition,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [90, 131, 177] },
        });

        const fileName = reportType.value === "presence" ? "relatorio_presenca.pdf" : "relatorio_funcionarios.pdf";
        const dateRange = dateFromInput.value || dateToInput.value
            ? `_${dateFromInput.value || 'inicio'}_${dateToInput.value || 'fim'}`
            : "";
        const finalFileName = fileName.replace('.pdf', `${dateRange}.pdf`);
        doc.save(finalFileName);
    });
});

