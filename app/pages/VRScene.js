import React from 'react'
import axios from 'axios'

import 'aframe'
import { Entity, Scene } from 'aframe-react'
import extras from 'aframe-extras'
import 'aframe-bmfont-text-component'

import Camera from '../components/aframe/Camera'
import Text from '../components/aframe/Text'
import Sky from '../components/aframe/Sky'

import * as game from '../../helpers/game.js'

extras.loaders.registerAll();

// Request fullscreen
function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}
// toggleFullScreen();

window.WebVRConfig = {
    BUFFER_SCALE: 1,
    CARDBOARD_UI_DISABLED: true,
    ROTATE_INSTRUCTIONS_DISABLED: true,
    TOUCH_PANNER_DISABLED: true,
    MOUSE_KEYBOARD_CONTROLS_DISABLED: true,
    FORCE_ENABLE_VR: true
};

// Global constants
const socket     = io(),
      CPU_DELAY  = 3000,
      TEXT_DELAY = 3000;

// Game state vars
let isLocked = true,
    gameOver = true;


// Player animations
const playerAnim = {
    // Tackle move
    move1: function () {
        const player = document.getElementById('player');

        player.emit('tackle');
        player.emit('tackle_end');
        console.log('Player tackle!');
    },

    // Lights Out move
    move2: function () {
        const spotlight = document.getElementById('spot_light');

        spotlight.emit('off');
        setTimeout(() => spotlight.emit('on'), 1500);
        console.log('Lights out!');
    },

     // Sonic Boom move
    move3: function () {
        const boomSmallElem = document.getElementById('boom_small'),
              boomMedElem   = document.getElementById('boom_med'),
              boomLargeElem = document.getElementById('boom_large');
        
        function soundwave () {
            boomSmallElem.emit('show');
            setTimeout(() => boomSmallElem.emit('hide'), 150);

            setTimeout(() => boomMedElem.emit('show'), 75);
            setTimeout(() => boomMedElem.emit('hide'), 225);

            setTimeout(() => boomLargeElem.emit('show'), 150);
            setTimeout(() => boomLargeElem.emit('hide'), 300);
        }
        
        soundwave();
        setTimeout(() => soundwave(), 400);

        console.log('BOOM BABY!');
    },

    // Order Package move
    move4: function () {
        const packageElem = document.getElementById('package');

        packageElem.emit('orderPackage');
        setTimeout(() => packageElem.emit('fadePackage'), 10);
        console.log('Your package is on its way!');
    }
}

// CPU animations
const cpuAnim = {
    // Tackle move
    'Tackle': function () {
        const cpu = document.getElementById('cpu');

        cpu.emit('tackle');
        cpu.emit('tackle_end');
        console.log('CPU tackle!');
    },

    // Quick Attack move
    'Quick Attack': function () {
        const cpu = document.getElementById('cpu');

        cpu.emit('quick_left');
        setTimeout(() => cpu.emit('quick_right'), 85);
        setTimeout(() => cpu.emit('quick_end'), 245);
        console.log('Quick attack!');
    },

    // Thunder move
    'Thunder': function () {
        const bolt = document.getElementById('bolt');

        setTimeout(() => bolt.emit('flash'), 500);
        setTimeout(() => bolt.emit('flash'), 650);
        console.log('Lightning bolt!');
    },

    // Thunder Shock move
    'Thunder Shock': function () {
        const bolt = document.getElementById('bolt');

        setTimeout(() => bolt.emit('flash'), 500);
        setTimeout(() => bolt.emit('flash'), 650);
        console.log('Lightning bolt!');
    }
}

// Other animations
const gameAnim = {
    endText: function (show) {
        const text = document.getElementById('end_text');

        text.emit(show ? 'show' : 'hide');
        console.log('Game ended.');
    },

    flashMove: function (move) {
        const text = document.getElementById(move + '_text');

        setTimeout(() => text.emit('hide'), 100);
        setTimeout(() => text.emit('show'), 300);
        setTimeout(() => text.emit('hide'), 500);
        setTimeout(() => text.emit('show'), 700);
    }
}

