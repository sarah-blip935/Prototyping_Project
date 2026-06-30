const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------- CORE SHAPE ----------
const colorThemes = [
  { core: 0x7df9ff, light1: 0x7df9ff, light2: 0xff66cc },
  { core: 0xff66cc, light1: 0xff66cc, light2: 0xffd166 },
  { core: 0xffd166, light1: 0xffd166, light2: 0x9b5cff },
  { core: 0x9b5cff, light1: 0x9b5cff, light2: 0x7df9ff }
];
let themeIndex = 0;

const geometry = new THREE.IcosahedronGeometry(2, 0);
const material = new THREE.MeshStandardMaterial({
  color: colorThemes[0].core,
  flatShading: true,
  metalness: 0.4,
  roughness: 0.25,
  emissive: colorThemes[0].core,
  emissiveIntensity: 0.15
});
const core = new THREE.Mesh(geometry, material);
scene.add(core);

// Wireframe shell, slightly larger, for that faceted tech look
const wireGeo = new THREE.IcosahedronGeometry(2.04, 0);
const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 });
const wireShell = new THREE.Mesh(wireGeo, wireMat);
scene.add(wireShell);

// Soft glow sprite behind the core (fake bloom using a radial gradient texture)
function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.25)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
const glowTexture = makeGlowTexture();
const glowMat = new THREE.SpriteMaterial({ map: glowTexture, color: colorThemes[0].core, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
const glowSprite = new THREE.Sprite(glowMat);
glowSprite.scale.set(7, 7, 1);
scene.add(glowSprite);

// ---------- ORBITING PARTICLE RING ----------
const ringCount = 500;
const ringPositions = new Float32Array(ringCount * 3);
const ringAngles = [];
const ringRadii = [];
const ringSpeeds = [];

for (let i = 0; i < ringCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const r = 3.2 + Math.random() * 1.6;
  const y = (Math.random() - 0.5) * 0.4;
  ringAngles.push(angle);
  ringRadii.push(r);
  ringSpeeds.push(0.002 + Math.random() * 0.004);

  ringPositions[i * 3] = Math.cos(angle) * r;
  ringPositions[i * 3 + 1] = y;
  ringPositions[i * 3 + 2] = Math.sin(angle) * r;
}

const ringGeo = new THREE.BufferGeometry();
ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
const ringMat = new THREE.PointsMaterial({
  size: 0.045,
  color: colorThemes[0].core,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const ring = new THREE.Points(ringGeo, ringMat);
scene.add(ring);

// ---------- BACKGROUND STARFIELD ----------
const starCount = 1200;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPositions[i * 3] = (Math.random() - 0.5) * 70;
  starPositions[i * 3 + 1] = (Math.random() - 0.5) * 70;
  starPositions[i * 3 + 2] = (Math.random() - 0.5) * 70 - 15;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, transparent: true, opacity: 0.5 });
scene.add(new THREE.Points(starGeo, starMat));

// ---------- LIGHTS ----------
const ambientLight = new THREE.AmbientLight(0x404060, 1.2);
scene.add(ambientLight);

const light1 = new THREE.PointLight(colorThemes[0].light1, 3, 50);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.PointLight(colorThemes[0].light2, 2, 50);
light2.position.set(-5, -3, 4);
scene.add(light2);

camera.position.z = 8;

// ---------- MOUSE ORBIT ----------
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ---------- CLICK TO CHANGE COLOR THEME ----------
function applyTheme(index) {
  const theme = colorThemes[index];
  material.color.setHex(theme.core);
  material.emissive.setHex(theme.core);
  ringMat.color.setHex(theme.core);
  glowMat.color.setHex(theme.core);
  light1.color.setHex(theme.light1);
  light2.color.setHex(theme.light2);
}

// Raycaster detects exactly where the click happened in 3D space,
// so we only react when the click actually hits the core shape.
const raycaster = new THREE.Raycaster();
const mouseClick = new THREE.Vector2();

window.addEventListener('click', (e) => {
  mouseClick.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseClick.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouseClick, camera);
  const hits = raycaster.intersectObject(core);

  if (hits.length > 0) {
    themeIndex = (themeIndex + 1) % colorThemes.length;
    applyTheme(themeIndex);
    pulseScale = 1.35; // trigger a little pulse burst on click
  }
});

// ---------- PULSE / BREATHING EFFECT ----------
let pulseScale = 1;
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Core rotation
  core.rotation.x += 0.004;
  core.rotation.y += 0.006;
  wireShell.rotation.copy(core.rotation);

  // Breathing pulse (gentle scale oscillation) + click burst decay
  pulseScale += (1 - pulseScale) * 0.08;
  const breathe = 1 + Math.sin(t * 1.2) * 0.04;
  const scale = pulseScale * breathe;
  core.scale.setScalar(scale);
  wireShell.scale.setScalar(scale * 1.01);
  glowSprite.scale.setScalar(7 * (0.9 + Math.sin(t * 1.2) * 0.08));

  // Orbiting ring particles
  const posAttr = ringGeo.attributes.position;
  for (let i = 0; i < ringCount; i++) {
    ringAngles[i] += ringSpeeds[i];
    const r = ringRadii[i];
    posAttr.array[i * 3] = Math.cos(ringAngles[i]) * r;
    posAttr.array[i * 3 + 2] = Math.sin(ringAngles[i]) * r;
  }
  posAttr.needsUpdate = true;
  ring.rotation.x = 0.3 + mouseY * 0.15;

  // Mouse-driven camera orbit
  camera.position.x += (mouseX * 3.5 - camera.position.x) * 0.04;
  camera.position.y += (-mouseY * 2.5 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
