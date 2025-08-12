// Oyun değişkenleri
let score = 0;
let clickPower = 1;
let autoClicker = 0;
let unlockedPlanets = 1;
const planets = [];
const planetData = [
    { name: "MERKÜR", size: 0.4, color: 0x8B8B8B, price: 10, distance: 3 },
    { name: "VENÜS", size: 0.6, color: 0xE6C229, price: 25, distance: 4 },
    { name: "DÜNYA", size: 0.6, color: 0x1E90FF, price: 50, distance: 5 },
    { name: "MARS", size: 0.5, color: 0xC1440E, price: 100, distance: 6 },
    { name: "JÜPİTER", size: 1.0, color: 0xD39C61, price: 200, distance: 7 },
    { name: "SATÜRN", size: 0.9, color: 0xE4D191, price: 400, distance: 8, hasRings: true },
    { name: "URANÜS", size: 0.7, color: 0xC1E3E3, price: 800, distance: 9 },
    { name: "NEPTÜN", size: 0.7, color: 0x5B5DDF, price: 1600, distance: 10 },
    { name: "PLÜTON", size: 0.3, color: 0xE6E6FA, price: 3200, distance: 11 }
];

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
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('click-area').appendChild(renderer.domElement);

// Işıklandırma
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Gezegen oluşturma fonksiyonu
function createPlanet(planetInfo) {
    const geometry = new THREE.SphereGeometry(planetInfo.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: planetInfo.color,
        shininess: 100,
        emissive: planetInfo.color,
        emissiveIntensity: 0.2
    });
    
    const planet = new THREE.Mesh(geometry, material);
    planet.castShadow = true;
    planet.position.x = planetInfo.distance * Math.sin(Date.now() * 0.0005);
    planet.position.z = planetInfo.distance * Math.cos(Date.now() * 0.0005);
    planet.userData = { 
        name: planetInfo.name,
        value: planetInfo.price / 5,
        originalSize: planetInfo.size
    };
    
    // Halka ekleme (Satürn için)
    if (planetInfo.hasRings) {
        const ringGeometry = new THREE.RingGeometry(planetInfo.size * 1.5, planetInfo.size * 2, 32);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xE4D191,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 3;
        planet.add(ring);
    }
    
    scene.add(planet);
    planets.push(planet);
    return planet;
}

// Başlangıç gezegenlerini oluştur
function initPlanets() {
    for (let i = 0; i < unlockedPlanets; i++) {
        if (i < planetData.length) {
            createPlanet(planetData[i]);
        }
    }
}

// Puan güncelleme
function updateScore() {
    scoreElement.textContent = score;
    clickPowerElement.textContent = clickPower;
    autoClickElement.textContent = autoClicker;
    
    // Gezegen boyutlarını puanla güncelle
    planets.forEach(planet => {
        const growthFactor = 1 + (score / 10000);
        planet.scale.set(
            planet.userData.originalSize * growthFactor,
            planet.userData.originalSize * growthFactor,
            planet.userData.originalSize * growthFactor
        );
    });
}

// Tıklama efekti
function animateClick(planet) {
    gsap.to(planet.scale, {
        x: planet.scale.x * 1.2,
        y: planet.scale.y * 1.2,
        z: planet.scale.z * 1.2,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
}

// Mesaj gösterimi
function showMessage(text, color) {
    messageText.textContent = text;
    messageText.style.color = color;
    messagePopup.classList.remove('hidden');
    
    setTimeout(() => {
        messagePopup.classList.add('hidden');
    }, 2000);
}

// Mağaza işlevleri
function buyUpgrade(type, cost) {
    if (score < cost) {
        showMessage('Yeterli puan yok!', '#FF0000');
        return;
    }
    
    score -= cost;
    buySound.currentTime = 0;
    buySound.play();
    
    switch(type) {
        case 'click':
            clickPower++;
            showMessage('Tıklama gücü arttı!', '#00FF00');
            break;
        case 'auto':
            autoClicker++;
            showMessage('Otomatik toplayıcı eklendi!', '#00FF00');
            break;
        case 'planet':
            if (unlockedPlanets < planetData.length) {
                unlockedPlanets++;
                createPlanet(planetData[unlockedPlanets - 1]);
                showMessage(`Yeni gezegen: ${planetData[unlockedPlanets - 1].name}`, '#00FF00');
            } else {
                showMessage('Tüm gezegenler açıldı!', '#FFFF00');
            }
            break;
    }
    
    updateScore();
}

// Otomatik tıklayıcı
function startAutoClickers() {
    setInterval(() => {
        if (gameStarted && autoClicker > 0) {
            score += autoClicker;
            updateScore();
        }
    }, 1000);
}

// Fare tıklama olayı
function initClickEvents() {
    renderer.domElement.addEventListener('click', (event) => {
        if (!gameStarted) return;
        
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(planets);
        
        if (intersects.length > 0) {
            const planet = intersects[0].object;
            score += clickPower * planet.userData.value;
            clickSound.currentTime = 0;
            clickSound.play();
            animateClick(planet);
            updateScore();
        }
    });
}

// Hoşgeldin ekranı
function initWelcomeScreen() {
    welcomeScreen.addEventListener('click', () => {
        gsap.to(welcomeScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                welcomeScreen.style.display = 'none';
                shopElement.classList.add('hidden');
                gameStarted = true;
                showMessage('Oyun başladı! Gezegenlere tıkla!', '#00FF00');
            }
        });
    });
}

// Mağaza aç/kapa
function toggleShop() {
    if (!gameStarted) {
        showMessage('Önce oyunu başlatmalısın!', '#FF0000');
        return;
    }
    shopElement.classList.toggle('hidden');
}

// Animasyon döngüsü
function animate() {
    requestAnimationFrame(animate);
    
    // Gezegenleri yörüngede döndür
    planets.forEach((planet, index) => {
        const speed = 0.0005 * (index + 1);
        planet.position.x = planetData[index].distance * Math.sin(Date.now() * speed);
        planet.position.z = planetData[index].distance * Math.cos(Date.now() * speed);
        planet.rotation.y += 0.01;
    });
    
    renderer.render(scene, camera);
}

// Pencere boyutu değişikliği
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Oyun başlatma
initWelcomeScreen();
initPlanets();
initClickEvents();
animate();
startAutoClickers();

// Mağaza butonları
openShopBtn.addEventListener('click', toggleShop);
closeShopBtn.addEventListener('click', toggleShop);