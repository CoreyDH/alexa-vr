import React from 'react'
import axios from 'axios'

import 'aframe'
import { Entity, Scene } from 'aframe-react'
import extras from 'aframe-extras'
import 'aframe-bmfont-text-component'

import Camera from './aframe/Camera'
import Text from './aframe/Text'
import Sky from './aframe/Sky'

import * as game from '../../helpers/game.js'

extras.loaders.registerAll();
const socket = io();

export default class Aframe extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            player: {
                name: 'Loading',
                hp: 0
            },
            playerMaxHP: 0,
            cpu: {
                name: 'Loading',
                hp: 0
            },
            cpuMaxHP: 0
        };
    }
    
    componentWillMount() {
        // Get pet data and set state
        axios.get('/pets').then(res => {
            this.setState({
                player:      res.data[1],
                playerMaxHP: res.data[1].hp,
                cpu:         res.data[0],
                cpuMaxHP:    res.data[0].hp
            });
            console.log(`Player: ${this.state.player.name}, CPU: ${this.state.cpu.name}`);
        });

        // On player attack
        socket.on('attack', data => {
            this.setState(game.playerAttack(this.state, data.move));
            setTimeout(() => this.setState(game.cpuAttack(this.state, data.move)), 2000);
            document.getElementById('player').emit(data.move);
        });

    }

    render() {
        return (
            <Scene>
                <a-sky
                    id="sky"
                    color="#F0FEFE"
                />
                <Entity
                    id="ground"
                    geometry={{primitive: 'plane', width: 100, height: 100}}
                    material="color: #55BB88"
                    position="0 0 -4"
                    rotation="-90 0 0"
                />
                
                <a-cylinder
                    id="player"
                    position="2.08 0.75 -2.87"
                    radius="0.2"
                    height="1.0"
                    color="#222222"
                >
                    <a-animation
                        attribute="rotation"
                        dur="5000"
                        fill="forwards"
                        to="180 360 0"
                        begin="dance"
                    ></a-animation>
                </a-cylinder>
                <Text
                    id="player_name"
                    text={`${this.state.player.name}: ${this.state.player.hp} / ${this.state.playerMaxHP}`}
                    color="#DADADA"
                    position="1.70 0.06 -2.51"
                />

                <Entity
                    id="cpu"
                    position="-6.23 0.00 -7.80"
                    rotation="5.16 71.05 1.72"
                    scale=".05 .05 .05"
                    object-model="src: url(/assets/obj/pikachu/pikachu.json);"
                />
                <Text
                    id="cpu_name"
                    text={`${this.state.cpu.name}: ${this.state.cpu.hp} / ${this.state.cpuMaxHP}`}
                    color="#DADADA"
                    position="-4.81 0.04 -5.53"
                    scale="2.00 2.00 2.00"
                />
                

            </Scene>
        );
    }
}