export default class VRScene extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            player: {
                name: 'Loading',
                hp: 0,
                hpMax: 1,
                move1: { name: 'Loading' },
                move2: { name: 'Loading' },
                move3: { name: 'Loading' },
                move4: { name: 'Loading' }
            },
            cpu: {
                name: 'Loading',
                hp: 0,
                hpMax: 1
            },
            battleText: ''
        };
    }
    
    componentWillMount() {
        let petName = 'Alexa';
        
        isLocked = false;
        gameOver = false;

        // Get pet name
        const urlArr  = window.location.href.split('/'),
              userNum = urlArr[urlArr.length - 1];

        axios.get(`/account/pet/${userNum}`).then(res => {
            if (res.data && res.data.name) petName = res.data.name;
        })
        // Get pet data and set state
        .then(axios.get('/pets').then(res => {
            res.data[1].name  = petName;
            res.data[1].hpMax = res.data[1].hp;
            res.data[0].hpMax = res.data[0].hp;
            
            this.setState({
                player:     res.data[1],
                cpu:        res.data[0],
                battleText: `A wild ${res.data[0].name} has appeared!`
            });

            console.log(`Player: ${this.state.player.name}, CPU: ${this.state.cpu.name}`);

            setTimeout(() => {
                if (!isLocked) this.setState({ battleText: '' })
            }, TEXT_DELAY);
        }));
           
        // On player attack
        socket.on('attack', data => {
            // Check if currently playing out attack
            if (!isLocked) {
                
                // Player attack phase
                isLocked = true;
                this.setState(game.attack(this.state, true, data.move));
                playerAnim[data.move]();
                gameAnim.flashMove(data.move);

                if (this.state.cpu.hp > 0) {
                    // CPU attack phase
                    setTimeout(() => {
                        this.setState(game.attack(this.state, false));
                        cpuAnim[this.state.lastMove]();

                        if (this.state.player.hp > 0) isLocked = false;
                        else this.endGame(); 

                    }, CPU_DELAY);
                
                } else this.endGame();

                // Clear battle text
                setTimeout(() => {
                    if (!isLocked) this.setState({ battleText: '' })
                }, CPU_DELAY + TEXT_DELAY);
            }
        });
    }

    endGame() {
        isLocked = true;
        gameOver = true;
        gameAnim.endText(true);

        socket.on('restart', () => {
            if (gameOver) {
                gameAnim.endText(false);
                this.componentWillMount();
            }
        });
    }

    render() {
        return (
            <Scene>
                {/* Skybox */}
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
                
                {/* Alexa */}
                <Entity
                    id="player"
                    geometry={
                    {
                        primitive: 'cylinder',
                        radius: 0.2,
                        height: 1.0
                    }}
                    material="color: #222222"
                    position="2.08 0.75 -2.87"
                >
                    {/* Tackle animation */}
                    <a-animation
                        attribute="position"
                        dur="100"
                        fill="forward"
                        to="1.55 0.75 -3"
                        easing="linear"
                        begin="tackle"
                    />
                    <a-animation
                        attribute="position"
                        delay="101"
                        dur="100"
                        fill="forward"
                        to="2.08 0.75 -2.87"
                        easing="linear"
                        begin="tackle_end"
                    />
                </Entity>
                <Text
                    id="player_name"
                    text={`${this.state.player.name}: ${this.state.player.hp} / ${this.state.player.hpMax}`}
                    color="#DADADA"
                    position="1.20 0.06 -2.51"
                />
                <Entity
                    id="player_hpBar"
                    geometry={
                    {
                        primitive: 'box',
                        width: game.hpWidth(this.state, true),
                        height: 0.05,
                        depth: 0.01
                    }}
                    material={`color: ${game.hpColor(this.state, true)}; shader: flat`}
                    position={`${0.93 + (game.hpWidth(this.state, true) / 2)} 0.04 -2.3`}
                    visible={game.hpWidth(this.state, true) > 0}
                />
                <Entity
                    id="player_hpBar_box"
                    geometry={
                    {
                        primitive: 'box',
                        width: 1.68,
                        height: 0.1,
                        depth: 0.01
                    }}
                    material="color: #AAFFFF; shader: flat"
                    position="1.73 0.04 -2.31"
                />


                {/* Pikachu */}
                <Entity
                    id="cpu"
                    position="-6.23 0.00 -7.80"
                    rotation="5.16 66.5 1.72"
                    scale=".05 .05 .05"
                    object-model="src: url(/assets/obj/pikachu/pikachu.json)"
                >
                    {/* Tackle animation */}
                    <a-animation
                        attribute="position"
                        dur="100"
                        fill="forward"
                        to="-5.71 0.00 -7.54"
                        easing="linear"
                        begin="tackle"
                    />
                    <a-animation
                        attribute="position"
                        delay="101"
                        dur="100"
                        fill="forward"
                        to="-6.23 0.00 -7.80"
                        easing="linear"
                        begin="tackle_end"
                    />

                    {/* Quick Attack animation */}
                    <a-animation
                        attribute="rotation"
                        dur="60"
                        fill="forward"
                        to="5.16 86.5 1.72"
                        easing="ease-cubic"
                        begin="quick_left"
                    />
                    <a-animation
                        attribute="rotation"
                        dur="120"
                        fill="forwards"
                        to="5.16 46.5 1.72"
                        easing="ease-cubic"
                        begin="quick_right"
                    />
                    <a-animation
                        attribute="rotation"
                        dur="150"
                        fill="forward"
                        to="5.16 66.5 1.72"
                        easing="ease-cubic"
                        begin="quick_end"
                    />
                </Entity>
                <Text
                    id="cpu_name"
                    text={`${this.state.cpu.name}`}
                    color="#DADADA"
                    position="-2.31 0.84 -2.51"
                    scale="1.00 1.00 1.00"
                />
                <Entity
                    id="cpu_hpBar"
                    geometry={
                    {
                        primitive: 'box',
                        width: game.hpWidth(this.state, false),
                        height: 0.05,
                        depth: 0.01
                    }}
                    material={`color: ${game.hpColor(this.state, false)}; shader: flat`}
                    position={`${-2.64 + (game.hpWidth(this.state, false) / 2)} 0.77 -2.3`}
                    visible={game.hpWidth(this.state, false) > 0}
                />
                <Entity
                    id="cpu_hpBar_box"
                    geometry={
                    {
                        primitive: 'box',
                        width: 1.68,
                        height: 0.1,
                        depth: 0.01
                    }}
                    material="color: #AAFFFF; shader: flat"
                    position="-1.84 0.77 -2.31"
                />


                {/* Battle Text */}
                <Text
                    id="battle_text"
                    text={this.state.battleText}
                    color="#DADADA"
                    position="-2.96 0.12 -2.51"
                    scale="1.00 1.00 1.00"
                />


                {/* Lights */}
                <Entity
                    id="ambient_light"
                    primitive="a-light"
                    light="type: ambient; color: #BBB; intensity: 0.4"
                />
                <Entity
                    id="spot_light"
                    primitive="a-light"
                    light="type: spot; intensity: 1.1; penumbra: 0.8"
                    position="9 16.5 2"
                    rotation="-79 49 0"
                >
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="false"
                        begin="off"
                    />
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="true"
                        begin="on"
                    />
                </Entity>


                {/* Objects for Alexa move animations */}
                {/* Sonic Boom */}
                <Entity
                    id="boom_small"
                    geometry={
                    {
                        primitive: 'ring',
                        radiusInner: 0.24,
                        radiusOuter: 0.36
                    }}
                    material="color: #AAFFFF; shader: flat"
                    position="1.7 1.15 -3.13"
                    rotation="0 59 0"
                    visible="false"
                >
                    <a-animation
                        attribute="visible"
                        dur="150"
                        fill="forward"
                        to="true"
                        easing="ease-quad"
                        begin="show"
                    />
                    <a-animation
                        attribute="visible"
                        dur="150"
                        fill="false"
                        to="false"
                        easing="ease-quad"
                        begin="hide"
                    />
                </Entity>
                <Entity
                    id="boom_med"
                    geometry={
                    {
                        primitive: 'ring',
                        radiusInner: 0.4,
                        radiusOuter: 0.52
                    }}
                    material="color: #AAFFFF; shader: flat"
                    position="1.53 1.15 -3.22"
                    rotation="0 59 0"
                    visible="false"
                >
                    <a-animation
                        attribute="visible"
                        dur="150"
                        fill="forward"
                        to="true"
                        easing="ease-quad"
                        begin="show"
                    />
                    <a-animation
                        attribute="visible"
                        dur="150"
                        fill="false"
                        to="false"
                        easing="ease-quad"
                        begin="hide"
                    />
                </Entity>
                <Entity
                    id="boom_large"
                    geometry={
                    {
                        primitive: 'ring',
                        radiusInner: 0.56,
                        radiusOuter: 0.68
                    }}
                    material="color: #AAFFFF; shader: flat"
                    position="1.32 1.15 -3.35"
                    rotation="0 59 0"
                    visible="false"
                >
                    <a-animation
                        attribute="visible"
                        dur="150"
                        fill="forward"
                        to="true"
                        easing="ease-quad"
                        begin="show"
                    />
                    <a-animation
                        attribute="visible"
                        dur="150"
                        fill="false"
                        to="false"
                        easing="ease-quad"
                        begin="hide"
                    />
                </Entity>

                {/* Order Package */}
                <Entity
                    id="package"
                    geometry={
                    {
                        primitive: 'box',
                        width: 1.5,
                        height: 1.2,
                        depth: 1
                    }}
                    material="color: brown"
                    position="-6 -2 -7.87"
                >
                    <a-animation
                        attribute="position"
                        dur="1500"
                        fill="forwards"
                        from="-6 11 -7.87"
                        to="-6 1.8 -7.87"
                        easing="ease-in-quint"
                        begin="orderPackage"
                    />
                    <a-animation
                        attribute="material.opacity"
                        delay="1500"
                        dur="1000"
                        fill="both"
                        from="1"
                        to="0"
                        begin="fadePackage"
                    />
                </Entity>


                {/* Objects for Pikachu move animations */}
                {/* Thunder/Shock */}
                <Entity
                    id="bolt"
                    obj-model="obj: url(/assets/obj/bolt/bolt.obj); mtl: url(/assets/obj/bolt/bolt.obj.mtl)"
                    position="2.24 1.78 -3.53"
                    rotation="87.1 0 0"
                    scale="0.06 0.06 0.06"
                    visible="false"
                >
                    <a-animation
                        attribute="visible"
                        dur="80"
                        fill="none"
                        to="true"
                        begin="flash"
                    />
                </Entity>


                {/* Moves */}
                 <Text
                    id="move_ins"
                    text="Say: 'use <move>'"
                    color="#DADADA"
                    position="1.15 3.30 -2.51"
                    scale="0.75 0.75 0.75"
                />
                <Entity
                    id="move_bar"
                    geometry={
                    {
                        primitive: 'box',
                        width: 2.80,
                        height: 0.56,
                        depth: 0.01
                    }}
                    material={`color: #b9d3e6; shader: flat`}
                    position="1.84 3.00 -2.64"
                />
                <Text
                    id="move1_text"
                    text={this.state.player.move1.name}
                    color="#DADADA"
                    position="0.69 3.00 -2.51"
                    scale="1.00 1.00 1.00"
                >
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="true"
                        easing="ease-quad"
                        begin="show"
                    />
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="false"
                        easing="ease-quad"
                        begin="hide"
                    />
                </Text>
                <Text
                    id="move2_text"
                    text={this.state.player.move2.name}
                    color="#DADADA"
                    position="1.92 3.00 -2.51"
                    scale="1.00 1.00 1.00"
                >
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="true"
                        easing="ease-quad"
                        begin="show"
                    />
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="false"
                        easing="ease-quad"
                        begin="hide"
                    />
                </Text>
                <Text
                    id="move3_text"
                    text={this.state.player.move3.name}
                    color="#DADADA"
                    position="0.51 2.77 -2.51"
                    scale="1.00 1.00 1.00"
                >
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="true"
                        easing="ease-quad"
                        begin="show"
                    />
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="false"
                        easing="ease-quad"
                        begin="hide"
                    />
                </Text>
                <Text
                    id="move4_text"
                    text={this.state.player.move4.name}
                    color="#DADADA"
                    position="1.77 2.77 -2.51"
                    scale="1.00 1.00 1.00"
                >
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="true"
                        easing="ease-quad"
                        begin="show"
                    />
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="forward"
                        to="false"
                        easing="ease-quad"
                        begin="hide"
                    />
                </Text>

                {/* End game text */}
                <Text
                    id="end_text"
                    text={
                        `${this.state.cpu.hp === 0 ? 'You win!' : 'Sorry, you lose.'}
                        Say 'restart' to play again.`
                    }
                    color="red"
                    position="-1.22 1.89 -2.51"
                    scale="1.00 1.00 1.00"
                    visible="false"
                >
                    <a-animation
                        attribute="visible"
                        delay="1000"
                        dur="1"
                        fill="forward"
                        to="true"
                        easing="ease-quad"
                        begin="show"
                    />
                    <a-animation
                        attribute="visible"
                        dur="1"
                        fill="false"
                        to="false"
                        easing="ease-quad"
                        begin="hide"
                    />
                </Text>

            </Scene>
        );
    }
}