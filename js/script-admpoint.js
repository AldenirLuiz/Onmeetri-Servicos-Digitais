

const datafillArray = [
    {
    "name": "Aldenir",
    "sex": "Male",
    "Age": "31"
    },
    {
    "name": "Welingtom",
    "sex": "Male",
    "Age": "39"
    },
    {
    "name": "Alcenir",
    "sex": "Male",
    "Age": "36"
    },
    {
    "name": "Diogo",
    "sex": "Male",
    "Age": "44"
    },
    {
    "name": "Joel",
    "sex": "Male",
    "Age": "32"
    },
    {
    "name": "Joao",
    "sex": "Male",
    "Age": "55"
    },
]

document.addEventListener("DOMContentLoaded", function (){
    const tableData = document.getElementById("table-data");

    datafillArray.forEach((data, number) => {
        const newLine = `<tr class='tr-line'>
            <td>${data.name}</td>
            <td>${data.sex}</td>
            <td>${data.Age}</td>
            <td style="width:'10px';"><input type="checkbox"></input></td>
            <td style="width:'10px';"><input type='checkbox'></input></td>
        </tr>`;
        tableData.innerHTML += newLine;
    });
});