// Oyun değişkenleri
let score = 0;
let clickPower = 1;
let autoClicker = 0;
let miniBalls = 0;
let miniBallInterval;
const miniBallsArray = [];

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

// Three.js sahnesi
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000033);

// Kamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
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

// Ana top
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

// Yıldız alanı (arkaplan)
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1
});

const starsVertices = [];
for (let i = 0; i < 1000; i++) {
    starsVertices.push(
        THREE.MathUtils.randFloatSpread(1000),
        THREE.MathUtils.randFloatSpread(1000),
        THREE.MathUtils.randFloatSpread(1000)
    );
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Puan güncelleme
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
    
    // Her 10 puan için top rengini değiştir
    if (points > 0 && score % 10 === 0) {
        const newColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        ball.material.color = newColor;
        ball.material.emissive = newColor;
        showMessage(`Güç artışı! +${points} puan`, newColor.getStyle());
    }
}

// Mağaza fonksiyonları
function toggleShop() {
    shopElement.classList.toggle('hidden');
}

function buyUpgrade(type, cost) {
    if (score >= cost) {
        score -= cost;
        scoreElement.textContent = score;
        buySound.currentTime = 0;
        buySound.play();
        
        switch(type) {
            case 'click':
                clickPower += 1;
                clickPowerElement.textContent = clickPower;
                showMessage(`Tıklama gücü arttı: ${clickPower}`, '#00FF00');
                break;
                
            case 'auto':
                autoClicker += 1;
                autoClickElement.textContent = autoClicker;
                startAutoClickers();
                showMessage(`Otomatik tıkçı eklendi!`, '#00FFFF');
                break;
                
            case 'mini':
                miniBalls += 2;
                createMiniBalls();
                showMessage(`${miniBalls} mini top senin için çalışıyor!`, '#FF00FF');
                break;
        }
    } else {
        showMessage('Yeterli puan yok!', '#FF0000');
    }
}

// Mesaj gösterimi
function showMessage(text, color = '#FFFFFF') {
    messageText.textContent = text;
    messageText.style.color = color;
    messagePopup.classList.remove('hidden');
    
    setTimeout(() => {
        messagePopup.classList.add('hidden');
    }, 2000);
}

// Otomatik tıkçılar
function startAutoClickers() {
    // Önceki interval'i temizle
    if (miniBallInterval) clearInterval(miniBallInterval);
    
    miniBallInterval = setInterval(() => {
        if (autoClicker > 0) {
            updateScore(autoClicker);
            animateClick(ball);
        }
    }, 1000);
}

// Mini toplar oluştur
function createMiniBalls() {
    // Öncekileri temizle
    miniBallsArray.forEach(ball => scene.remove(ball));
    miniBallsArray.length = 0;
    
    // Yeni topları oluştur
    for (let i = 0; i < miniBalls; i++) {
        const size = 0.3 + Math.random() * 0.2;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            emissive: 0x444444,
            shininess: 50
        });
        
        const miniBall = new THREE.Mesh(geometry, material);
        
        // Rastgele pozisyon
        const angle = (i / miniBalls) * Math.PI * 2;
        const radius = 2 + Math.random() * 1;
        miniBall.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        
        miniBall.castShadow = true;
        scene.add(miniBall);
        miniBallsArray.push(miniBall);
        
        // Mini top animasyonu
        animateMiniBall(miniBall, angle, radius);
    }
}

// Mini top animasyonu
function animateMiniBall(ball, startAngle, radius) {
    let angle = startAngle;
    let speed = 0.02 + Math.random() * 0.03;
    let height = 0;
    let up = true;
    
    function animate() {
        angle += speed;
        ball.position.x = Math.cos(angle) * radius;
        ball.position.y = Math.sin(angle) * radius + height;
        ball.position.z = Math.sin(angle * 3) * 0.5;
        
        // Zıplama efekti
        if (up) {
            height += 0.01;
            if (height >= 0.3) up = false;
        } else {
            height -= 0.01;
            if (height <= 0) {
                up = true;
                // Ana topa yakınsa tıklama efekti ver
                if (Math.abs(angle % (Math.PI * 2)) < 0.2) {
                    updateScore(autoClicker);
                    animateClick(ball);
                }
            }
        }
        
        ball.rotation.x += 0.01;
        ball.rotation.y += 0.01;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Tıklama animasyonu
function animateClick(ball) {
    const originalScale = ball.scale.clone();
    const originalPosition = ball.position.clone();
    
    // Tıklama efekti
    gsap.to(ball.scale, {
        x: originalScale.x * 1.3,
        y: originalScale.y * 1.3,
        z: originalScale.z * 1.3,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
    
    gsap.to(ball.position, {
        y: originalPosition.y + 0.3,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
    
    // Ses efekti
    clickSound.currentTime = 0;
    clickSound.play();
}

// Tıklama olayı
document.getElementById('click-area').addEventListener('click', (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObject(ball);
    if (intersects.length > 0) {
        updateScore(clickPower);
        animateClick(ball);
    }
});

// Mağaza butonları
openShopBtn.addEventListener('click', toggleShop);
closeShopBtn.addEventListener('click', toggleShop);

// Animasyon
function animate() {
    requestAnimationFrame(animate);
    
    // Ana topu döndür
    ball.rotation.x += 0.005;
    ball.rotation.y += 0.01;
    
    // Yıldız alanını döndür
    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0001;
    
    renderer.render(scene, camera);
}

// Pencere boyutu
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Oyunu başlat
animate();
startAutoClickers();
showMessage('Galaktik Top Toplayıcıya Hoş Geldin!', '#FFFF00');

// GSAP animasyon kütüphanesi
document.head.insertAdjacentHTML('beforeend', 
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>'
);