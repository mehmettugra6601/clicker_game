// Oyun başlangıç fonksiyonu (dosyanın en üstüne ekleyin)
function initWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    
    welcomeScreen.addEventListener('click', () => {
        // Giriş ekranını kaldır
        gsap.to(welcomeScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                welcomeScreen.style.display = 'none';
                showMessage('Oyun başladı! Topa tıkla!', '#00FF00');
            }
        });
        
        // Oyun müziğini başlat (isteğe bağlı)
        if (typeof bgMusic !== 'undefined') {
            bgMusic.play();
        }
    });
}

// Oyun değişkenlerinden SONRA bu fonksiyonu çağırın
initWelcomeScreen();

// Mevcut oyun kodlarınız aynı kalacak...