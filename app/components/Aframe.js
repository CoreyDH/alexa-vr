import React from 'react'
import axios from 'axios'

import 'aframe'
import extras from 'aframe-extras'
import { Entity, Scene } from 'aframe-react'

import * as game from '../../helpers/game.js'

extras.loaders.registerAll();
const socket = io();

export default class Aframe extends React.Component {
    componentWillMount() {
        socket.on('attack', data => {
            const attacker = this.state.player,
                  defender = this.state.cpu,
                  move     = this.state.player[data.move],
                  damage   = game.getDamage(attacker, defender, move);

            defender.hp -= damage;
            this.setState({ cpu: defender });

            console.log(`${attacker.name} attacks for ${damage} damage`);
            console.log(`${defender.name} has ${this.state.cpu.hp} HP remaining`);
            //   document.getElementById('alexa').emit(data.move);
        });

        axios.get('/pets').then(res => {
            this.setState({
                player: res.data[1],
                cpu:    res.data[0]
            });
            console.log(`Player: ${this.state.player.name}, CPU: ${this.state.cpu.name}`);
        });
    }

    render() {
        return (
            <Scene>
                <Entity geometry={{primitive: 'plane', width: 100, height: 100}} material="color: #55BB88" position="0 0 -4" rotation="-90 0 0"/>
                <a-sky color="#F0FEFE"></a-sky>
                
                <Entity position="0 0 -5" rotation="5 0 2" scale=".05 .05 .05" object-model="src: url(/assets/obj/pikachu/pikachu.json);" />
            </Scene>
        );
    }
}