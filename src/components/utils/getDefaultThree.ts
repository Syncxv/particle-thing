import * as THREE from 'three';

interface Props {
    container?: Element;
    onResize?: () => void;
}

export function getDefaultThreeStuff({ container = document.body, onResize }: Props) {
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.01, 100);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
    });

    function onWindowResize() {
        onResize?.();
        camera.aspect = container.getBoundingClientRect().width / container.getBoundingClientRect().height;
        camera.updateProjectionMatrix();

        renderer.setSize(container.getBoundingClientRect().width, container.getBoundingClientRect().height);
    }
}
