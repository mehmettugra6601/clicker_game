// Oyun değişkenleri
let score = 0;
let clickPower = 1;
let autoClicker = 0;
let miniBalls = 0;
let miniBallInterval;
const miniBallsArray = [];
let gameStarted = false;

// DOM elementleri
const scoreElement = document.getElementById('score');
const clickPowerElement = document.getElementById('click-power');
const autoClickElement = document.getElementById('auto-click');
const shopElement = document.getElementById('shop');
const openShopBtn = document.getElementById('open-shop');
const closeShopBtn = document.getElementById('close-shop');
const messagePopup = document.getElementById('message-popup');
const messageText = document.getElementById('message-text');
const clickSound = document.getElementById('click-sound');
const buySound = document.getElementById('buy-sound');
const welcomeScreen = document.getElementById('welcome-screen');

// Three.js sahnesi
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000033);

// Kamera ve renderer ayarları
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('click-area').appendChild(renderer.domElement);

// Işıklandırma ve top oluşturma
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
const ballMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff0000,
    shininess: 100,
    emissive: 0xff0000,
    emissiveIntensity: 0.5
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.castShadow = true;
scene.add(ball);

// Oyun fonksiyonları
function initWelcomeScreen() {
    welcomeScreen.addEventListener('click', () => {
        gsap.to(welcomeScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                welcomeScreen.style.display = 'none';
                shopElement.classList.add('hidden');
                gameStarted = true;
                showMessage('Oyun başladı! Topa tıkla!', '#00FF00');
            }
        });
    });
}

function toggleShop() {
    if (!gameStarted) {
        showMessage('Önce oyunu başlatmalısın!', '#FF0000');
        return;
    }
    shopElement.classList.toggle('hidden');
}

// Diğer oyun fonksiyonları (updateScore, buyUpgrade, animateClick vb.) aynen kalacak...

// Event listener'lar
openShopBtn.addEventListener('click', toggleShop);
closeShopBtn.addEventListener('click', toggleShop);

// Oyun başlatma
initWelcomeScreen();
animate();
startAutoClickers();