import { Component, onCleanup, onMount } from 'solid-js';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment.frag';

let container: HTMLDivElement;

export const clock = new THREE.Clock();
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.01, 100);

export const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true,
});

function onWindowResize() {
    camera.aspect = container.getBoundingClientRect().width / container.getBoundingClientRect().height;
    camera.updateProjectionMatrix();

    renderer.setSize(container.getBoundingClientRect().width, container.getBoundingClientRect().height);
}

let animateId: number;
function init() {
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    camera.position.setZ(10);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.domElement.id = 'particle-gang';
    container.appendChild(renderer.domElement);

    if (import.meta.env.DEV) {
        import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
            new OrbitControls(camera, renderer.domElement);
        });
        const helper = new THREE.AxesHelper(5);
        scene.add(helper);
    }

    clock.start();
}

function destroy() {
    clock.stop();
    cancelAnimationFrame(animateId);

    window.removeEventListener('resize', onWindowResize, false);
}

interface Props {}
export const ParticleThing: Component<Props> = (props) => {
    onMount(() => {
        init();
        const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
        const cubeMat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
        });

        const cubeObj = new THREE.Mesh(cubeGeo, cubeMat);

        scene.add(cubeObj);

        function animate(idk?: number) {
            renderer.render(scene, camera);
            animateId = requestAnimationFrame(animate);
        }
        animate();
    });

    onCleanup(() => {
        destroy();
    });
    return (
        <div
            ref={container}
            style={{ 'pointer-events': 'all', width: '100vw', height: '100vh', transform: 'translate(-50%, -50%)' }}
            class="canvas-container absolute top-1/2 left-1/2  pointer-events-none h-[50vh] z-50 lg:block flex flex-col items-center justify-cente mix-blend-exclusion"
        ></div>
    );
};
