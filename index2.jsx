import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const LandingPage = () => {
    const mountRef = useRef(null);
    const cursorRef = useRef(null);

    // Three.js scene setup
    useEffect(() => {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a);

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // 3D Object: Rotating Torus Knot
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x0ea5e9,
            emissiveIntensity: 0.5,
        });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x38bdf8, 1, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Animation loop
        let frameId;
        const animate = () => {
            torusKnot.rotation.x += 0.01;
            torusKnot.rotation.y += 0.013;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate();

        // Mouse tracking for camera movement
        const onMouseMove = (e) => {
            const x = (e.clientX / width) * 2 - 1;
            const y = -(e.clientY / height) * 2 + 1;
            camera.position.x = x * 2;
            camera.position.y = y * 2;
            camera.lookAt(scene.position);
        };
        mountRef.current.addEventListener("mousemove", onMouseMove);

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            mountRef.current.removeChild(renderer.domElement);
            mountRef.current.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    // Mouse tracking for custom cursor
    useEffect(() => {
        const onMouseMove = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
            }
        };
        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200 overflow-hidden">
            {/* 3D Canvas */}
            <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

            {/* Animated Custom Cursor */}
            <div
                ref={cursorRef}
                className="pointer-events-none fixed z-50 w-10 h-10 rounded-full border-2 border-sky-500 bg-sky-200/40 transition-transform duration-75 shadow-lg"
                style={{ mixBlendMode: "multiply" }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 drop-shadow-lg animate-fade-in-down">
                    Welcome to <span className="text-sky-500">3D Landing</span>
                </h1>
                <p className="mt-6 text-lg md:text-2xl text-slate-600 animate-fade-in-up">
                    Explore interactive 3D graphics, smooth UI, and custom mouse effects.
                </p>
                <button className="mt-10 px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-bold text-lg shadow-lg transition-all duration-300 animate-bounce">
                    Get Started
                </button>
            </div>

            {/* Tailwind Animations */}
            <style jsx>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-40px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 1s cubic-bezier(0.4, 0, 0.2, 1) both;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;