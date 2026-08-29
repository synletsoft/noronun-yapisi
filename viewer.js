import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const sections = [
  {
    id: "section-1",
    label: "1. Kısım",
    title: "Nöronun Yapısı",
    subtitle: "Dendrit ve akson bölümleri",
    accent: "#ff7d2f",
    bgTop: "#dfeeff",
    bgBottom: "#a6c2ea",
    glow: "rgba(255, 255, 255, 0.5)",
    model: "./kaynak/1. Kısım/Synaps Hücre.glb?v=20260829-color",
    buttonIdle: "./kaynak/1. Kısım/Dentridbağlantıbt.png",
    buttonActive: "./kaynak/1. Kısım/Dentridbağlantıbt2.png",
    defaultCamera: { direction: [0, 0.12, 1], distance: 2.5, fov: 42 },
    hotspots: [
      { number: 5, cardIndex: 0, title: "Çekirdek", point: [0.30, 0.60, 0.50], direction: [-0.04, 0.03, 1], distance: 0.58, fov: 30 },
      { number: 2, cardIndex: 1, title: "Soma", point: [0.39, 0.54, 0.55], direction: [0.08, 0.04, 1], distance: 0.72, fov: 31 },
      { number: 1, cardIndex: 2, title: "Dendrit", point: [0.19, 0.70, 0.54], direction: [0.18, 0.08, 1], distance: 0.92, fov: 34 },
      { number: 4, cardIndex: 3, title: "Miyelin Kılıf", point: [0.54, 0.53, 0.52], direction: [0.06, -0.02, 1], distance: 0.68, fov: 29 },
      { number: 3, cardIndex: 4, title: "Akson", point: [0.62, 0.50, 0.54], direction: [0.10, 0.02, 1], distance: 0.74, fov: 30 },
      { number: 7, cardIndex: 5, title: "Schwann Hücresi", point: [0.70, 0.60, 0.54], direction: [0.05, -0.02, 1], distance: 0.56, fov: 29 },
      { number: 6, cardIndex: 6, title: "Akson Ucu", point: [0.88, 0.52, 0.53], direction: [0.15, 0.03, 1], distance: 0.84, fov: 32 },
    ],
    cards: [
      {
        title: "Çekirdek",
        description: "Hücre etkinliklerini yöneten genetik kontrol merkezidir.",
        image: "./kaynak/1. Kısım/kartlar/Çekirdek.png",
      },
      {
        title: "Soma",
        description: "Nöronun çekirdek ve organellerini barındıran merkez bölümüdür.",
        image: "./kaynak/1. Kısım/kartlar/Hücre Gövdesi(soma).png",
      },
      {
        title: "Dendrit",
        description: "Diğer nöronlardan veya reseptörlerden gelen uyarıları alır ve hücre gövdesine iletir.",
        image: "./kaynak/1. Kısım/kartlar/Dendrit.png",
      },
      {
        title: "Miyelin Kılıf",
        description: "İletimi hızlandıran yalıtıcı yapı katmanıdır.",
        image: "./kaynak/1. Kısım/kartlar/Miyelin kılıf.png",
      },
      {
        title: "Akson",
        description: "İmpulsu hücre gövdesinden akson uçlarına doğru iletir.",
        image: "./kaynak/1. Kısım/kartlar/Akson.png",
      },
      {
        title: "Schwann Hücresi",
        description: "Akson çevresinde miyelin kılıfı oluşturarak sinir iletimini hızlandırır.",
        image: "./kaynak/1. Kısım/kartlar/Miyelin kılıf.png",
      },
      {
        title: "Akson Ucu",
        description: "Sinyali bir sonraki hücreye aktaran sinaptik uç bölümüdür.",
        image: "./kaynak/1. Kısım/kartlar/Akson ucu (Sinaptik uç).png",
      },
    ],
  },
  {
    id: "section-2",
    label: "2. Kısım",
    title: "Sinaptik İletim",
    subtitle: "Nöronlar arası bağlantı",
    accent: "#ff9652",
    bgTop: "#cfcad8",
    bgBottom: "#8fa3bf",
    glow: "rgba(255, 240, 232, 0.35)",
    model: "./kaynak/2. kısım/Synaps Bağlantı.glb?v=20260829-color",
    buttonIdle: "./kaynak/2. kısım/Synapsbt.png",
    buttonActive: "./kaynak/2. kısım/Synapsbt2.png",
    defaultCamera: { direction: [0, 0.08, 1], distance: 2.4, fov: 41 },
    hotspots: [
      { cardIndex: 0, title: "Sinaps Bağlantı", point: [0.50, 0.52, 0.52], distance: 1.95 },
      { cardIndex: 1, title: "Dendrit Bağlantısı", point: [0.43, 0.36, 0.47], distance: 2.05 },
    ],
    cards: [
      {
        title: "Sinaps Bağlantı",
        description: "İki nöron arasındaki kimyasal iletim bölgesini gösterir.",
        emblem: "./kaynak/2. kısım/Synapsbt.png",
      },
      {
        title: "Dendrit Bağlantısı",
        description: "Uyaranın hedef hücreye aktarıldığı karşı yüzeyi vurgular.",
        emblem: "./kaynak/2. kısım/Dentridbağlantıbt.png",
      },
    ],
  },
];

