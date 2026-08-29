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
    model: "./kaynak/1. Kısım/Synaps Hücre.glb",
    buttonIdle: "./kaynak/1. Kısım/Dentridbağlantıbt.png",
    buttonActive: "./kaynak/1. Kısım/Dentridbağlantıbt2.png",
    defaultCamera: { direction: [0, 0.12, 1], distance: 2.5, fov: 42 },
    hotspots: [
      { cardIndex: 0, title: "Dendrit", point: [0.10, 0.64, 0.50], distance: 2.0 },
      { cardIndex: 1, title: "Hücre Gövdesi", point: [0.32, 0.48, 0.52], distance: 1.9 },
      { cardIndex: 2, title: "Çekirdek", point: [0.37, 0.50, 0.53], distance: 1.8 },
      { cardIndex: 3, title: "Miyelin Kılıf", point: [0.55, 0.49, 0.52], distance: 2.1 },
      { cardIndex: 4, title: "Ranvier Boğumu", point: [0.63, 0.49, 0.52], distance: 2.2 },
      { cardIndex: 5, title: "Akson", point: [0.76, 0.48, 0.52], distance: 2.3 },
      { cardIndex: 6, title: "Akson Ucu", point: [0.90, 0.58, 0.56], distance: 2.6 },
    ],
    cards: [
      {
        title: "Dendrit",
        description: "Diğer nöronlardan veya reseptörlerden gelen uyarıları alır ve hücre gövdesine iletir.",
        image: "./kaynak/1. Kısım/kartlar/Dendrit.png",
      },
      {
        title: "Hücre Gövdesi",
        description: "Nöronun çekirdek ve organellerini barındıran merkez bölümüdür.",
        image: "./kaynak/1. Kısım/kartlar/Hücre Gövdesi(soma).png",
      },
      {
        title: "Çekirdek",
        description: "Hücre etkinliklerini yöneten genetik kontrol merkezidir.",
        image: "./kaynak/1. Kısım/kartlar/Çekirdek.png",
      },
      {
        title: "Miyelin Kılıf",
        description: "İletimi hızlandıran yalıtıcı yapı katmanıdır.",
        image: "./kaynak/1. Kısım/kartlar/Miyelin kılıf.png",
      },
      {
        title: "Ranvier Boğumu",
        description: "İmpulsun sıçrayarak ilerlemesini sağlayan açık bölgedir.",
        image: "./kaynak/1. Kısım/kartlar/Ranvier boğumu.png",
      },
      {
        title: "Akson",
        description: "İmpulsu hücre gövdesinden akson uçlarına doğru iletir.",
        image: "./kaynak/1. Kısım/kartlar/Akson.png",
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
    model: "./kaynak/2. kısım/Synaps Bağlantı.glb",
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

const STORAGE_KEY = "noron-viewer-state-v1";
const state = {
  sectionId: "section-1",
  cardIndex: 0,
  soundEnabled: false,
  cardVisible: true,
};

const app = document.querySelector("#app");
const canvas = document.querySelector("#scene");
const sectionButtonImage1 = document.querySelector("#sectionButtonImage1");
const sectionButtonImage2 = document.querySelector("#sectionButtonImage2");
const sectionButton1 = document.querySelector("#sectionButton1");
const sectionButton2 = document.querySelector("#sectionButton2");
const refreshButton = document.querySelector("#refreshButton");
const soundButton = document.querySelector("#soundButton");
const menuButton = document.querySelector("#menuButton");
const shareButton = document.querySelector("#shareButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const refreshIcon = document.querySelector("#refreshIcon");
const soundIcon = document.querySelector("#soundIcon");
const menuIcon = document.querySelector("#menuIcon");
const shareIcon = document.querySelector("#shareIcon");
const fullscreenIcon = document.querySelector("#fullscreenIcon");
const infoCard = document.querySelector("#infoCard");
const cardClose = document.querySelector("#cardClose");
const cardImage = document.querySelector("#cardImage");
const cardFallback = document.querySelector("#cardFallback");
const cardEmblem = document.querySelector("#cardEmblem");
const cardFallbackTitle = document.querySelector("#cardFallbackTitle");
const cardFallbackDesc = document.querySelector("#cardFallbackDesc");
const cardTitle = document.querySelector("#cardTitle");
const cardDescription = document.querySelector("#cardDescription");
const menuPanel = document.querySelector("#menuPanel");
const menuSection1 = document.querySelector("#menuSection1");
const menuSection2 = document.querySelector("#menuSection2");
const menuReset = document.querySelector("#menuReset");
const menuSound = document.querySelector("#menuSound");
const loadingOverlay = document.querySelector("#loadingOverlay");
const loadingText = document.querySelector("#loadingText");
const loadingBar = document.querySelector("#loadingBar");
const toast = document.querySelector("#toast");
const liveRegion = document.querySelector("#liveRegion");
const scrim = document.querySelector("#scrim");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;
renderer.setClearColor(0x000000, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0xb69f92, 1.65));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
keyLight.position.set(3, 4, 4);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffe4d0, 0.7);
fillLight.position.set(-4, 1.5, 2);
scene.add(fillLight);

const modelRoot = new THREE.Group();
scene.add(modelRoot);
const hotspotRoot = new THREE.Group();
scene.add(hotspotRoot);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

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
let materialCache = new Map();
let hotspotTextureCache = new Map();
let cameraFlight = null;
let activeHotspotIndex = -1;
let pointerDrag = null;

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
  setButtonImage(menuIcon, "./kaynak/1. Kısım/menubt.png");
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

  cardTitle.textContent = card.title;
  cardDescription.textContent = card.description;
  currentCardSource = card.image ? new URL(card.image, import.meta.url).href : "";
  activeHotspotIndex = section.hotspots.findIndex((hotspot) => hotspot.cardIndex === state.cardIndex);

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
  menuButton.addEventListener("click", toggleMenu);
  shareButton.addEventListener("click", sharePage);
  fullscreenButton.addEventListener("click", toggleFullscreen);
  menuSection1.addEventListener("click", () => {
    hideMenu();
    switchSection("section-1");
  });
  menuSection2.addEventListener("click", () => {
    hideMenu();
    switchSection("section-2");
  });
  menuReset.addEventListener("click", () => {
    hideMenu();
    loadCurrentSection({ immediate: true });
  });
  menuSound.addEventListener("click", () => {
    hideMenu();
    toggleSound();
  });

  scrim.addEventListener("click", hideMenu);
  window.addEventListener("resize", resize);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  canvas.addEventListener("pointerdown", onCanvasPointerDown);
  canvas.addEventListener("pointermove", onCanvasPointerMove);
  canvas.addEventListener("pointerup", onCanvasPointerUp);
  canvas.addEventListener("pointerleave", () => {
    canvas.style.cursor = "default";
    pointerDrag = null;
  });
  canvas.addEventListener("dblclick", () => loadCurrentSection({ immediate: true }));
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());
  controls.addEventListener("start", () => requestRender());
  controls.addEventListener("change", () => requestRender());
}

