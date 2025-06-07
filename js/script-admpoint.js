document.addEventListener("DOMContentLoaded", function () {
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
        <th>Presença Manhã</th>
        <th>Presença Tarde</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  tableData.innerHTML = tableHeader;

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
          <td><div><legend>Entrada</legend><input type="time" class="morning-in" value="06:30"><legend>Saida</legend><input type="time" class="morning-out" value="11:30"></div></td>
          <td><div><legend>Entrada</legend><input type="time" class="after-in" value="13:00"><legend>Saida</legend><input type="time" class="after-out" value="17:00"></div></td>
          <td class="check-morning" style="text-align: center; vertical-align: middle;">
            <input type="checkbox" class="check-morning-input" checked />
          </td>
          <td class="check-after" style="text-align: center; vertical-align: middle;">
            <input type="checkbox" class="check-after-input" checked />
          </td>
        </tr>`;
      tbody.insertAdjacentHTML('beforeend', newLine);
    });
  }

  // Initial table population
  populateEmployeeTable();

  // Set default dates
  if (tableDate) tableDate.valueAsDate = new Date();
  if (summaryDate) summaryDate.valueAsDate = new Date();

  // Remove existing event listeners
  const newBtSave = btSave.cloneNode(true);
  btSave.parentNode.replaceChild(newBtSave, btSave);

  // Add single save event listener
  newBtSave.addEventListener("click", function () {
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
        checkAfter: row.querySelector('.check-after-input').checked
      };
    });

    const existingData = JSON.parse(localStorage.getItem('pointData')) || [];
    const filteredData = existingData.filter(entry => entry.date !== tableDate.value);
    const updatedData = [...filteredData, ...pointData];
    
    localStorage.setItem('pointData', JSON.stringify(updatedData));
    
    alert('Dados salvos com sucesso!');
    updateSummary();
  });

  // Close modal when clicking X or outside
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (event) => {
      if (event.target == modal) modal.style.display = "none";
  }

  // Function to show entry details
  function showEntryDetails(entry) {
      modalContent.innerHTML = `
          <h3>${entry.name}</h3>
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

  // Update summary when date changes
  summaryDate.addEventListener('change', updateSummary);

  // Add export functions
  function exportToPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Calculate totals
    const totals = data.reduce((acc, entry) => {
        if (!acc[entry.name]) {
            acc[entry.name] = {
                totalHours: 0,
                presentMorning: 0,
                presentAfternoon: 0,
                totalDays: 0
            };
        }
        
        acc[entry.name].totalHours += parseFloat(calculateTotalHours(entry));
        if (entry.checkMorning) acc[entry.name].presentMorning++;
        if (entry.checkAfter) acc[entry.name].presentAfternoon++;
        acc[entry.name].totalDays++;
        
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
        name: entry.name,
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
        if (!acc[entry.name]) {
            acc[entry.name] = {
                totalHours: 0,
                presentMorning: 0,
                presentAfternoon: 0,
                totalDays: 0
            };
        }
        
        acc[entry.name].totalHours += parseFloat(calculateTotalHours(entry));
        if (entry.checkMorning) acc[entry.name].presentMorning++;
        if (entry.checkAfter) acc[entry.name].presentAfternoon++;
        acc[entry.name].totalDays++;
        
        return acc;
    }, {});

    // Regular data rows
    const rows = data.map(entry => ({
        Nome: entry.name,
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
function exportToPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Calculate totals
    const totals = data.reduce((acc, entry) => {
        if (!acc[entry.name]) {
            acc[entry.name] = {
                totalHours: 0,
                presentMorning: 0,
                presentAfternoon: 0,
                totalDays: 0
            };
        }
        
        acc[entry.name].totalHours += parseFloat(calculateTotalHours(entry));
        if (entry.checkMorning) acc[entry.name].presentMorning++;
        if (entry.checkAfter) acc[entry.name].presentAfternoon++;
        acc[entry.name].totalDays++;
        
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
        name: entry.name,
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
        if (!acc[entry.name]) {
            acc[entry.name] = {
                totalHours: 0,
                presentMorning: 0,
                presentAfternoon: 0,
                totalDays: 0
            };
        }
        
        acc[entry.name].totalHours += parseFloat(calculateTotalHours(entry));
        if (entry.checkMorning) acc[entry.name].presentMorning++;
        if (entry.checkAfter) acc[entry.name].presentAfternoon++;
        acc[entry.name].totalDays++;
        
        return acc;
    }, {});

    // Regular data rows
    const rows = data.map(entry => ({
        Nome: entry.name,
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
              <strong>${entry.name}</strong> - 
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
document.addEventListener("DOMContentLoaded", function () {
    // Function to populate table with saved employees
    function populateEmployeeDropdown() {
        const tbody = tableData.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows
        
        // Get employees from localStorage
        const employees = JSON.parse(localStorage.getItem("employees")) || [];
        
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
                    <td><div><legend>Entrada</legend><input type="time" class="morning-in" value="06:30"><legend>Saida</legend><input type="time" class="morning-out" value="11:30"></div></td>
                    <td><div><legend>Entrada</legend><input type="time" class="after-in" value="13:00"><legend>Saida</legend><input type="time" class="after-out" value="17:00"></div></td>
                    <td class="check-morning" style="text-align: center; vertical-align: middle;">
                        <input type="checkbox" class="check-morning-input" checked />
                    </td>
                    <td class="check-after" style="text-align: center; vertical-align: middle;">
                        <input type="checkbox" class="check-after-input" checked />
                    </td>
                </tr>`;
            tbody.insertAdjacentHTML('beforeend', newLine);
        });
    }

    // Call the function when page loads
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    if (employees.length > 0) {
        populateEmployeeDropdown();
    } else {
        // If no employees saved, use default array
        populateTable(datafillArray);
    }
});

// Exemplo de uso em mensagens
alert(langManager.translate('saveSuccess'));

// Exemplo de uso em elementos dinâmicos
element.textContent = langManager.translate('department');
