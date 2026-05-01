document.addEventListener("DOMContentLoaded", function () {
  // Helper functions for test data
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
    const randomcontrato = contratos[Math.floor(Math.random() * contratos.length)];
    const randomadmissao = new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 365)));
    const formattedDate = randomadmissao.toLocaleDateString('pt-BR');

    return {
        id: `employee-${id}`,
        nome: `${randomnome} ${randomLastnome}`,
        cargo: randomcargo,
        departamento: randomdepartamento,
        salario: `${randomsalario}`,
        contrato: randomcontrato,
        admissao: formattedDate
    };
  }

  function generateRandomTime(baseHour, baseMinute, variation) {
    const minutes = baseMinute + Math.floor(Math.random() * variation);
    const hours = baseHour + Math.floor(minutes / 60);
    const finalMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
  }

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
                employeeId: employee.id,
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
                employeeId: employee.id,
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

  function loadTestData() {
    let employees = [];
    let pointData = [];
    
    // Gerar funcionários aleatórios
    for (let i = 0; i < 10; i++) {
        employees.push(generateRandomEmployee(i + 1));
    }
    localStorage.setItem('employees', JSON.stringify(employees));

    // Gerar pontos aleatórios para cada funcionário
    employees.forEach(employee => {
        const timesheet = generateMonthlyTimesheet(employee);
        pointData = [...pointData, ...timesheet];
    });

    // Salvar dados de ponto
    localStorage.setItem('pointData', JSON.stringify(pointData));
  }

  // Get DOM elements
  const tableData = document.getElementById("table-data");
  const btSave = document.getElementById("btt-save-table");
  const tableDate = document.getElementById("tableDate");
  const modal = document.getElementById("entryModal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementsByClassName("close")[0];
  const summaryDate = document.getElementById("summaryDate");
  const summaryContent = document.getElementById("summaryContent");
  const exportPDF = document.getElementById("exportPDF");
  const exportExcel = document.getElementById("exportExcel");
  const firstAccessModal = document.getElementById("firstAccessModal");
  const confirmLoadData = document.getElementById("confirmLoadData");
  const cancelLoadData = document.getElementById("cancelLoadData");
  const tutorialModal = document.getElementById("tutorialModal");
  const entryModal = document.getElementById("entryModal");
  const closeTutorial = document.getElementById("closeTutorial");
  const dontShowTutorial = document.getElementById("dontShowTutorial");
  const closeTutorialBtn = document.getElementsByClassName("close-tutorial")[0];

  // Error checking for required elements
  if (!tableData) {
    console.error('Table element not found');
    return;
  }

  // Add table header
  const tableHeader = `
    <thead>
      <tr>
        <th>Nome</th>
        <th>Período Manhã</th>
        <th>Período Tarde</th>
        <th>Manhã</th>
        <th>Tarde</th>
        <th>Presença</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  tableData.innerHTML = tableHeader;

  // Function to setup presence checkbox listeners for desktop view
  function setupPresenceCheckboxes() {
    const rows = tableData.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const presenceCheckbox = row.querySelector('.check-presence-input');
      const morningCheckbox = row.querySelector('.check-morning-input');
      const afternoonCheckbox = row.querySelector('.check-after-input');
      
      if (presenceCheckbox && morningCheckbox && afternoonCheckbox) {
        // Setup presence checkbox change event
        presenceCheckbox.addEventListener('change', function() {
          if (this.checked) {
            // Mark both periods and disable them
            morningCheckbox.checked = true;
            afternoonCheckbox.checked = true;
            morningCheckbox.disabled = true;
            afternoonCheckbox.disabled = true;
          } else {
            // Enable period checkboxes
            morningCheckbox.disabled = false;
            afternoonCheckbox.disabled = false;
          }
        });

        // Check initial state
        if (presenceCheckbox.checked) {
          morningCheckbox.checked = true;
          afternoonCheckbox.checked = true;
          morningCheckbox.disabled = true;
          afternoonCheckbox.disabled = true;
        }
      }
    });
  }

  // Function to populate table with saved employees
  function populateEmployeeTable() {
    const tbody = tableData.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
    
    // Get employees from localStorage
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    
    if (employees.length === 0) {
      console.log("No employees found in localStorage");
      return;
    }

    // Create a Set to track unique names
    const uniqueNames = new Set();
    
    employees.forEach((emp) => {
      // Skip if name already exists
      if (uniqueNames.has(emp.nome)) return;
      
      // Add name to Set
      uniqueNames.add(emp.nome);
      
      const newLine = `
        <tr class="tr-line">
          <td class="name">${emp.nome}</td>
          <td><div class="time-inputs"><input type="time" class="morning-in" value="06:30" title="Entrada Manhã"><input type="time" class="morning-out" title="Saída Manhã" value="11:30"></div></td>
          <td><div class="time-inputs"><input type="time" class="after-in" value="13:00" title="Entrada Tarde"><input type="time" class="after-out" title="Saída Tarde" value="17:00"></div></td>
          <td class="check-morning" style="text-align: center; vertical-align: middle; width: 15px;">
            <input type="checkbox" class="check-morning-input" unchecked />
          </td>
          <td class="check-after" style="text-align: center; vertical-align: middle; width: 15px;">
            <input type="checkbox" class="check-after-input" unchecked />
          </td>
          <td class="check-presence" style="text-align: center; vertical-align: middle; width: 15px;">
            <input type="checkbox" class="check-presence-input" checked />
          </td>
        </tr>`;
      tbody.insertAdjacentHTML('beforeend', newLine);
    });
    
    // Setup presence checkbox interactions after adding rows
    setupPresenceCheckboxes();
  }

  // Initial table population
  populateEmployeeTable();

  // Check for first access
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const pointData = JSON.parse(localStorage.getItem("pointData")) || [];
  if (employees.length === 0 && pointData.length === 0) {
    firstAccessModal.style.display = "flex";
  }

  // Check if tutorial should be shown
  const showTutorial = localStorage.getItem("showTutorial") !== "false";
  if (showTutorial) {
    tutorialModal.style.display = "flex";
  }

  // Set default dates
  if (tableDate) tableDate.valueAsDate = new Date();
  if (summaryDate) summaryDate.valueAsDate = new Date();

  // Remove existing event listeners
  const newBtSave = btSave.cloneNode(true);
  btSave.parentNode.replaceChild(newBtSave, btSave);

  // Add single save event listener
  newBtSave.addEventListener("click", function () {
    const desktopView = document.querySelector('.desktop-view');
    if (desktopView && window.getComputedStyle(desktopView).display === 'none') {
      return; // ignore save from desktop handler when mobile view is active
    }

    if (!tableDate.value) {
      alert('Por favor, selecione uma data para o ponto!');
      return;
    }

    const rows = Array.from(tableData.querySelectorAll('tbody tr'));
    const pointData = rows.map(row => {
      const name = row.querySelector('.name').textContent;
      const employee = JSON.parse(localStorage.getItem("employees"))?.find(emp => emp.nome === name) || {};
      
      return {
        date: tableDate.value,
        name: name,
        department: employee.departamento || '',
        role: employee.cargo || '',
        morningIn: row.querySelector('.morning-in').value,
        morningOut: row.querySelector('.morning-out').value,
        afterIn: row.querySelector('.after-in').value,
        afterOut: row.querySelector('.after-out').value,
        checkMorning: row.querySelector('.check-morning-input').checked,
        checkAfter: row.querySelector('.check-after-input').checked,
        checkPresence: row.querySelector('.check-presence-input').checked
      };
    });

    const existingData = JSON.parse(localStorage.getItem('pointData')) || [];
    const filteredData = existingData.filter(entry => entry.date !== tableDate.value);
    const updatedData = [...filteredData, ...pointData];
    
    localStorage.setItem('pointData', JSON.stringify(updatedData));
    
    alert('Dados salvos com sucesso!');
    updateSummary();
  });

  // Close modals when clicking outside
  window.onclick = (event) => {
      if (event.target == modal) modal.style.display = "none";
      if (event.target == tutorialModal) tutorialModal.style.display = "none";
  }

  // First access modal buttons
  confirmLoadData.addEventListener("click", function() {
    loadTestData();
    firstAccessModal.style.display = "none";
    populateEmployeeTable(); // Refresh table
    updateSummary(); // Update summary
  });

  cancelLoadData.addEventListener("click", function() {
    firstAccessModal.style.display = "none";
  });

  // Tutorial modal buttons
  closeTutorial.addEventListener("click", function() {
    if (dontShowTutorial.checked) {
      localStorage.setItem("showTutorial", "false");
    }
    tutorialModal.style.display = "none";
  });

  closeBtn.addEventListener("click", function() {
    entryModal.style.display = "none";
  });

  closeTutorialBtn.onclick = () => tutorialModal.style.display = "none";
  window.onclick = (event) => {
      if (event.target == tutorialModal) tutorialModal.style.display = "none";
  }

  // Function to show entry details
  function showEntryDetails(entry) {
      modalContent.innerHTML = `
          <h3>${getEntryName(entry)}</h3>
          <p><strong>Período Manhã:</strong> ${entry.checkMorning ? `${entry.morningIn} - ${entry.morningOut}` : 'Falta'}</p>
          <p><strong>Período Tarde:</strong> ${entry.checkAfter ? `${entry.afterIn} - ${entry.afterOut}` : 'Falta'}</p>
          <p><strong>Total de Horas:</strong> ${calculateTotalHours(entry)}</p>
      `;
      modal.style.display = "block";
  }

  // Function to calculate total hours
  function calculateTotalHours(entry) {
      let total = 0;
      if (entry.checkMorning) {
          const morning = getHoursDiff(entry.morningIn, entry.morningOut);
          total += morning;
      }
      if (entry.checkAfter) {
          const afternoon = getHoursDiff(entry.afterIn, entry.afterOut);
          total += afternoon;
      }
      return total.toFixed(2);
  }

  // Function to get hours difference
  function getHoursDiff(start, end) {
      const [startHours, startMins] = start.split(':').map(Number);
      const [endHours, endMins] = end.split(':').map(Number);
      return (endHours - startHours) + (endMins - startMins) / 60;
  }

  function getEntryName(entry) {
      if (entry.name) return entry.name;
      if (entry.employeeId) {
          const employee = JSON.parse(localStorage.getItem("employees"))?.find(emp => emp.id === entry.employeeId);
          return employee?.nome || entry.employeeId;
      }
      return 'Funcionário desconhecido';
  }

  // Update summary when date changes

  // Add export functions
  function exportToPDF(data) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Calculate totals
      const totals = data.reduce((acc, entry) => {
          const name = getEntryName(entry);
          if (!acc[name]) {
              acc[name] = {
                  totalHours: 0,
                  presentMorning: 0,
                  presentAfternoon: 0,
                  totalDays: 0
              };
          }

          acc[name].totalHours += parseFloat(calculateTotalHours(entry));
          if (entry.checkMorning) acc[name].presentMorning++;
          if (entry.checkAfter) acc[name].presentAfternoon++;
          acc[name].totalDays++;

          return acc;
      }, {});

      // Regular table data
      const tableColumns = [
          { header: 'Nome', dataKey: 'name' },
          { header: 'Data', dataKey: 'date' },
          { header: 'Manhã', dataKey: 'morning' },
          { header: 'Tarde', dataKey: 'afternoon' },
          { header: 'Total Horas', dataKey: 'total' }
      ];

      const tableRows = data.map(entry => ({
          name: getEntryName(entry),
          date: new Date(entry.date).toLocaleDateString(),
          morning: entry.checkMorning ? `${entry.morningIn}-${entry.morningOut}` : 'Falta',
          afternoon: entry.checkAfter ? `${entry.afterIn}-${entry.afterOut}` : 'Falta',
          total: calculateTotalHours(entry)
      }));

      // Add summary rows
      const summaryRows = Object.entries(totals).map(([name, stats]) => ({
          name: `${name} - TOTAL`,
          date: `${stats.totalDays} dias`,
          morning: `${stats.presentMorning} presenças`,
          afternoon: `${stats.presentAfternoon} presenças`,
          total: `${stats.totalHours.toFixed(2)}h`
      }));

      doc.autoTable({
          columns: tableColumns,
          body: [...tableRows, { name: '', date: '', morning: '', afternoon: '', total: '' }, ...summaryRows],
          startY: 20,
          head: [tableColumns.map(col => col.header)],
          theme: 'grid',
          didDrawCell: (data) => {
              // Highlight summary rows
              if (tableRows.length + 1 <= data.row.index) {
                  data.cell.styles.fontStyle = 'bold';
                  data.cell.styles.fillColor = [240, 240, 240];
              }
          }
      });

      doc.save('timesheet.pdf');
  }

function exportToExcel(data) {
    // Calculate totals
    const totals = data.reduce((acc, entry) => {
        const name = getEntryName(entry);
        if (!acc[name]) {
            acc[name] = {
                totalHours: 0,
                presentMorning: 0,
                presentAfternoon: 0,
                totalDays: 0
            };
        }
        
        acc[name].totalHours += parseFloat(calculateTotalHours(entry));
        if (entry.checkMorning) acc[name].presentMorning++;
        if (entry.checkAfter) acc[name].presentAfternoon++;
        acc[name].totalDays++;
        
        return acc;
    }, {});

    // Regular data rows
    const rows = data.map(entry => ({
        Nome: getEntryName(entry),
        Data: new Date(entry.date).toLocaleDateString(),
        'Período Manhã': entry.checkMorning ? `${entry.morningIn}-${entry.morningOut}` : 'Falta',
        'Período Tarde': entry.checkAfter ? `${entry.afterIn}-${entry.afterOut}` : 'Falta',
        'Total Horas': calculateTotalHours(entry)
    }));

    // Add empty row and summary rows
    const summaryRows = Object.entries(totals).map(([name, stats]) => ({
        Nome: `${name} - RESUMO`,
        Data: `Total Dias: ${stats.totalDays}`,
        'Período Manhã': `Presenças: ${stats.presentMorning}`,
        'Período Tarde': `Presenças: ${stats.presentAfternoon}`,
        'Total Horas': `${stats.totalHours.toFixed(2)}h`
    }));

    const ws = XLSX.utils.json_to_sheet([...rows, {}, ...summaryRows]);

    // Style the summary rows (Excel)
    const range = XLSX.utils.decode_range(ws['!ref']);
    const summaryStart = rows.length + 2;
    for (let R = summaryStart; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = ws[XLSX.utils.encode_cell({r: R, c: C})];
            if (!cell) continue;
            cell.s = { font: { bold: true }, fill: { fgColor: { rgb: "EEEEEE" } } };
        }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet");
    XLSX.writeFile(wb, 'timesheet.xlsx');
}

// Update summary when date changes
summaryDate.addEventListener('change', updateSummary);


// Add export functions
exportPDF.addEventListener('click', () => {
    const savedData = JSON.parse(localStorage.getItem('pointData')) || [];
    const selectedDate = summaryDate.value;
    
    const filteredData = summaryType.value === 'monthly' 
        ? savedData.filter(entry => {
            const [yearMonth] = selectedDate.split('-').slice(0, 2);
            return entry.date && entry.date.startsWith(yearMonth);
          })
        : savedData.filter(entry => entry.date === selectedDate);
    
    if (filteredData.length === 0) {
        alert('Nenhum dado encontrado para o período selecionado');
        return;
    }
    
    exportToPDF(filteredData);
});

exportExcel.addEventListener('click', () => {
    const savedData = JSON.parse(localStorage.getItem('pointData')) || [];
    const selectedDate = summaryDate.value;
    
    const filteredData = summaryType.value === 'monthly' 
        ? savedData.filter(entry => {
            const [yearMonth] = selectedDate.split('-').slice(0, 2);
            return entry.date && entry.date.startsWith(yearMonth);
          })
        : savedData.filter(entry => entry.date === selectedDate);
    
    if (filteredData.length === 0) {
        alert('Nenhum dado encontrado para o período selecionado');
        return;
    }
    
    exportToExcel(filteredData);
});

  function updateSummary() {
      const selectedDate = summaryDate.value;
      const savedData = JSON.parse(localStorage.getItem('pointData')) || [];
      
      const filteredData = savedData.filter(entry => entry.date === selectedDate);
      
      const summary = filteredData.map(entry => `
          <div class="entry-row" data-entry='${JSON.stringify(entry)}'>
              <strong>${getEntryName(entry)}</strong> - 
              Total de Horas: ${calculateTotalHours(entry)}h
          </div>
      `).join('');

      summaryContent.innerHTML = summary || '<p>Nenhuma entrada encontrada para esta data.</p>';
  }

  // Add click event listener to summary content container
  summaryContent.addEventListener('click', function(event) {
      const entryRow = event.target.closest('.entry-row');
      if (entryRow) {
          const entry = JSON.parse(entryRow.dataset.entry);
          showEntryDetails(entry);
      }
  });

  // Update summary after saving
  btSave.addEventListener("click", function() {
      updateSummary();
  });

  // Initial summary update
  updateSummary();
});

// Add after your existing code
document.addEventListener("DOMContentLoaded", async function() {
    // Get DOM elements
    const tableDate = document.getElementById("tableDate");
    const employeeCards = document.getElementById("employee-cards");
    const saveButton = document.getElementById("btt-save-table");

    // Set today's date as default
    tableDate.valueAsDate = new Date();

    // Load and display employees
    function loadEmployees() {
        let employees = JSON.parse(localStorage.getItem("employees")) || [];
        let updated = false;
        employees = employees.map((emp, idx) => {
            if (!emp.id) {
                updated = true;
                return { ...emp, id: `employee-${Date.now()}-${idx}` };
            }
            return emp;
        });
        if (updated) {
            localStorage.setItem("employees", JSON.stringify(employees));
        }

        if (employees.length === 0) {
            employeeCards.innerHTML = '<p class="no-data">Nenhum funcionário cadastrado</p>';
            return;
        }
        
        // Clear existing content
        employeeCards.innerHTML = '';

        // Create card for each employee
        employees.forEach(emp => {
            const card = `
                <div class="employee-card" data-employee-id="${emp.id}">
                    <div class="card-header">
                        <h3>${emp.nome}</h3>
                        <span class="department">${emp.departamento}</span>
                    </div>
                    
                    <div class="presence-section">
                        <div class="presence-check main-presence">
                            <input type="checkbox" class="check-presence" id="presence-${emp.id}" checked>
                            <label for="presence-${emp.id}">Presença do Dia</label>
                        </div>
                    </div>
                    
                    <div class="time-entries">
                        <div class="period morning">
                            <h4>Período Manhã</h4>
                            <div class="time-group">
                                <div class="time-input">
                                    <label>Entrada</label>
                                    <input type="time" class="morning-in" data-type="morning-in" value="06:30">
                                </div>
                                <div class="time-input">
                                    <label>Saída</label>
                                    <input type="time" class="morning-out" data-type="morning-out" value="11:30">
                                </div>
                                <div class="presence-check">
                                    <input type="checkbox" class="check-morning" id="morning-${emp.id}" checked>
                                    <label for="morning-${emp.id}">Presente</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="period afternoon">
                            <h4>Período Tarde</h4>
                            <div class="time-group">
                                <div class="time-input">
                                    <label>Entrada</label>
                                    <input type="time" class="after-in" data-type="after-in" value="06:30">
                                </div>
                                <div class="time-input">
                                    <label>Saída</label>
                                    <input type="time" class="after-out" data-type="after-out" value="11:30">
                                </div>
                                <div class="presence-check">
                                    <input type="checkbox" class="check-after" id="after-${emp.id}" checked>
                                    <label for="after-${emp.id}">Presente</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            employeeCards.insertAdjacentHTML('beforeend', card);
        });

        // Setup presence checkbox interactions for mobile view
        setupMobilePresenceCheckboxes();
    }

    // Save time entries
    saveButton.addEventListener('click', function() {
        const mobileView = document.querySelector('.mobile-view');
        if (mobileView && window.getComputedStyle(mobileView).display === 'none') {
            return; // ignore save from mobile handler when desktop view is active
        }

        const date = tableDate.value;
        const cards = document.querySelectorAll('.employee-card');
        const timeEntries = [];

        cards.forEach(card => {
            const employeeId = card.dataset.employeeId;
            const entry = {
                date,
                employeeId,
                morningIn: card.querySelector('.morning-in').value,
                morningOut: card.querySelector('.morning-out').value,
                afterIn: card.querySelector('.after-in').value,
                afterOut: card.querySelector('.after-out').value,
                checkMorning: card.querySelector('.check-morning').checked,
                checkAfter: card.querySelector('.check-after').checked,
                checkPresence: card.querySelector('.check-presence').checked
            };
            timeEntries.push(entry);
        });

        // Save to localStorage
        const existingData = JSON.parse(localStorage.getItem('pointData')) || [];
        const newData = existingData.filter(entry => entry.date !== date);
        localStorage.setItem('pointData', JSON.stringify([...newData, ...timeEntries]));

        alert('Dados salvos com sucesso!');
    });

    // Initialize
    loadEmployees();
});

// Function to setup presence checkbox listeners for mobile view
function setupMobilePresenceCheckboxes() {
    const cards = document.querySelectorAll('.employee-card');
    cards.forEach(card => {
        const presenceCheckbox = card.querySelector('.check-presence');
        const morningCheckbox = card.querySelector('.check-morning');
        const afternoonCheckbox = card.querySelector('.check-after');

        if (presenceCheckbox && morningCheckbox && afternoonCheckbox) {
            // Setup presence checkbox change event
            presenceCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    // Mark both periods and disable them
                    morningCheckbox.checked = true;
                    afternoonCheckbox.checked = true;
                    morningCheckbox.disabled = true;
                    afternoonCheckbox.disabled = true;
                } else {
                    // Enable period checkboxes
                    morningCheckbox.disabled = false;
                    afternoonCheckbox.disabled = false;
                }
            });

            // Check initial state
            if (presenceCheckbox.checked) {
                morningCheckbox.checked = true;
                afternoonCheckbox.checked = true;
                morningCheckbox.disabled = true;
                afternoonCheckbox.disabled = true;
            }
        }
    });
}
