class ThreeDAnimation {
    constructor() {
        this.canvas = document.getElementById('three-d-canvas');
        if (!this.canvas) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        this.particles = [];
        
        this.init();
        this.animate();
        this.setupWindowResize();
    }

    init() {
        
        this.scene = new THREE.Scene();
        this.scene.background = null;
        this.scene.fog = new THREE.Fog(0x0a0e27, 100, 1000);

        this.camera = new THREE.PerspectiveCamera(
            45,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setClearColor(0x000000, 0);
        const initialWidth = this.canvas.clientWidth || this.canvas.parentElement?.clientWidth || 600;
        const initialHeight = this.canvas.clientHeight || 300;
        this.renderer.setSize(initialWidth, initialHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        this.setupLighting();

        this.createGeometries();
        this.createParticles();
    }

    setupLighting() {
      
        const ambientLight = new THREE.AmbientLight(0x00ff41, 0.3);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00ff41, 1);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00d9ff, 0.8);
        pointLight2.position.set(-5, -5, 3);
        this.scene.add(pointLight2);
    }

    createFallbackGeometries() {
    
        const geometry1 = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material1 = new THREE.MeshStandardMaterial({
            color: 0x00ff41,
            emissive: 0x00ff41,
            emissiveIntensity: 0.5,
            metalness: 0.7,
            roughness: 0.2
        });
        const cube1 = new THREE.Mesh(geometry1, material1);
        cube1.position.x = -2;
        cube1.position.y = 0;
        cube1.castShadow = true;
        this.scene.add(cube1);
        this.objects.push({
            mesh: cube1,
            rotationSpeed: { x: 0.01, y: 0.015, z: 0.008 },
            floatSpeed: 0.002,
            floatAmount: 0.2,
            initialY: cube1.position.y
        });

        const geometry2 = new THREE.BoxGeometry(1, 1, 1);
        const material2 = new THREE.MeshStandardMaterial({
            color: 0x00d9ff,
            emissive: 0x00d9ff,
            emissiveIntensity: 0.4,
            metalness: 0.6,
            roughness: 0.3
        });
        const cube2 = new THREE.Mesh(geometry2, material2);
        cube2.position.x = 2;
        cube2.position.y = 0;
        cube2.castShadow = true;
        this.scene.add(cube2);
        this.objects.push({
            mesh: cube2,
            rotationSpeed: { x: -0.012, y: 0.01, z: 0.012 },
            floatSpeed: 0.0025,
            floatAmount: 0.3,
            initialY: cube2.position.y
        });

        const geometry3 = new THREE.OctahedronGeometry(1.2);
        const material3 = new THREE.MeshStandardMaterial({
            color: 0x00ff41,
            emissive: 0x00ff41,
            emissiveIntensity: 0.3,
            wireframe: false,
            metalness: 0.8,
            roughness: 0.1
        });
        const octahedron = new THREE.Mesh(geometry3, material3);
        octahedron.position.x = 0;
        octahedron.position.y = 1.5;
        octahedron.castShadow = true;
        this.scene.add(octahedron);
        this.objects.push({
            mesh: octahedron,
            rotationSpeed: { x: 0.008, y: -0.015, z: 0.01 },
            floatSpeed: 0.0015,
            floatAmount: 0.25,
            initialY: octahedron.position.y
        });
    }

    loadModelAsset(modelPath, config) {
        if (!THREE.GLTFLoader) {
            console.warn('GLTFLoader not available. Using fallback objects.');
            this.createFallbackGeometries();
            return;
        }

        const loader = new THREE.GLTFLoader();

        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        if (child.material) {
                            const material = child.material;
                            if (material.color) {
                                material.color.offsetHSL(0.02, 0.08, 0.06);
                            }
                            material.emissive = material.emissive || new THREE.Color(0x00d9ff);
                            material.emissiveIntensity = 0.85;
                            material.needsUpdate = true;
                            child.material = material;
                        }
                    }
                });

                model.position.set(config.x, config.y, config.z);
                model.rotation.set(
                    config.rotationX || 0,
                    config.rotationY || 0,
                    config.rotationZ || 0
                );
                model.scale.setScalar((config.scale || 1) * 3.4);

                this.scene.add(model);
                this.objects.push({
                    mesh: model,
                    rotationSpeed: config.rotationSpeed,
                    floatSpeed: config.floatSpeed,
                    floatAmount: config.floatAmount,
                    initialY: model.position.y
                });
            },
            undefined,
            (error) => {
                console.error(`Erro ao carregar o modelo ${modelPath}:`, error);
                this.createFallbackGeometries();
            }
        );
    }

    createGeometries() {
        if (!THREE.GLTFLoader) {
            this.createFallbackGeometries();
            return;
        }

        this.loadModelAsset('models/model-1.glb', {
            x: -2.2,
            y: 0,
            z: 0,
            scale: 1.2,
            rotationX: 0.4,
            rotationY: 0.8,
            rotationZ: 0.2,
            rotationSpeed: { x: 0.01, y: 0.015, z: 0.008 },
            floatSpeed: 0.002,
            floatAmount: 0.2
        });

        this.loadModelAsset('models/model-2.glb', {
            x: 2.2,
            y: 0,
            z: 0,
            scale: 1.1,
            rotationX: -0.6,
            rotationY: -0.9,
            rotationZ: 0.4,
            rotationSpeed: { x: -0.012, y: 0.01, z: 0.012 },
            floatSpeed: 0.0025,
            floatAmount: 0.3
        });
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00d9ff,
            size: 0.1,
            opacity: 0.6,
            transparent: true
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.particles = {
            mesh: particles,
            geometry: particleGeometry,
            positions: positions
        };
    }

    animate = () => {
        requestAnimationFrame(this.animate);

       
        this.objects.forEach((obj, index) => {
            obj.mesh.rotation.x += obj.rotationSpeed.x;
            obj.mesh.rotation.y += obj.rotationSpeed.y;
            obj.mesh.rotation.z += obj.rotationSpeed.z;

         
            obj.mesh.position.y = obj.initialY + Math.sin(Date.now() * obj.floatSpeed) * obj.floatAmount;
        });


        if (this.particles.mesh) {
            this.particles.mesh.rotation.x += 0.0001;
            this.particles.mesh.rotation.y += 0.0002;
        }

        this.renderer.render(this.scene, this.camera);
    }

    setupWindowResize() {
        window.addEventListener('resize', () => {
            const width = this.canvas.clientWidth || this.canvas.parentElement?.clientWidth || 600;
            const height = this.canvas.clientHeight || 300;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ThreeDAnimation();
});