function onKeyDown(event) {
  if (event.code === "Escape") {
    hideMenu();
    return;
  }
  if (event.code === "KeyR") loadCurrentSection({ immediate: true });
  if (event.code === "KeyF") toggleFullscreen();
  if (event.code === "KeyM") toggleMenu();
  if (event.code === "Digit1") switchSection("section-1");
  if (event.code === "Digit2") switchSection("section-2");
}

function switchSection(sectionId) {
  if (state.sectionId === sectionId) return;
  hideMenu();
  state.sectionId = sectionId;
  state.cardIndex = 0;
  applyTheme(getSection());
  showInfoCard();
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
      hotspotRoot.clear();
      cameraFlight = null;
      materialCache = new Map();
      modelRoot.add(gltf.scene);
      centerModel(gltf.scene);
      prepareModel(gltf.scene);
      applyReferenceMaterials(gltf.scene, section);
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

function applyReferenceMaterials(root, section) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const spanX = Math.max(size.x, 1);

  const createMaterial = (key, options) => {
    if (!materialCache.has(key)) {
      materialCache.set(
        key,
        new THREE.MeshStandardMaterial({
          roughness: 0.72,
          metalness: 0.02,
          flatShading: false,
          side: THREE.DoubleSide,
          ...options,
        }),
      );
    }
    return materialCache.get(key);
  };

  root.traverse((object) => {
    if (!object.isMesh) return;

    const meshBox = new THREE.Box3().setFromObject(object);
    const meshCenter = meshBox.getCenter(new THREE.Vector3());
    const x = (meshCenter.x - box.min.x) / spanX;
    const name = (object.name || "").toLowerCase();
    let material;

    if (section.id === "section-1") {
      if (name.includes("çekirdek")) {
        material = createMaterial("s1-core", {
          color: 0xdb7a25,
          roughness: 0.5,
          emissive: new THREE.Color(0x2d1204),
          emissiveIntensity: 0.1,
        });
      } else if (name.includes("çubuk") || x > 0.42) {
        const mix = THREE.MathUtils.clamp((x - 0.35) / 0.55, 0, 1);
        const color = new THREE.Color().lerpColors(new THREE.Color(0xf0a154), new THREE.Color(0x68abff), mix);
        material = createMaterial(`s1-axon-${Math.round(mix * 6)}`, {
          color,
          roughness: 0.46,
          metalness: 0.04,
        });
      } else {
        const tone = new THREE.Color().lerpColors(
          new THREE.Color(0xf3aa62),
          new THREE.Color(0xffd3a1),
          THREE.MathUtils.clamp(0.2 + (center.x - meshCenter.x) / spanX * 0.12, 0, 1),
        );
        material = createMaterial(`s1-base-${Math.round(x * 4)}`, {
          color: tone,
          roughness: 0.6,
          metalness: 0.02,
        });
      }
    } else {
      if (name.includes("kırmızı")) {
        material = createMaterial(`s2-red-${name}`, {
          color: 0xd81f26,
          roughness: 0.55,
          metalness: 0.04,
          emissive: new THREE.Color(0x360000),
          emissiveIntensity: 0.16,
        });
      } else if (name.includes("yeşil")) {
        material = createMaterial(`s2-green-${name}`, {
          color: 0x4fc87f,
          roughness: 0.52,
          metalness: 0.03,
          emissive: new THREE.Color(0x11361b),
          emissiveIntensity: 0.08,
        });
      } else if (name.includes("sphere")) {
        material = createMaterial(`s2-sphere-${name}`, {
          color: 0x7153e8,
          roughness: 0.43,
          metalness: 0.08,
          emissive: new THREE.Color(0x160f48),
          emissiveIntensity: 0.11,
        });
      } else if (name.includes("tube") || name.includes("bağlantı") || name.includes("kanal")) {
        const channelColor = x > 0.5 ? 0x1847e8 : 0x2c6eff;
        material = createMaterial(`s2-channel-${Math.round(x * 6)}`, {
          color: channelColor,
          roughness: 0.34,
          metalness: 0.12,
          emissive: new THREE.Color(0x07124c),
          emissiveIntensity: 0.18,
        });
      } else if (name.includes("akson") || name.includes("dendrit") || name.includes("sarmaşık")) {
        const warm = x > 0.52 ? 0xd8ab82 : 0xbd8361;
        material = createMaterial(`s2-nerve-${Math.round(x * 4)}`, {
          color: warm,
          roughness: 0.9,
          metalness: 0.0,
        });
      } else {
        const base = x > 0.52 ? 0x9a7764 : 0x6b5246;
        material = createMaterial(`s2-base-${Math.round(x * 5)}`, {
          color: base,
          roughness: 0.96,
          metalness: 0.0,
        });
      }
    }

    object.material = material;
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

  section.hotspots.forEach((hotspot, index) => {
    const marker = createHotspotMarker(section, hotspot, index);
    marker.position.copy(toPoint(hotspot.point));
    marker.userData.hotspot = hotspot;
    marker.userData.hotspotIndex = index;
    hotspotRoot.add(marker);
  });

  syncHotspots();
}

function createHotspotMarker(section, hotspot, index) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: getHotspotTexture(section.accent),
      transparent: true,
      depthTest: false,
      depthWrite: false,
      opacity: 0.95,
      color: new THREE.Color(section.accent),
    }),
  );
  sprite.renderOrder = 999;
  sprite.userData.hotspot = hotspot;
  sprite.userData.hotspotIndex = index;
  return sprite;
}

