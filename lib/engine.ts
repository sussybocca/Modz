import * as THREE from "three";
import { World } from "./mw"; // Import your World type

export function startEngine(container: HTMLElement, world: World) {
  container.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.set(0, 2, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  container.appendChild(renderer.domElement);
  resize();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  // Build the room mesh
  let room = buildRoom();
  scene.add(room);

  // ---- Player movement ----
  const keys: Record<string, boolean> = {};
  document.addEventListener("keydown", (e) => (keys[e.code] = true));
  document.addEventListener("keyup", (e) => (keys[e.code] = false));

  const velocity = new THREE.Vector3();

  // ---- Mouse look ----
  let yaw = 0,
    pitch = 0;
  renderer.domElement.onclick = () => renderer.domElement.requestPointerLock();
  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement !== renderer.domElement) return;
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-1.5, Math.min(1.5, pitch));
  });

  // ---- Resize handler ----
  function resize() {
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  // ---- Build room ----
  function buildRoom() {
    const [x, y, z] = world.room.size;
    const geo = new THREE.BoxGeometry(x, y, z);
    const mat = new THREE.MeshStandardMaterial({ color: 0x4444ff, wireframe: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.geometry.translate(0, y / 2, 0);
    return mesh;
  }

  // ---- Load mod assets (textures / FBX placeholders) ----
  world.mods.forEach((mod) => {
    if (mod.assets) {
      for (const [name, buffer] of Object.entries(mod.assets)) {
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        console.log("Loaded asset from mod:", name, url);
      }
    }
  });

  // ---- World update hook ----
  let lastSize = world.room.size.join(",");
  function updateWorld() {
    const now = world.room.size.join(",");
    if (now !== lastSize) {
      scene.remove(room);
      room.geometry.dispose();
      room.material.dispose();
      room = buildRoom();
      scene.add(room);
      lastSize = now;
    }
  }

  // ---- Game loop ----
  function loop() {
    requestAnimationFrame(loop);

    updateWorld();

    velocity.set(0, 0, 0);
    if (keys["KeyW"]) velocity.z -= 0.08;
    if (keys["KeyS"]) velocity.z += 0.08;
    if (keys["KeyA"]) velocity.x -= 0.08;
    if (keys["KeyD"]) velocity.x += 0.08;

    const dir = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new THREE.Vector3(dir.z, 0, -dir.x);

    camera.position.addScaledVector(dir, velocity.z);
    camera.position.addScaledVector(right, velocity.x);

    camera.rotation.set(pitch, yaw, 0);

    renderer.render(scene, camera);
  }

  loop();
}