const STORAGE_KEY = "noron-viewer-state-v3";
const state = {
  sectionId: "section-1",
  cardIndex: 0,
  soundEnabled: false,
  cardVisible: false,
};

const app = document.querySelector("#app");
const canvas = document.querySelector("#scene");
const sectionButtonImage1 = document.querySelector("#sectionButtonImage1");
const sectionButtonImage2 = document.querySelector("#sectionButtonImage2");
const sectionButton1 = document.querySelector("#sectionButton1");
const sectionButton2 = document.querySelector("#sectionButton2");
const refreshButton = document.querySelector("#refreshButton");
const soundButton = document.querySelector("#soundButton");
const shareButton = document.querySelector("#shareButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const refreshIcon = document.querySelector("#refreshIcon");
const soundIcon = document.querySelector("#soundIcon");
const shareIcon = document.querySelector("#shareIcon");
const fullscreenIcon = document.querySelector("#fullscreenIcon");
const infoCard = document.querySelector("#infoCard");
const cardClose = document.querySelector("#cardClose");
const hotspotLayer = document.querySelector("#hotspotLayer");
const cardImage = document.querySelector("#cardImage");
const cardFallback = document.querySelector("#cardFallback");
const cardEmblem = document.querySelector("#cardEmblem");
const cardFallbackTitle = document.querySelector("#cardFallbackTitle");
const cardFallbackDesc = document.querySelector("#cardFallbackDesc");
const loadingOverlay = document.querySelector("#loadingOverlay");
const loadingText = document.querySelector("#loadingText");
const loadingBar = document.querySelector("#loadingBar");
const toast = document.querySelector("#toast");
const liveRegion = document.querySelector("#liveRegion");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.toneMappingExposure = 1;
renderer.setClearColor(0x000000, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0xb69f92, 1.1));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.55);
keyLight.position.set(3, 4, 4);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffe4d0, 0.45);
fillLight.position.set(-4, 1.5, 2);
scene.add(fillLight);

const modelRoot = new THREE.Group();
scene.add(modelRoot);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = true;
controls.enableZoom = true;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.1;

let modelRadius = 1;
let loadingToken = 0;
let audioContext = null;
let renderRequested = true;
let toastTimer = null;
let currentCardSource = "";
let cameraFlight = null;
let activeHotspotIndex = -1;
let hotspotButtons = [];

applyIcons();
restoreState();
applyTheme(getSection());
renderSectionButtons();
renderCard();
wireEvents();
resize();
loadCurrentSection({ immediate: true });
renderer.setAnimationLoop(tick);

new ResizeObserver(resize).observe(canvas);

function getSection(id = state.sectionId) {
  return sections.find((section) => section.id === id) || sections[0];
}

function getCurrentCard() {
  const section = getSection();
  return section.cards[state.cardIndex] || section.cards[0];
}

function applyIcons() {
  setButtonImage(refreshIcon, "./kaynak/1. Kısım/yenilebt.png");
  setButtonImage(soundIcon, state.soundEnabled ? "./kaynak/1. Kısım/sesbt-1.png" : "./kaynak/1. Kısım/sesbt.png");
  setButtonImage(shareIcon, "./kaynak/1. Kısım/paylasbt.png");
  setButtonImage(fullscreenIcon, "./kaynak/1. Kısım/tamekranbt.png");
}

function setButtonImage(node, src) {
  if (!node) return;
  node.src = src;
}

