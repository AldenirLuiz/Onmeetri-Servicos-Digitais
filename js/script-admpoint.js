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

  // Preenche a tabela
  datafillArray.forEach((data) => {
    const newLine = `
      <tr class="tr-line">
        <td class="name">${data.name}</td>
        <td>${data.sex}</td>
        <td>${data.Age}</td>
        <td class="check-morning" style="text-align: center; vertical-align: middle;">
          <input type="checkbox" checked />
        </td>
        <td class="check-after" style="text-align: center; vertical-align: middle;">
          <input type="checkbox" checked />
        </td>
      </tr>`;
    tableData.innerHTML += newLine;
  });

  // Evento de salvar
  btSave.addEventListener("click", function () {
    resultDiv.innerHTML = ""; // limpa resultados anteriores

    for (let i = 0; i < tableData.rows.length; i++) {
      let stringData = "";
      const linha = tableData.rows[i];

      for (let ii = 0; ii < linha.cells.length; ii++) {
        const celula = linha.cells[ii];

        if (celula.classList.contains("name")) {
          stringData = celula.textContent;
        }

        if (celula.children.length > 0) {
          const checkbox = celula.children[0];
          stringData += checkbox.checked ? " - Presente" : " - Ausente";
        }
      }

      resultDiv.innerHTML += `<p>${stringData}</p>`;
    }
  });
});
