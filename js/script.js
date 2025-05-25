setInterval(() => {
    const now = new Date();
    const colorPick = "#" + (Math.floor(Math.random() * 16777215).toString(16)).padStart(6, "0");
    mainClock.textContent = now.toLocaleTimeString();
    dateClock.textContent = formattedDate;

    mainClock.style.color = colorPick;
    dateClock.style.color = colorPick;
}, 30000); // a cada 30s

setInterval(() => {
    mainClock.textContent = new Date().toLocaleTimeString();
}, 1000); // apenas atualiza o horário a cada segundo

const btn = document.getElementById('submit');

document.getElementById('contactForm')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_jx3gudd';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});

const modal = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    modal.classList.remove("hidden");
    this.reset();
});

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});
