import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface BurgerLayerInfo {
  mesh: THREE.Mesh;
  origPos: THREE.Vector3;
  origRot: THREE.Euler;
  deltaPos: THREE.Vector3;
  deltaRot: THREE.Euler;
  layerKey: string;
  label: string;
}

interface BurgerCanvasProps {
  progress: number; // 0 to 1 scroll explode progress
  isActive?: boolean;
}

export const BurgerCanvas: React.FC<BurgerCanvasProps> = ({ progress, isActive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const progressRef = useRef(progress);
  progressRef.current = progress;

  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  useEffect(() => {
    isActiveRef.current = isActive;
    if (isActive && containerRef.current) {
      // Immediate resync when returning to active view
      window.dispatchEvent(new Event("resize"));
    }
  }, [isActive]);

  const currentProgressRef = useRef(progress);
  const layersRef = useRef<BurgerLayerInfo[]>([]);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const spinGroupRef = useRef<THREE.Group | null>(null);
  const plateGroupRef = useRef<THREE.Group | null>(null);
  const autoRotateAngleRef = useRef(0.55);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, rotX: 0, rotY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const width = container.clientWidth || window.innerWidth || 600;
    const height = container.clientHeight || window.innerHeight || 600;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.22, 6.2);
    camera.lookAt(0, 0.14, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 2. Studio Lighting (tuned for richer, slightly deeper shades)
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.25);
    scene.add(ambientLight);

    // Warm Key Light (Front-Top-Right)
    const keyLight = new THREE.DirectionalLight(0xffb844, 2.6);
    keyLight.position.set(4.5, 6.5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Top Crown Fill to balance sesame brioche crown highlights
    const topCrownLight = new THREE.DirectionalLight(0xffe8c8, 1.35);
    topCrownLight.position.set(0, 7.5, 2.5);
    scene.add(topCrownLight);

    // Golden Rim / Back Light (Back-Left)
    const rimLight = new THREE.DirectionalLight(0xff7711, 2.4);
    rimLight.position.set(-4.5, 4.5, -4);
    scene.add(rimLight);

    // Soft Front Fill (subtle to allow natural shadow contouring)
    const fillLight = new THREE.DirectionalLight(0xffedd8, 1.05);
    fillLight.position.set(0, 1.5, 5);
    scene.add(fillLight);

    // Warm Under-Glow for bottom toasted brioche heel
    const bottomGlow = new THREE.PointLight(0xff9922, 2.0, 12);
    bottomGlow.position.set(0, -2.5, 1.5);
    scene.add(bottomGlow);

    // 3. Burger Model Root Group & Spin Group (for auto-rotation)
    const isMobileInit = width <= 768;
    const aspectInit = width / (height || 1);
    const halfWidthHeroInit = 6.2 * Math.tan((34 * Math.PI) / 360) * aspectInit;
    const halfWidthPlatedInit = 6.6 * Math.tan((34 * Math.PI) / 360) * aspectInit;
    const ndcOffsetInit = isMobileInit ? 0 : Math.min(0.50, 740 / width);
    const initStartX = ndcOffsetInit * halfWidthHeroInit;
    const initTargetX = -ndcOffsetInit * halfWidthPlatedInit;

    const rootGroup = new THREE.Group();
    rootGroup.position.set(initStartX, isMobileInit ? 0.38 : 0, 0);
    scene.add(rootGroup);
    modelGroupRef.current = rootGroup;

    const spinGroup = new THREE.Group();
    rootGroup.add(spinGroup);
    spinGroupRef.current = spinGroup;

    // 3.5 Handcrafted Ceramic Serving Plate (compact & proportional burger plate)
    const plateGroup = new THREE.Group();
    plateGroup.position.set(initTargetX, isMobileInit ? 0.38 : -0.88, 0);
    plateGroup.rotation.x = 0.12;
    plateGroup.scale.setScalar(0.001); // starts hidden until flight phase
    scene.add(plateGroup);
    plateGroupRef.current = plateGroup;

    // Artisanal Slate Ceramic Plate Lathe Geometry (compact diameter, sleek modern low-profile rim)
    const platePoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.85, 0),
      new THREE.Vector2(0.98, 0.015),
      new THREE.Vector2(1.06, 0.050),
      new THREE.Vector2(1.04, 0.062),
      new THREE.Vector2(0.96, 0.030),
      new THREE.Vector2(0.84, 0.015),
      new THREE.Vector2(0, 0.015)
    ];
    const plateGeo = new THREE.LatheGeometry(platePoints, 48);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x181412,
      roughness: 0.40,
      metalness: 0.18,
      side: THREE.DoubleSide
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.receiveShadow = true;
    plateMesh.frustumCulled = false;
    plateGroup.add(plateMesh);

    // Warm Brass Gold Accent Rim (scaled to compact plate)
    const rimGeo = new THREE.TorusGeometry(1.05, 0.012, 16, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4a034,
      roughness: 0.25,
      metalness: 0.88
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.055;
    rimMesh.frustumCulled = false;
    plateGroup.add(rimMesh);

    // Burger Direct Contact Shadow on Plate Bed
    const contactShadowGeo = new THREE.CircleGeometry(0.65, 32);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.58
    });
    const contactShadowMesh = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.y = 0.020;
    contactShadowMesh.frustumCulled = false;
    plateGroup.add(contactShadowMesh);

    // Plate Soft Ambient Contact Shadow Underneath Plate
    const shadowGeo = new THREE.CircleGeometry(0.95, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    shadowMesh.frustumCulled = false;
    plateGroup.add(shadowMesh);

    // Dedicated Pendant Lamp Overhead Spotlight for the Plate Bed
    const plateLight = new THREE.SpotLight(0xffcaa0, 0, 18, Math.PI / 3.6, 1.0, 1.1);
    plateLight.position.set(isMobileInit ? 0 : -1.80, 4.0, 0.6);
    plateLight.target = plateGroup;
    plateLight.castShadow = true;
    scene.add(plateLight);

    // Dedicated Overhead Burger Spotlight (shines directly down onto the burger crown and sesame seeds)
    const burgerSpotLight = new THREE.SpotLight(0xfff5dd, 0, 16, Math.PI / 4.0, 0.35, 1.0);
    burgerSpotLight.position.set(isMobileInit ? 0 : -1.80, 3.8, 0.8);
    burgerSpotLight.target = rootGroup;
    burgerSpotLight.castShadow = true;
    scene.add(burgerSpotLight);

    // Dynamic Crown Highlight Point Light (hovers right over the top brioche bun for glistening specular glow)
    const crownHighlightLight = new THREE.PointLight(0xffbe50, 0, 4.5, 1.2);
    crownHighlightLight.position.set(isMobileInit ? 0 : -1.80, 0.5, 0.4);
    scene.add(crownHighlightLight);

    // Warm Edison Filament Bulb Point Light for close-up radiant crown & cheese illumination
    const bulbPointLight = new THREE.PointLight(0xff9a24, 0, 8, 1.5);
    bulbPointLight.position.set(isMobileInit ? 0 : -1.80, 2.8, 0.4);
    scene.add(bulbPointLight);

    // 4. Load GLTF with Draco Decompression support
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    dracoLoader.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      "/images/burger_merged.glb",
      (gltf) => {
        const model = gltf.scene;
        const layers: BurgerLayerInfo[] = [];
        const meshes: { mesh: THREE.Mesh; matName: string; center: THREE.Vector3 }[] = [];

        // Remove Cube073 / fries node from the GLTF scene
        const friesGroup = model.getObjectByName("Cube.016") || model.getObjectByName("Cube.073");
        if (friesGroup) {
          friesGroup.removeFromParent();
        }

        // Traverse and enhance each material with mouth-watering realistic colors
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const matName = mesh.material
              ? (Array.isArray(mesh.material)
                  ? mesh.material.map((m) => m.name).join(" ")
                  : mesh.material.name
                ).toLowerCase()
              : "";

            // Hide any remaining fries mesh
            if (matName.includes("fries") || (mesh.name && mesh.name.toLowerCase().includes("cube"))) {
              mesh.visible = false;
              return;
            }

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.frustumCulled = false;

            // Apply appetizing PBR materials
            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((mat) => {
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  const stdMat = mat as THREE.MeshStandardMaterial;
                  stdMat.side = THREE.DoubleSide;

                  if (matName.includes("bread_outside._top.002")) {
                    // Bottom Brioche Bun Heel - slightly deeper toasted warm caramel
                    stdMat.color.setHex(0xb8671b);
                    stdMat.roughness = 0.68;
                    stdMat.metalness = 0.04;
                  } else if (matName.includes("bread_outside._top")) {
                    // Top Brioche Bun Crown - slightly deeper golden brioche with appetizing specular sheen
                    stdMat.color.setHex(0xc4741e);
                    stdMat.roughness = 0.38;
                    stdMat.metalness = 0.05;
                  } else if (matName.includes("pit")) {
                    // Sesame Seeds (toasted cream, glistens under spotlight)
                    stdMat.color.setHex(0xfffaea);
                    stdMat.roughness = 0.22;
                    stdMat.metalness = 0.0;
                  } else if (matName.includes("meat")) {
                    // Smashed Angus Beef Patty - rich dark sear
                    stdMat.color.setHex(0x2a150c);
                    stdMat.roughness = 0.44;
                    stdMat.metalness = 0.05;
                  } else if (matName.includes("cheese")) {
                    // Melted Wisconsin Cheddar - rich deep cheddar
                    stdMat.color.setHex(0xea8c04);
                    stdMat.roughness = 0.25;
                    stdMat.metalness = 0.02;
                  } else if (matName.includes("material.002")) {
                    // Fresh Leaf Lettuce & Pickles - deeper crisp green
                    stdMat.color.setHex(0x3e7a1e);
                    stdMat.roughness = 0.40;
                    stdMat.metalness = 0.02;
                  } else if (matName.includes("material.001")) {
                    // Ripe Tomatoes - deep vine red
                    stdMat.color.setHex(0xb02010);
                    stdMat.roughness = 0.24;
                    stdMat.metalness = 0.04;
                  } else if (matName.includes("side") || matName.includes("onion")) {
                    // Sweet Caramelized Onions - rich deep glaze
                    stdMat.color.setHex(0x731e2f);
                    stdMat.roughness = 0.35;
                    stdMat.metalness = 0.03;
                  }
                }
              });
            }

            mesh.geometry.computeBoundingBox();
            const bbox = mesh.geometry.boundingBox;
            const center = new THREE.Vector3();
            if (bbox) bbox.getCenter(center);
            mesh.localToWorld(center);

            meshes.push({ mesh, matName, center });
          }
        });

        // Compute overall bounds strictly from burger model
        const overallBbox = new THREE.Box3().setFromObject(model);
        const overallCenter = new THREE.Vector3();
        overallBbox.getCenter(overallCenter);
        const overallSize = new THREE.Vector3();
        overallBbox.getSize(overallSize);

        // Center model within rootGroup
        model.position.set(-overallCenter.x, -overallCenter.y + 0.15, -overallCenter.z);

        const maxDim = Math.max(overallSize.x, overallSize.y, overallSize.z);
        const baseScale = maxDim > 0 ? 2.45 / maxDim : 1;
        model.scale.setScalar(baseScale);

        // Classify each mesh into its explosion trajectory with generous breathing room
        meshes.forEach(({ mesh, matName, center }) => {
          const origPos = mesh.position.clone();
          const origRot = mesh.rotation.clone();

          let deltaPos = new THREE.Vector3(0, 0, 0);
          let deltaRot = new THREE.Euler(0, 0, 0);
          let layerKey = "misc";
          let label = "Topping";

          const m = matName.toLowerCase();

          if (m === "bread_outside._top.002" || (m.endsWith(".002") && m.includes("bread"))) {
            // Bottom Bun Heel: moves DOWN gracefully
            deltaPos = new THREE.Vector3(0, -0.65, 0);
            deltaRot = new THREE.Euler(0, 0, 0);
            layerKey = "bottom-bun";
            label = "Toasted Brioche Heel";
          } else if (m === "bread_outside._top" || m.includes("pit")) {
            // Top Brioche Crown & Sesame: strictly locked together
            deltaPos = new THREE.Vector3(0, 1.20, 0);
            deltaRot = new THREE.Euler(0, 0, 0);
            layerKey = "top-bun";
            label = "Golden Brioche Crown & Sesame";
          } else if (m.includes("meat")) {
            // Angus Patty: moves slightly down
            deltaPos = new THREE.Vector3(0, -0.28, 0);
            deltaRot = new THREE.Euler(0, 0, 0);
            layerKey = "angus-patty";
            label = "Double-Ground Smashed Patty";
          } else if (m.includes("cheese")) {
            // Melted Cheddar: stays near center
            deltaPos = new THREE.Vector3(0, -0.02, 0);
            deltaRot = new THREE.Euler(0, 0, 0);
            layerKey = "melted-cheddar";
            label = "Wisconsin Sharp Cheddar";
          } else if (m === "material.002") {
            // Crisp Lettuce / Pickles: moves UP
            deltaPos = new THREE.Vector3(0, 0.28, 0);
            deltaRot = new THREE.Euler(0, 0, 0);
            layerKey = "lettuce-pickles";
            label = "Crisp Greens & Dill Pickles";
          } else if (m.includes("onion") || m === "side") {
            // Grilled Onions: moves UP
            deltaPos = new THREE.Vector3(0, 0.58, 0);
            deltaRot = new THREE.Euler(0, 0, 0);
            layerKey = "grilled-onions";
            label = "Caramelized Spanish Onions";
          } else if (m === "material.001") {
            // Fresh Tomatoes: moves UP
            deltaPos = new THREE.Vector3(0, 0.88, 0);
            deltaRot = new THREE.Euler(0, 0, 0);
            layerKey = "vine-tomatoes";
            label = "Vine-Ripened Tomatoes";
          } else {
            const relY = center.y - overallCenter.y;
            if (relY > 0.5) {
              deltaPos = new THREE.Vector3(0, 1.20, 0);
              layerKey = "top-bun";
              label = "Brioche Crown";
            } else if (relY > 0.1) {
              deltaPos = new THREE.Vector3(0, 0.58, 0);
              layerKey = "garnishes";
              label = "Garnish";
            } else if (relY > -0.2) {
              deltaPos = new THREE.Vector3(0, -0.02, 0);
              layerKey = "patty";
              label = "Patty";
            } else {
              deltaPos = new THREE.Vector3(0, -0.65, 0);
              layerKey = "bottom-bun";
              label = "Brioche Heel";
            }
          }

          layers.push({
            mesh,
            origPos,
            origRot,
            deltaPos,
            deltaRot,
            layerKey,
            label
          });
        });

        layersRef.current = layers;
        spinGroup.add(model);
        setLoading(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("burger-3d-ready"));
        }
      },
      undefined,
      (err) => {
        console.error("Error loading burger_merged.glb:", err);
        setLoadError("Failed to load 3D model asset");
        setLoading(false);
      }
    );

    // 5. Mouse Parallax & Pointer Drag Listeners
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));

      if (dragRef.current.isDragging) {
        const deltaX = (e.clientX - dragRef.current.startX) * 0.007;
        const deltaY = (e.clientY - dragRef.current.startY) * 0.007;
        autoRotateAngleRef.current += deltaX;
        dragRef.current.rotX = Math.max(-0.5, Math.min(0.5, dragRef.current.rotX + deltaY));
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    const handlePointerUp = () => {
      dragRef.current.isDragging = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    // 6. Responsive Resize Handler & Lifecycle Observers
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW <= 0 || newH <= 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // Watch container directly for display: block / visibility toggles
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            handleResize();
          }
        }
      });
      resizeObserver.observe(container);
    }

    // WebGL Context recovery
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("WebGL context lost, pausing render.");
    };

    const handleContextRestored = () => {
      console.info("WebGL context restored, resuming.");
      handleResize();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    // 7. 60FPS RAF Render Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Guard 1: View must be active
      if (!isActiveRef.current) return;

      // Guard 2: Container must have non-zero dimensions (prevents NaN camera matrix)
      const clientW = container.clientWidth;
      const clientH = container.clientHeight;
      if (clientW <= 0 || clientH <= 0) return;

      // Guard 3: Aspect auto-recovery if resized without window event
      const currentAspect = clientW / clientH;
      if (Math.abs(camera.aspect - currentAspect) > 0.005) {
        camera.aspect = currentAspect;
        camera.updateProjectionMatrix();
        renderer.setSize(clientW, clientH, false);
      }

      // Smooth magnetic progress scrubbing
      currentProgressRef.current +=
        (progressRef.current - currentProgressRef.current) * 0.14;
      const rawP = currentProgressRef.current;

      // Two-phase choreography:
      // Phase 1 (0.00 to 0.40): Section 1 Hero Explosion (explodeP: 0 -> 1, flightP: 0)
      // Phase 2 (0.40 to 0.80): Flight to Section 2 Plate (flightP: 0 -> 1, explodeP: 1 -> 0, drops onto plate!)
      // Phase 3 (0.80 to 1.00): Section 2 Plated Rest View (flightP: 1, explodeP: 0)

      let explodeP = 0;
      let flightP = 0;

      if (rawP <= 0.40) {
        const normP = rawP / 0.40;
        explodeP = normP * normP * (3 - 2 * normP);
        flightP = 0;
      } else if (rawP <= 0.80) {
        const t = (rawP - 0.40) / (0.80 - 0.40);
        const smoothT = t * t * (3 - 2 * t);
        flightP = smoothT;
        // Layers collapse back together into rest view as burger flies towards the plate
        explodeP = Math.max(0, 1 - smoothT * 1.25);
      } else {
        flightP = 1;
        explodeP = 0; // 100% resting view on plate
      }

      // Mouse Parallax smooth lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Explode Layers update (re-assembles to rest view on plate)
      const layers = layersRef.current;
      for (let i = 0; i < layers.length; i++) {
        const item = layers[i];
        item.mesh.position.x = item.origPos.x + item.deltaPos.x * explodeP;
        item.mesh.position.y = item.origPos.y + item.deltaPos.y * explodeP;
        item.mesh.position.z = item.origPos.z + item.deltaPos.z * explodeP;

        item.mesh.rotation.x = item.origRot.x + item.deltaRot.x * explodeP;
        item.mesh.rotation.y = item.origRot.y + item.deltaRot.y * explodeP;
        item.mesh.rotation.z = item.origRot.z + item.deltaRot.z * explodeP;
      }

      // Continuous 360-degree auto-rotation around the burger's vertical axis
      if (!dragRef.current.isDragging) {
        autoRotateAngleRef.current += 0.002;
      }

      if (spinGroupRef.current) {
        spinGroupRef.current.rotation.y = autoRotateAngleRef.current;
      }

      // Responsive X offsets: desktop/laptop/tablet vs mobile
      // Tablet (>= 768px) and bigger follow desktop/laptop side-by-side 2-column layout
      // Mobile (<= 768px) follows stacked vertical layout
      const isMobile = clientW <= 768;
      const aspect = currentAspect;
      const halfWidthHero = 6.2 * Math.tan((34 * Math.PI) / 360) * aspect;
      const halfWidthPlated = 6.6 * Math.tan((34 * Math.PI) / 360) * aspect;
      const ndcOffset = isMobile ? 0 : Math.min(0.50, 740 / Math.max(1, clientW));

      const startX = ndcOffset * halfWidthHero;
      const targetX = -ndcOffset * halfWidthPlated;
      const currentX = startX + (targetX - startX) * flightP;

      const isTablet = !isMobile && clientW < 1024;

      // Section 1: Hero scale strictly untouched
      const heroScale = isMobile ? 0.52 : (isTablet ? 0.56 : 0.72);

      // Section 2: Enlarged responsive burger & plate scale for tablet and desktop
      let platedScale = 0.36; // Mobile unchanged
      let plateScaleFactor = 0.58; // Mobile unchanged
      let targetPlateY = 0.38; // Mobile unchanged
      let targetBaseY = 0.65; // Mobile unchanged

      if (!isMobile) {
        if (isTablet) {
          // Tablet (768px - 1023px): gently reduced to sweet-spot size
          platedScale = 0.55;
          plateScaleFactor = 0.90;
          targetPlateY = -0.90;
          targetBaseY = targetPlateY + 0.38 * (platedScale / 0.54);
        } else {
          // Desktop (>= 1024px): tuned to a balanced 0.66 (at 1024px) up to 0.73 (at 1920px)
          const widthT = Math.min(1.0, Math.max(0, (clientW - 1024) / (1920 - 1024)));
          platedScale = 0.66 + widthT * 0.07;
          plateScaleFactor = platedScale * 1.63;
          targetPlateY = -0.92 - widthT * 0.03;
          targetBaseY = targetPlateY + 0.38 * (platedScale / 0.54);
        }
      }

      const burgerScale = heroScale * (1 - flightP) + platedScale * flightP;

      // Vertical translation:
      // On mobile: Section 1 sits in upper-middle (startY = 0.38)
      // In Section 2: Burger glides to rest flush on the plate surface
      // On tablet/laptop/desktop: 2-column side-by-side layout (startY = 0)
      const startY = isMobile ? 0.38 : 0;
      const currentBaseY = startY + (targetBaseY - startY) * flightP;

      // Flight parabolic arc & cushioned landing into plate
      const arcY = Math.sin(flightP * Math.PI) * (isMobile ? 0.22 : 0.45);
      const landingImpact = flightP > 0.86 ? Math.sin(((flightP - 0.86) / 0.14) * Math.PI) * 0.035 : 0;
      const currentY = currentBaseY + arcY - landingImpact;

      // Orientation transition: from 135-deg tilt to parallel dining plate rest view
      const heroRotX = 0.68 + explodeP * 0.08;
      const platedRotX = 0.12;
      const currentRotX = heroRotX * (1 - flightP) + platedRotX * flightP;

      const heroRotZ = 0.52 + explodeP * 0.06;
      const platedRotZ = 0.0;
      const currentRotZ = heroRotZ * (1 - flightP) + platedRotZ * flightP;

      const time = Date.now() * 0.0015;

      if (
        modelGroupRef.current &&
        Number.isFinite(currentX) &&
        Number.isFinite(currentY) &&
        Number.isFinite(burgerScale) &&
        burgerScale > 0
      ) {
        modelGroupRef.current.position.x = currentX;
        // Hover bobbing smoothly settles to 0 when resting on plate
        const hoverBob = Math.sin(time) * 0.025 * Math.max(0, 1 - flightP * 1.05);
        modelGroupRef.current.position.y = currentY + hoverBob;
        modelGroupRef.current.rotation.x =
          currentRotX - mouseRef.current.y * 0.12 + dragRef.current.rotX;
        modelGroupRef.current.rotation.y =
          mouseRef.current.x * 0.15;
        modelGroupRef.current.rotation.z = currentRotZ;
        modelGroupRef.current.scale.setScalar(burgerScale);
      }

      // Plate scale and position: emerges as burger flies in
      if (plateGroupRef.current && Number.isFinite(targetX) && Number.isFinite(targetPlateY)) {
        plateGroupRef.current.position.x = targetX;
        plateGroupRef.current.rotation.x = 0.12;
        const plateAppearance = Math.max(0, Math.min(1, (flightP - 0.18) / 0.60));
        const smoothPlateScale = plateAppearance * plateAppearance * (3 - 2 * plateAppearance);
        plateGroupRef.current.scale.setScalar(Math.max(0.001, smoothPlateScale * plateScaleFactor));
        plateGroupRef.current.position.y = targetPlateY + (1 - smoothPlateScale) * -0.20;
      }

      // Dynamic Camera Dolly & Framing (pulls back in Section 2 for spacious dining perspective)
      const heroCamZ = 6.2 + explodeP * 1.8;
      const platedCamZ = 6.6;
      const targetCamZ = heroCamZ * (1 - flightP) + platedCamZ * flightP;
      camera.position.z += (targetCamZ - camera.position.z) * 0.14;
      camera.position.y += (0.16 - camera.position.y) * 0.14;

      const lookAtY = isMobile
        ? 0.12 * (1 - flightP) + 0.10 * flightP
        : -0.08 * flightP - 0.04 * (1 - flightP);
      if (Number.isFinite(currentX) && Number.isFinite(lookAtY)) {
        camera.lookAt(currentX * 0.16, lookAtY, 0);
      }

      // Section 2: Dark Studio chiaroscuro lighting modulation
      ambientLight.intensity = 1.25 * (1 - flightP * 0.38); // dims gently to ~0.78, preserving rich contrast
      keyLight.intensity = 2.6 * (1 - flightP * 0.25);
      topCrownLight.intensity = 1.35 + flightP * 0.45; // subtle overhead lift
      fillLight.intensity = 1.05 * (1 - flightP * 0.30);
      rimLight.intensity = 2.4 * (1 - flightP * 0.22);

      // Dedicated Overhead Burger Spotlight (falls straight onto the burger with gentle warm focus)
      burgerSpotLight.intensity = flightP * 4.2;
      burgerSpotLight.position.x = currentX;
      burgerSpotLight.position.y = isMobile ? 4.1 : 3.8;
      if (modelGroupRef.current) {
        burgerSpotLight.target = modelGroupRef.current;
      }

      // Dynamic Crown Point Light (tasteful glistening warmth on top brioche bun)
      crownHighlightLight.intensity = flightP * 2.4;
      crownHighlightLight.position.set(currentX, currentY + 0.55, 0.45);

      // Plate bed spotlight & pendant filament bulb point light
      plateLight.intensity = flightP * 2.6;
      plateLight.position.set(currentX, isMobile ? 4.0 : 4.0, 0.6);
      bulbPointLight.intensity = flightP * 1.5;
      bulbPointLight.position.set(currentX, isMobile ? 2.9 : 2.8, 0.4);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", handleResize);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => m.dispose());
          }
        }
      });

      dracoLoader.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="burger-canvas-wrapper" ref={containerRef}>
      {loading && (
        <div className="burger-canvas__loading">
          <div className="burger-canvas__spinner"></div>
          <span className="burger-canvas__loading-text">Preparing 3D Smash Burger...</span>
        </div>
      )}

      {loadError && (
        <div className="burger-canvas__error">
          <span>{loadError}</span>
        </div>
      )}

      <canvas ref={canvasRef} className="burger-canvas" aria-label="Interactive 3D Burger Model" />
    </div>
  );
};

export default BurgerCanvas;
