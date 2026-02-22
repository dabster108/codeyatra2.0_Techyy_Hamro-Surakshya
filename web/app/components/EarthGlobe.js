"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function EarthGlobe() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(5, 2, 5);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.3);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    // Textures
    const loader = new THREE.TextureLoader();
    const earthTex = loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg"
    );
    const bumpTex = loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg"
    );
    const specTex = loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg"
    );
    const cloudsTex = loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png"
    );

    // Earth
    const earthGeo = new THREE.SphereGeometry(2, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTex,
      bumpMap: bumpTex,
      bumpScale: 0.04,
      specularMap: specTex,
      specular: new THREE.Color(0x2244aa),
      shininess: 20,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(2.12, 64, 64);
    const atmMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x0077ff),
      transparent: true,
      opacity: 0.06,
      side: THREE.FrontSide,
    });
    const atmosphere = new THREE.Mesh(atmGeo, atmMat);
    scene.add(atmosphere);

    // Outer glow ring
    const glowGeo = new THREE.SphereGeometry(2.25, 64, 64);
    const glowMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x00aa44),
      transparent: true,
      opacity: 0.025,
      side: THREE.FrontSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // Clouds
    const cloudGeo = new THREE.SphereGeometry(2.06, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.75,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);

    // Disaster markers — Nepal region + surrounding high-risk zones
    const markerData = [
      { lat: 28.0, lon: 84.0, color: 0xff3333, scale: 1.0 }, // Nepal - flood
      { lat: 27.7, lon: 85.3, color: 0xff6600, scale: 0.8 }, // Kathmandu - landslide
      { lat: 26.8, lon: 88.0, color: 0xff3333, scale: 0.7 }, // East Nepal
      { lat: 29.5, lon: 81.0, color: 0xffaa00, scale: 0.6 }, // Far-west Nepal
      { lat: 28.3, lon: 83.9, color: 0xff6600, scale: 0.5 }, // Pokhara region
      { lat: 20.5, lon: 85.0, color: 0xffcc00, scale: 0.5 }, // India - cyclone
      { lat: 34.0, lon: 73.0, color: 0xff4444, scale: 0.6 }, // Pakistan flood
    ];

    const markerGroup = new THREE.Group();
    markerData.forEach(({ lat, lon, color, scale }) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const r = 2.08;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      const geo = new THREE.SphereGeometry(0.045 * scale, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color });
      const marker = new THREE.Mesh(geo, mat);
      marker.position.set(x, y, z);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.06 * scale, 0.09 * scale, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 0);
      markerGroup.add(ring);
      markerGroup.add(marker);
    });
    scene.add(markerGroup);

    camera.position.z = 5;

    // Drag rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotVelocity = { x: 0, y: 0.002 };
    let manualRot = { x: 0, y: 0 };

    const onDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      rotVelocity = { x: 0, y: 0 };
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      rotVelocity.y = dx * 0.003;
      rotVelocity.x = dy * 0.003;
      manualRot.y += dx * 0.003;
      manualRot.x += dy * 0.003;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    // Touch support
    const onTouchStart = (e) => {
      isDragging = true;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      rotVelocity.y = dx * 0.003;
      rotVelocity.x = dy * 0.003;
      manualRot.y += dx * 0.003;
      manualRot.x += dy * 0.003;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animate
    let animId;
    let t = 0;
    function animate() {
      animId = requestAnimationFrame(animate);
      t += 0.01;

      if (!isDragging) {
        rotVelocity.y += (0.002 - rotVelocity.y) * 0.02;
        rotVelocity.x *= 0.96;
        manualRot.y += rotVelocity.y;
        manualRot.x += rotVelocity.x;
      }

      earth.rotation.y = manualRot.y;
      earth.rotation.x = manualRot.x;
      clouds.rotation.y = manualRot.y + t * 0.0003;
      clouds.rotation.x = manualRot.x;
      atmosphere.rotation.y = manualRot.y;
      markerGroup.rotation.y = manualRot.y;
      markerGroup.rotation.x = manualRot.x;

      // Pulse rings
      markerGroup.children.forEach((child, i) => {
        if (child.type === "Mesh" && child.geometry.type === "RingGeometry") {
          child.material.opacity = 0.3 + 0.3 * Math.sin(t * 3 + i);
          const s = 1 + 0.2 * Math.sin(t * 3 + i);
          child.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ background: "transparent" }}
    />
  );
}