function renderSectionButtons() {
  const first = sections[0];
  const second = sections[1];
  setButtonImage(sectionButtonImage1, state.sectionId === first.id ? first.buttonActive : first.buttonIdle);
  setButtonImage(sectionButtonImage2, state.sectionId === second.id ? second.buttonActive : second.buttonIdle);
  sectionButton1.setAttribute("aria-pressed", String(state.sectionId === first.id));
  sectionButton2.setAttribute("aria-pressed", String(state.sectionId === second.id));
}

function renderCard() {
  const section = getSection();
  const card = getCurrentCard();

  currentCardSource = card.image ? new URL(card.image, import.meta.url).href : "";
  activeHotspotIndex = state.cardVisible ? section.hotspots.findIndex((hotspot) => hotspot.cardIndex === state.cardIndex) : -1;

  if (card.image) {
    cardImage.src = currentCardSource;
    cardImage.alt = card.title;
    cardImage.classList.remove("hidden");
    cardFallback.classList.add("hidden");
  } else {
    cardImage.removeAttribute("src");
    cardImage.alt = "";
    cardImage.classList.add("hidden");
    cardFallback.classList.remove("hidden");
    cardFallbackTitle.textContent = card.title;
    cardFallbackDesc.textContent = card.description;
    if (card.emblem) {
      cardEmblem.src = new URL(card.emblem, import.meta.url).href;
      cardEmblem.alt = "";
    } else {
      cardEmblem.removeAttribute("src");
    }
  }

  syncHotspots();
  infoCard.classList.toggle("hidden", !state.cardVisible);
}

function applyTheme(section) {
  app.style.setProperty("--scene-top", section.bgTop);
  app.style.setProperty("--scene-bottom", section.bgBottom);
  app.style.setProperty("--scene-glow", section.glow);
  app.style.setProperty("--accent", section.accent);
}

function wireEvents() {
  sectionButton1.addEventListener("click", () => switchSection("section-1"));
  sectionButton2.addEventListener("click", () => switchSection("section-2"));
  cardClose.addEventListener("click", hideInfoCard);
  refreshButton.addEventListener("click", () => {
    playUiTone(320);
    loadCurrentSection({ immediate: true });
    showToast("Görünüm yenilendi");
  });
  soundButton.addEventListener("click", toggleSound);
  shareButton.addEventListener("click", sharePage);
  fullscreenButton.addEventListener("click", toggleFullscreen);
  window.addEventListener("resize", resize);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  canvas.addEventListener("dblclick", () => loadCurrentSection({ immediate: true }));
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());
  controls.addEventListener("start", () => requestRender());
  controls.addEventListener("change", () => requestRender());
}

function onKeyDown(event) {
  if (event.code === "Escape") return;
  if (event.code === "KeyR") loadCurrentSection({ immediate: true });
  if (event.code === "KeyF") toggleFullscreen();
  if (event.code === "Digit1") switchSection("section-1");
  if (event.code === "Digit2") switchSection("section-2");
}

function switchSection(sectionId) {
  if (state.sectionId === sectionId) return;
  state.sectionId = sectionId;
  state.cardIndex = 0;
  state.cardVisible = false;
  applyTheme(getSection());
  renderCard();
  persistState();
  loadCurrentSection({ immediate: true });
  playUiTone(360);
  showToast(getSection().title);
}

function loadCurrentSection({ immediate = false } = {}) {
  const section = getSection();
  const token = ++loadingToken;
  loadingOverlay.classList.remove("hidden");
  loadingText.textContent = `${section.title} yükleniyor`;
  loadingBar.style.width = "6%";

  const manager = new THREE.LoadingManager();
  manager.onProgress = (_, loaded, total) => {
    if (token !== loadingToken || !total) return;
    const percent = Math.max(6, Math.min(98, Math.round((loaded / total) * 100)));
    loadingBar.style.width = `${percent}%`;
    loadingText.textContent = `${section.title} yükleniyor %${percent}`;
  };

  const draco = new DRACOLoader(manager);
  draco.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/libs/draco/");
  draco.setDecoderConfig({ type: "wasm" });

  const loader = new GLTFLoader(manager);
  loader.setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder);

  const modelUrl = new URL(section.model, import.meta.url).href;
  loader.load(
    modelUrl,
    (gltf) => {
      if (token !== loadingToken) return;
      modelRoot.clear();
      cameraFlight = null;
      hotspotButtons = [];
      hotspotLayer.replaceChildren();
      modelRoot.add(gltf.scene);
      centerModel(gltf.scene);
      prepareModel(gltf.scene);
      buildHotspots(gltf.scene, section);
      frameCamera(section, immediate);
      loadingOverlay.classList.add("hidden");
      loadingBar.style.width = "100%";
      announce(`${section.title} hazır`);
      requestRender();
    },
    undefined,
    () => {
      if (token !== loadingToken) return;
      loadingOverlay.classList.add("hidden");
      showToast("Model yüklenemedi");
    },
  );
}