function getHotspotTexture(accent) {
  if (hotspotTextureCache.has(accent)) return hotspotTextureCache.get(accent);

  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 128;
  canvasTexture.height = 128;
  const context = canvasTexture.getContext("2d");
  const cx = 64;
  const cy = 64;
  const fill = accent || "#ff7d2f";

  const glow = context.createRadialGradient(cx, cy, 6, cx, cy, 54);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.32, fill);
  glow.addColorStop(0.72, "rgba(255,125,47,0.56)");
  glow.addColorStop(1, "rgba(255,125,47,0)");
  context.fillStyle = glow;
  context.beginPath();
  context.arc(cx, cy, 54, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(cx, cy, 28, 0, Math.PI * 2);
  context.fill();

  context.lineWidth = 10;
  context.strokeStyle = fill;
  context.beginPath();
  context.arc(cx, cy, 28, 0, Math.PI * 2);
  context.stroke();

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  hotspotTextureCache.set(accent, texture);
  return texture;
}

function syncHotspots() {
  hotspotRoot.children.forEach((marker) => {
    const isActive = marker.userData.hotspotIndex === activeHotspotIndex;
    marker.material.color.set(getSection().accent);
    marker.material.opacity = isActive ? 1 : 0.84;
    marker.scale.setScalar((isActive ? 1.55 : 1.1) * Math.max(modelRadius * 0.014, 34));
  });
  requestRender();
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
  const target = hotspot.target ? new THREE.Vector3(...hotspot.target) : hotspotRoot.children[index]?.position.clone() || new THREE.Vector3();
  const position = target.clone().add(direction.multiplyScalar(distance));

  animateCameraTo(position, target);
  playUiTone(520);
  showToast(hotspot.title || getCurrentCard().title);
}

