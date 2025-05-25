const mainClock = document.getElementById("mainClock");
const dateClock = document.getElementById("dateClock");

setInterval(() => {
    const now = new Date();
    dateClock.textContent = now.toLocaleDateString();
    mainClock.textContent = now.toLocaleTimeString();
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