function prepareModel(root) {
  root.traverse((object) => {
    object.frustumCulled = true;
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = false;
  });
}

function buildHotspots(root, section) {
  const box = new THREE.Box3().setFromObject(root);
  const toPoint = (point) =>
    new THREE.Vector3(
      THREE.MathUtils.lerp(box.min.x, box.max.x, point[0]),
      THREE.MathUtils.lerp(box.min.y, box.max.y, point[1]),
      THREE.MathUtils.lerp(box.min.z, box.max.z, point[2]),
    );

  hotspotLayer.replaceChildren();
  hotspotButtons = section.hotspots.map((hotspot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot-point";
    button.textContent = String(hotspot.number || index + 1);
    button.setAttribute("aria-label", `${hotspot.number || index + 1}. ${hotspot.title}`);
    button.addEventListener("click", () => focusHotspot(hotspot, index));
    hotspotLayer.append(button);
    return { button, hotspot, index, point: toPoint(hotspot.point) };
  });

  section.hotspots.forEach((hotspot, index) => {
    hotspotButtons[index].point = toPoint(hotspot.point);
  });

  syncHotspots();
}

function syncHotspots() {
  hotspotButtons.forEach((entry) => {
    const isActive = entry.index === activeHotspotIndex;
    entry.button.classList.toggle("active", isActive);
    const projected = entry.point.clone().project(camera);
    const x = ((projected.x + 1) * 0.5) * canvas.clientWidth;
    const y = ((-projected.y + 1) * 0.5) * canvas.clientHeight;
    entry.button.style.left = `${x}px`;
    entry.button.style.top = `${y}px`;
    entry.button.hidden = projected.z < -1 || projected.z > 1;
  });
}

function focusHotspot(hotspot, index) {
  activeHotspotIndex = index;
  state.cardIndex = hotspot.cardIndex;
  showInfoCard();
  renderCard();
  persistState();

  const section = getSection();
  const direction = new THREE.Vector3(...(hotspot.direction || section.defaultCamera.direction)).normalize();
  const distance = modelRadius * (hotspot.distance || section.defaultCamera.distance);
  const target = hotspot.target ? new THREE.Vector3(...hotspot.target) : hotspotButtons[index]?.point.clone() || new THREE.Vector3();
  const position = target.clone().add(direction.multiplyScalar(distance));

  animateCameraTo(position, target, hotspot.fov || 32);
  playUiTone(520);
  showToast(hotspot.title || getCurrentCard().title);
}

function animateCameraTo(position, target, fov = camera.fov) {
  const up = new THREE.Vector3(0, 1, 0);
  const travel = new THREE.Vector3().subVectors(position, camera.position);
  const side = new THREE.Vector3().crossVectors(travel, up);
  if (side.lengthSq() === 0) side.set(1, 0, 0);
  side.normalize();

  const distance = travel.length();
  const curve = modelRadius * THREE.MathUtils.clamp(0.09 + distance / (modelRadius * 16), 0.1, 0.22);
  const rise = modelRadius * THREE.MathUtils.clamp(0.08 + distance / (modelRadius * 20), 0.08, 0.16);
  const midPosition = camera.position
    .clone()
    .lerp(position, 0.5)
    .addScaledVector(side, curve)
    .addScaledVector(up, rise);

  const midTarget = controls.target.clone().lerp(target, 0.5);

  cameraFlight = {
    startedAt: performance.now(),
    duration: THREE.MathUtils.clamp(980 + distance * 190, 1100, 1850),
    fromPosition: camera.position.clone(),
    fromTarget: controls.target.clone(),
    fromFov: camera.fov,
    toPosition: position.clone(),
    toTarget: target.clone(),
    midPosition,
    midTarget,
    toFov: fov,
  };
  controls.enabled = false;
  requestRender();
}

