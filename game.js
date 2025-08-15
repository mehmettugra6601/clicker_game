// Oyun değişkenleri
let score = 0;
let clickPower = 1;
let autoClicker = 0;
const planets = [];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Işıklandırma
const light = new THREE.AmbientLight(0x404040);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Gezegenler
const planetData = [
    { name: "Merkür", size: 0.5, color: 0x8B8B8B, value: 1 },
    { name: "Venüs", size: 0.7, color: 0xE6C229, value: 2 },
    { name: "Dünya", size: 0.8, color: 0x1E90FF, value: 3 }
];

// Gezegen oluştur
function createPlanet(data, x, y, z) {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(x, y, z);
    planet.userData = data;
    scene.add(planet);
    planets.push(planet);
    return planet;
}

// Oyun başlat
function init() {
    camera.position.z = 5;
    
    // Gezegenleri yerleştir
    createPlanet(planetData[0], -2, 0, 0);
    createPlanet(planetData[1], 0, 0, 0);
    createPlanet(planetData[2], 2, 0, 0);

    // Tıklama olayı
    renderer.domElement.addEventListener('click', (e) => {
        const mouse = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planets);
        
        if (intersects.length > 0) {
            const planet = intersects[0].object;
            score += clickPower * planet.userData.value;
            document.getElementById('score').textContent = `Puan: ${score}`;
            // Animasyon
            gsap.to(planet.scale, { 
                x: 1.2, y: 1.2, z: 1.2, 
                duration: 0.1, 
                yoyo: true 
            });
        }
    });

    // Mağaza butonu
    document.getElementById('shop-btn').addEventListener('click', () => {
        alert(`Mağaza\nTıklama Gücü: ${clickPower}\nOtomatik Toplayıcı: ${autoClicker}`);
    });

    // Otomatik toplayıcı
    setInterval(() => {
        if (autoClicker > 0) {
            score += autoClicker;
            document.getElementById('score').textContent = `Puan: ${score}`;
        }
    }, 1000);
}

// Animasyon döngüsü
function animate() {
    requestAnimationFrame(animate);
    planets.forEach(planet => planet.rotation.y += 0.01);
    renderer.render(scene, camera);
}

init();
animate();