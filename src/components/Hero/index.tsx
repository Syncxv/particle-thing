import { Component } from 'solid-js';
import { ParticleThing } from '../Particle/index';

export const Hero: Component<{}> = (props) => {
    return (
        <div class="hero h-screen w-screen">
            <ParticleThing />
        </div>
    );
};
