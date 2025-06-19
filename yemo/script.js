// script.js : JS principal pour la page d'accueil clonée de isaworld.net/tg
// (Pour cette version, le JS est minimal car la page d'origine a peu d'interactions visibles)

document.addEventListener('DOMContentLoaded', function() {
    // Exemple : Animation légère sur les cartes de formation
    const cards = document.querySelectorAll('.formation-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 12px 32px rgba(0,64,128,0.18)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
});
