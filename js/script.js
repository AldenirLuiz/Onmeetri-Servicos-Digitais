document.addEventListener("DOMContentLoaded", function() {
    const mainClock = document.getElementById('mainClock');
    const dateClock = document.getElementById('mainDate');
    mainClock.style.color = "#333"; // Cor inicial do ícone
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);

    setInterval(() => {
        const now = new Date();
        let colorPick = "#" + (Math.floor(Math.random() * 16777215).toString(16));
        mainClock.textContent = now.toLocaleTimeString();
        dateClock.textContent = formattedDate;
        mainClock.style.color = colorPick;
        dateClock.style.color = colorPick;
        mainClock.style.transition = "color 10.5s ease"; // Transição suave para a mudança de cor
        dateClock.style.transition = "color 10.5s ease"; // Transição suave para a mudança de cor
    
    }, 1000);
});
