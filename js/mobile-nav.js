// mobile-nav.js - Script para menu hambúrguer em dispositivos móveis

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('header-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('open');
        });

        // Fechar menu ao clicar em um link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
            });
        });

        // Fechar menu ao clicar fora dele
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
                nav.classList.remove('open');
            }
        });
    }
});