function updateCameraFlight(now) {
  if (!cameraFlight) return;

  const t = THREE.MathUtils.clamp((now - cameraFlight.startedAt) / cameraFlight.duration, 0, 1);
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const omt = 1 - eased;
  camera.position
    .copy(cameraFlight.fromPosition)
    .multiplyScalar(omt * omt)
    .addScaledVector(cameraFlight.midPosition, 2 * omt * eased)
    .addScaledVector(cameraFlight.toPosition, eased * eased);
  controls.target
    .copy(cameraFlight.fromTarget)
    .multiplyScalar(omt * omt)
    .addScaledVector(cameraFlight.midTarget, 2 * omt * eased)
    .addScaledVector(cameraFlight.toTarget, eased * eased);
  camera.fov = THREE.MathUtils.lerp(cameraFlight.fromFov, cameraFlight.toFov, eased);
  camera.updateProjectionMatrix();
  controls.update();
  requestRender();

  if (t >= 1) {
    camera.position.copy(cameraFlight.toPosition);
    controls.target.copy(cameraFlight.toTarget);
    camera.fov = cameraFlight.toFov;
    camera.updateProjectionMatrix();
    controls.update();
    controls.enabled = true;
    cameraFlight = null;
  }
}

function showInfoCard() {
  state.cardVisible = true;
  infoCard.classList.remove("hidden");
  syncHotspots();
}

function hideInfoCard() {
  state.cardVisible = false;
  infoCard.classList.add("hidden");
  persistState();
  showToast("Kart kapatıldı");
  syncHotspots();
}

function centerModel(root) {
  root.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);
  modelRadius = Math.max(size.length() * 0.5, 1);
}

function frameCamera(section, immediate) {
  const direction = new THREE.Vector3(...section.defaultCamera.direction).normalize();
  const distance = modelRadius * section.defaultCamera.distance;
  const target = new THREE.Vector3(0, 0, 0);
  const position = target.clone().add(direction.multiplyScalar(distance));

  camera.fov = section.defaultCamera.fov;
  camera.near = Math.max(modelRadius / 1200, 0.01);
  camera.far = Math.max(modelRadius * 40, 100);
  camera.updateProjectionMatrix();

  controls.target.copy(target);
  controls.minDistance = Math.max(modelRadius * 0.15, 0.35);
  controls.maxDistance = modelRadius * 12;
  camera.position.copy(position);
  controls.update();

  if (!immediate) playUiTone(420);
}

function resize() {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  requestRender();
}

function tick() {
  updateCameraFlight(performance.now());
  syncHotspots();
  controls.update();
  if (!renderRequested) return;
  renderer.render(scene, camera);
  renderRequested = false;
}

function requestRender() {
  renderRequested = true;
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  setButtonImage(soundIcon, state.soundEnabled ? "./kaynak/1. Kısım/sesbt-1.png" : "./kaynak/1. Kısım/sesbt.png");
  persistState();
  ensureAudioContext();
  if (state.soundEnabled) {
    playUiTone(520);
    showToast("Ses açık");
  } else {
    showToast("Ses kapalı");
  }
}

function ensureAudioContext() {
  if (audioContext) return audioContext;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext = new AudioContextClass();
  return audioContext;
}

function playUiTone(frequency) {
  if (!state.soundEnabled) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.0001;
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.14);
}

async function sharePage() {
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: location.href });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(location.href);
      showToast("Bağlantı kopyalandı");
    }
  } catch {
    showToast("Paylaşım iptal edildi");
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else {
    app.requestFullscreen?.().catch(() => {});
  }
}

function syncFullscreenButton() {
  fullscreenButton.classList.toggle("active", Boolean(document.fullscreenElement));
  requestRender();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 1800);
}

function announce(message) {
  liveRegion.textContent = message;
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  applyIcons();
}

function restoreState() {
  const url = new URL(location.href);
  const requestedSection = url.searchParams.get("section") || url.hash.replace("#", "");
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved.sectionId && sections.some((section) => section.id === saved.sectionId)) state.sectionId = saved.sectionId;
    if (Number.isInteger(saved.cardIndex)) state.cardIndex = saved.cardIndex;
    if (typeof saved.soundEnabled === "boolean") state.soundEnabled = saved.soundEnabled;
    if (typeof saved.cardVisible === "boolean") state.cardVisible = saved.cardVisible;
  } catch {
    // ignore broken state
  }
  if (requestedSection && sections.some((section) => section.id === requestedSection)) {
    state.sectionId = requestedSection;
    state.cardIndex = 0;
  }
  const section = getSection();
  state.cardIndex = Math.min(Math.max(state.cardIndex, 0), section.cards.length - 1);
  applyIcons();
}
