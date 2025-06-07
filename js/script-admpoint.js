const datafillArray = [
  { name: "Aldenir", sex: "Male", Age: "31" },
  { name: "Welingtom", sex: "Male", Age: "39" },
  { name: "Alcenir", sex: "Male", Age: "36" },
  { name: "Diogo", sex: "Male", Age: "44" },
  { name: "Joel", sex: "Male", Age: "32" },
  { name: "Joao", sex: "Male", Age: "55" }
];

document.addEventListener("DOMContentLoaded", function () {
  const tableData = document.getElementById("table-data");
  const btSave = document.getElementById("btt-save-table");
  const resultDiv = document.getElementById("result");
  const tableDate = document.getElementById("tableDate");

  // Create table element if it doesn't exist
  if (!tableData) {
    const table = document.createElement('table');
    table.id = 'table-data';
    document.querySelector('.table-fieldset').appendChild(table);
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

  // Function to populate table
  function populateTable(dataArray) {
    const tbody = tableData.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
    
    dataArray.forEach((data) => {
      const newLine = `
        <tr class="tr-line">
          <td class="name">${data.name}</td>
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

  // Load saved data or use default
  const savedData = localStorage.getItem('pointData');
  if (savedData) {
    populateTable(JSON.parse(savedData));
  } else {
    populateTable(datafillArray);
  }

  // Set default date to today
  tableDate.valueAsDate = new Date();

  // Save button event
  btSave.addEventListener("click", function () {
    if (!tableDate.value) {
        alert('Por favor, selecione uma data para o ponto!');
        return;
    }

    const rows = Array.from(tableData.querySelectorAll('tbody tr'));
    const pointData = rows.map(row => ({
        date: tableDate.value,
        name: row.querySelector('.name').textContent,
        morningIn: row.querySelector('.morning-in').value,
        morningOut: row.querySelector('.morning-out').value,
        afterIn: row.querySelector('.after-in').value,
        afterOut: row.querySelector('.after-out').value,
        checkMorning: row.querySelector('.check-morning-input').checked,
        checkAfter: row.querySelector('.check-after-input').checked
    }));

    // Get existing data or initialize empty array
    const existingData = JSON.parse(localStorage.getItem('pointData')) || [];
    
    // Remove entries for the same date if they exist
    const filteredData = existingData.filter(entry => entry.date !== tableDate.value);
    
    // Add new entries
    const updatedData = [...filteredData, ...pointData];
    
    localStorage.setItem('pointData', JSON.stringify(updatedData));
    
    resultDiv.innerHTML = pointData.map(data => 
        `<p>${data.name} - Data: ${new Date(data.date).toLocaleDateString()} - Manhã: ${data.checkMorning ? `${data.morningIn}-${data.morningOut}` : 'Falta'}, 
         Tarde: ${data.checkAfter ? `${data.afterIn}-${data.afterOut}` : 'Falta'}</p>`
    ).join('');

    alert('Dados salvos com sucesso!');
    updateSummary();
  });

  // Function to populate table
  function populateTable(dataArray) {
    const tbody = tableData.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
    
    dataArray.forEach((data) => {
      const newLine = `
        <tr class="tr-line">
          <td class="name">${data.name}</td>
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

  // Load saved data or use default
  if (savedData) {
    populateTable(JSON.parse(savedData));
  } else {
    populateTable(datafillArray);
  }

  // Save button event
  btSave.addEventListener("click", function () {
    if (!tableDate.value) {
        alert('Por favor, selecione uma data para o ponto!');
        return;
    }

    const rows = Array.from(tableData.querySelectorAll('tbody tr'));
    const pointData = rows.map(row => ({
        date: tableDate.value,
        name: row.querySelector('.name').textContent,
        morningIn: row.querySelector('.morning-in').value,
        morningOut: row.querySelector('.morning-out').value,
        afterIn: row.querySelector('.after-in').value,
        afterOut: row.querySelector('.after-out').value,
        checkMorning: row.querySelector('.check-morning-input').checked,
        checkAfter: row.querySelector('.check-after-input').checked
    }));

    // Get existing data or initialize empty array
    const existingData = JSON.parse(localStorage.getItem('pointData')) || [];
    
    // Remove entries for the same date if they exist
    const filteredData = existingData.filter(entry => entry.date !== tableDate.value);
    
    // Add new entries
    const updatedData = [...filteredData, ...pointData];
    
    localStorage.setItem('pointData', JSON.stringify(updatedData));
    
    resultDiv.innerHTML = pointData.map(data => 
        `<p>${data.name} - Data: ${new Date(data.date).toLocaleDateString()} - Manhã: ${data.checkMorning ? `${data.morningIn}-${data.morningOut}` : 'Falta'}, 
         Tarde: ${data.checkAfter ? `${data.afterIn}-${data.afterOut}` : 'Falta'}</p>`
    ).join('');

    alert('Dados salvos com sucesso!');
    updateSummary();
  });

  // Modal elements
  const modal = document.getElementById("entryModal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementsByClassName("close")[0];
  const summaryDate = document.getElementById("summaryDate");
  const summaryContent = document.getElementById("summaryContent");

  // Set default date to today
  summaryDate.valueAsDate = new Date();

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
