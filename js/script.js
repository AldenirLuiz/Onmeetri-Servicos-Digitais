
// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SUA_ID",
    appId: "SUA_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exemplo: Salvar ponto
async function salvarPonto(funcionarioId, entrada) {
    try {
        await addDoc(collection(db, "pontos"), {
            funcionarioId: funcionarioId,
            entrada: entrada,
            timestamp: new Date()
        });
        console.log("Ponto salvo com sucesso!");
    } catch (e) {
        console.error("Erro ao salvar ponto: ", e);
    }
}

// Exemplo de uso no botão de registro de ponto
document.getElementById("pontoButton").addEventListener("click", () => {
    salvarPonto("funcionario123", true); // true para entrada, false para saída
});

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