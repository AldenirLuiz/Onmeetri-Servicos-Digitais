

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
    }
]

document.addEventListener("DOMContentLoaded", function (){
    const tableData = document.getElementById("table-data");

    datafillArray.forEach((data, number) => {
        const newLine = `<tr class='tr-line'>
            <td>${data.name}</td>
        </tr>`;
        tableData.innerHTML += newLine;
    });
});