function animateCameraTo(position, target) {
  cameraFlight = {
    startedAt: performance.now(),
    duration: 650,
    fromPosition: camera.position.clone(),
    fromTarget: controls.target.clone(),
    toPosition: position.clone(),
    toTarget: target.clone(),
  };
  controls.enabled = false;
  requestRender();
}

function updateCameraFlight(now) {
  if (!cameraFlight) return;

  const t = THREE.MathUtils.clamp((now - cameraFlight.startedAt) / cameraFlight.duration, 0, 1);
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  camera.position.lerpVectors(cameraFlight.fromPosition, cameraFlight.toPosition, eased);
  controls.target.lerpVectors(cameraFlight.fromTarget, cameraFlight.toTarget, eased);
  controls.update();
  requestRender();

  if (t >= 1) {
    camera.position.copy(cameraFlight.toPosition);
    controls.target.copy(cameraFlight.toTarget);
    controls.update();
    controls.enabled = true;
    cameraFlight = null;
  }
}

function showInfoCard() {
  state.cardVisible = true;
  infoCard.classList.remove("hidden");
}

function hideInfoCard() {
  state.cardVisible = false;
  infoCard.classList.add("hidden");
  persistState();
  showToast("Kart kapatıldı");
}

function getHotspotIntersection(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(hotspotRoot.children, true)[0] || null;
}

function onCanvasPointerDown(event) {
  pointerDrag = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    moved: false,
  };
}

function onCanvasPointerMove(event) {
  if (pointerDrag && pointerDrag.id === event.pointerId) {
    const deltaX = Math.abs(event.clientX - pointerDrag.x);
    const deltaY = Math.abs(event.clientY - pointerDrag.y);
    if (deltaX > 5 || deltaY > 5) pointerDrag.moved = true;
  }

  const hit = getHotspotIntersection(event);
  canvas.style.cursor = hit ? "pointer" : "default";
}

function onCanvasPointerUp(event) {
  if (!pointerDrag || pointerDrag.id !== event.pointerId) return;

  const hit = pointerDrag.moved ? null : getHotspotIntersection(event);
  pointerDrag = null;
  if (!hit) return;

  const hotspot = hit.object.userData.hotspot;
  const index = hit.object.userData.hotspotIndex ?? 0;
  focusHotspot(hotspot, index);
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
  controls.update();
  if (!renderRequested) return;
  renderer.render(scene, camera);
  renderRequested = false;
}

function requestRender() {
  renderRequested = true;
}

function toggleMenu() {
  menuPanel.classList.toggle("hidden");
  const hidden = menuPanel.classList.contains("hidden");
  menuPanel.setAttribute("aria-hidden", String(hidden));
  scrim.classList.toggle("hidden", hidden);
  playUiTone(280);
}

function hideMenu() {
  menuPanel.classList.add("hidden");
  menuPanel.setAttribute("aria-hidden", "true");
  scrim.classList.add("hidden");
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
