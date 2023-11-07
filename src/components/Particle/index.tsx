import { Component, onCleanup, onMount } from 'solid-js';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment.frag';
import System, {
    SpriteRenderer,
    Emitter,
    Rate,
    Span,
    Position,
    Mass,
    Radius,
    Life,
    Velocity,
    PointZone,
    Vector3D,
    Alpha,
    Scale,
    Color,
    RadialVelocity,
    Body,
} from 'three-nebula';

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
let tha = 0;
export const ParticleThing: Component<Props> = (props) => {
    onMount(() => {
        init();

        const curve = new THREE.CatmullRomCurve3(
            [
                new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(1, -1, 0), // cool
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(-1, 1, 0),
            ],
            true,
            'centripetal'
        );

        const points = curve.getPoints(1000);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
        });
        const curveObject = new THREE.Line(geometry, lineMaterial);
        scene.add(curveObject);

        // thank you for your service circle :salute:
        const circleGeometry = new THREE.CircleGeometry(0.05, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);

        // circle.position.copy(points[0]);

        // scene.add(circle);

        const system = new System();
        const emitter = new Emitter();
        const spriteRenderer = new SpriteRenderer(scene, THREE);

        // Set emitter rate (particles per second) as well as the particle initializers and behaviours
        emitter
            // .setRate(new Rate(new Span(4, 16), new Span(0.01)))
            .setRate(new Rate(20, 0.01))
            .setInitializers([
                new Position(new PointZone(0, 0)),
                new Mass(1),
                new Radius(12, 24),
                new RadialVelocity(1, new Vector3D(0, 0.1, 0), 180),
                new Life(3), // hi
                new Body(circle),
            ])
            .setBehaviours([
                new Alpha(1, 0), // bruuuh
                new Scale(0.1, 0.1),
                new Color(new THREE.Color(0xf00fff), new THREE.Color(0xffffff)),
            ])
            .setPosition({ x: 0, y: 0 })

            .emit();

        // add the emitter and a renderer to your particle system
        system
            .addEmitter(emitter)
            .addRenderer(spriteRenderer)
            .emit({
                onStart: () => {},
                onUpdate: () => {},
                onEnd: () => {},
            });

        function animate(idk?: number) {
            const elapsedTime = clock.getElapsedTime();
            const t = ((elapsedTime * 0.3) % 2) / 2;

            const positionOnCurve = curve.getPointAt(t);
            // circle.position.copy(positionOnCurve);
            emitter.position.copy(positionOnCurve as any);

            system.update();
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
