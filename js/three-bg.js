/* Topological wireframe — abstract transformer activation landscape
   Colors updated to match dark-gray / burgundy / forest palette */
(function () {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(
    46, window.innerWidth / window.innerHeight, 0.1, 200
  );
  cam.position.set(0, 13, 22);
  cam.lookAt(0, 0, 0);

  function makeMesh(color, opacity, segs) {
    const geo = new THREE.PlaneGeometry(44, 44, segs, segs);
    const mat = new THREE.MeshBasicMaterial({
      color, wireframe: true, transparent: true, opacity
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI * 0.42;
    scene.add(mesh);
    return { mesh, geo };
  }

  // Deep rust primary layer — matches --sienna: #8C3420
  const burg  = makeMesh(0x6B2518, 0.22, 58);
  // Muted blush secondary layer — matches --forest: #5C2E2A
  const forest = makeMesh(0x3D1E1B, 0.10, 36);
  forest.mesh.position.z = 0.9;

  function h(x, y, t, ph) {
    return (
      Math.sin(x * 0.36 + t * 0.27 + ph) * Math.cos(y * 0.41 + t * 0.19) * 1.35 +
      Math.sin(x * 0.71 + y * 0.54 + t * 0.46) * 0.68 +
      Math.cos(x * 0.17 - y * 0.3  + t * 0.13) * 0.95 +
      Math.sin((x + y) * 0.57 + t * 0.61) * 0.38
    );
  }

  function animateMesh({ geo }, t, ph) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, h(pos.getX(i), pos.getY(i), t, ph));
    }
    pos.needsUpdate = true;
  }

  let t = 0;
  (function tick() {
    requestAnimationFrame(tick);
    t += 0.004;
    animateMesh(burg,  t, 0);
    animateMesh(forest, t, 1.6);
    cam.position.x = Math.sin(t * 0.09) * 1.8;
    cam.lookAt(0, 0, 0);
    renderer.render(scene, cam);
  })();

  window.addEventListener('resize', () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
