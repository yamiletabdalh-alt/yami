/* =====================================================================
   ESCENA 3D DE LA PORTADA (Three.js)
   ---------------------------------------------------------------------
   Formas brillantes con los colores de la marca que flotan y siguen
   al ratón. Si el navegador no tiene WebGL, se queda el fondo de
   colores de style.css y la web funciona igual.
   ===================================================================== */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const cont = document.getElementById("escena-3d");
if (cont) {
  try { iniciar(cont); } catch (e) { /* sin 3D: queda el fondo de CSS */ }
}

function iniciar(cont) {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  cont.appendChild(renderer.domElement);

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camara = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camara.position.set(0, 0, 9);

  // Luces de colores para reflejos vivos
  const luz = (color, fuerza, x, y, z) => {
    const l = new THREE.PointLight(color, fuerza, 30, 1.6);
    l.position.set(x, y, z);
    escena.add(l);
  };
  luz(0xf0157a, 60, -4, 2, 4);
  luz(0xff7a1a, 50, 4, -2, 4);
  luz(0x7b2ff7, 70, 0, 4, -3);

  const grupo = new THREE.Group();
  escena.add(grupo);

  // Pieza central: nudo iridiscente
  const nudo = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.05, 0.36, 260, 40),
    new THREE.MeshPhysicalMaterial({
      color: 0xf0157a, metalness: 0.35, roughness: 0.16,
      clearcoat: 1, clearcoatRoughness: 0.08,
      iridescence: 1, iridescenceIOR: 1.7, iridescenceThicknessRange: [180, 820],
    })
  );
  grupo.add(nudo);

  // Formas que orbitan alrededor
  const brillo = (color, extra = {}) =>
    new THREE.MeshPhysicalMaterial(Object.assign({ color, metalness: 0.2, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 }, extra));
  const formas = [
    { m: new THREE.Mesh(new THREE.SphereGeometry(0.42, 64, 64), brillo(0xff7a1a)), p: [2.35, 1.25, 0.5], v: 1.1 },
    { m: new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), brillo(0x7b2ff7, { flatShading: true, metalness: 0.5 })), p: [-2.4, -1.15, 0.6], v: 0.8 },
    { m: new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.15, 32, 80), brillo(0xffe14d, { metalness: 0.6, roughness: 0.15 })), p: [-2.0, 1.65, -0.4], v: 1.3 },
    { m: new THREE.Mesh(new THREE.SphereGeometry(0.62, 64, 64), brillo(0xffffff, { transmission: 1, thickness: 0.9, roughness: 0.04, ior: 1.45, metalness: 0 })), p: [1.85, -1.55, 1.0], v: 0.9 },
    { m: new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), brillo(0xf0157a, { flatShading: true })), p: [0.3, 2.15, -1.2], v: 1.5 },
    { m: new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.42, 12, 32), brillo(0x22d3ee)), p: [-0.6, -2.1, 0.2], v: 1.2 },
  ];
  formas.forEach((f, i) => {
    f.m.position.set(...f.p);
    f.base = f.p;
    f.fase = i * 1.3;
    grupo.add(f.m);
  });

  // Seguir al ratón (suavizado)
  const objetivo = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    objetivo.x = (e.clientX / window.innerWidth - 0.5) * 0.9;
    objetivo.y = (e.clientY / window.innerHeight - 0.5) * 0.6;
  }, { passive: true });

  const reloj = new THREE.Clock();

  // Tamaño
  function ajustar() {
    const w = cont.clientWidth, h = cont.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.position.z = camara.aspect < 0.9 ? 11.5 : 9;
    camara.updateProjectionMatrix();
    if (quieto) cuadro();
  }
  new ResizeObserver(ajustar).observe(cont);
  ajustar();

  // Solo animar cuando se ve
  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) bucle(); }).observe(cont);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) bucle(); });

  let animando = false;
  function cuadro() {
    const t = reloj.getElapsedTime();
    nudo.rotation.x = t * 0.18;
    nudo.rotation.y = t * 0.27;
    formas.forEach((f) => {
      f.m.position.y = f.base[1] + Math.sin(t * f.v + f.fase) * 0.18;
      f.m.rotation.x = t * 0.4 * f.v;
      f.m.rotation.y = t * 0.3 * f.v;
    });
    grupo.rotation.y += (objetivo.x - grupo.rotation.y) * 0.05;
    grupo.rotation.x += (objetivo.y - grupo.rotation.x) * 0.05;
    renderer.render(escena, camara);
  }
  function bucle() {
    if (quieto || animando) return;
    animando = true;
    (function paso() {
      if (!visible || document.hidden) { animando = false; return; }
      cuadro();
      requestAnimationFrame(paso);
    })();
  }

  cont.classList.add("con-3d");
  if (quieto) cuadro(); else bucle();
}
