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

        setTimeout(() => {
            text.emit(show ? 'show' : 'hide');
            document.getElementById('move1_text').emit(!show ? 'show' : 'hide');
            document.getElementById('move2_text').emit(!show ? 'show' : 'hide');
            document.getElementById('move3_text').emit(!show ? 'show' : 'hide');
            document.getElementById('move4_text').emit(!show ? 'show' : 'hide');

            document.getElementById('cpu').emit(show ? 'die' : 'respawn');
        }, 800);
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
                {/* Background */}
                <Sky
                    id="sky"
                    src="/assets/img/milky-way.jpg"
                />
                <Entity
                    id="ground"
                    geometry={{primitive: 'plane', width: 100, height: 100}}
                    material={{ src: '/assets/img/dirt.jpg' }}
                    position="0 0 -4"
                    rotation="-90 0 0"
                />
                <Entity
                    id="outer_ring"
                    geometry={
                    {
                        primitive: 'ring',
                        radiusInner: 5.5,
                        radiusOuter: 6
                    }}
                    material="color: white"
                    position="0 0.01 -3.68"
                    rotation="-90 0 0"
                />
                <Entity
                    id="mid_ring"
                    geometry={
                    {
                        primitive: 'ring',
                        radiusInner: 3,
                        radiusOuter: 5.5
                    }}
                    material="color: #C10000"
                    position="0 0.01 -3.68"
                    rotation="-90 0 0"
                />
                <Entity
                    id="inner_ring"
                    geometry={
                    {
                        primitive: 'ring',
                        radiusInner: 2.5,
                        radiusOuter: 3
                    }}
                    material="color: white"
                    position="0 0.01 -3.68"
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
                    position="1.12 0.75 -3.21"
                >
                    {/* Tackle animation */}
                    <a-animation
                        attribute="position"
                        dur="300"
                        fill="forward"
                        to="-0.86 0.75 -4.14"
                        easing="ease-in-cubic"
                        begin="tackle"
                    />
                    <a-animation
                        attribute="position"
                        delay="350"
                        dur="200"
                        fill="forward"
                        to="1.12 0.75 -3.21"
                        easing="linear"
                        begin="tackle_end"
                    />
                </Entity>
                <Text
                    id="player_name"
                    text={`${this.state.player.name}: ${this.state.player.hp} / ${this.state.player.hpMax}`}
                    color="black"
                    position="0.29 0.25 -2.51"
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
                    position={`${0.06 + (game.hpWidth(this.state, true) / 2)} 0.24 -2.3`}
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
                    position="0.86 0.24 -2.31"
                />


                {/* Pikachu */}
                <Entity
                    id="cpu"
                    position="-1.78 0.00 -4.72"
                    rotation="5.16 66.5 1.72"
                    scale=".04 .04 .04"
                    object-model="src: url(/assets/obj/pikachu/pikachu.json)"
                >
                    {/* Tackle animation */}
                    <a-animation
                        attribute="position"
                        dur="300"
                        fill="forward"
                        to="0.12 0.00 -4.08"
                        easing="ease-in-cubic"
                        begin="tackle"
                    />
                    <a-animation
                        attribute="position"
                        delay="350"
                        dur="200"
                        fill="forward"
                        to="-1.78 0.00 -4.72"
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

                    {/* Dead animation */}
                    <a-animation
                        attribute="rotation"
                        dur="400"
                        fill="forward"
                        to="-64.1 41.83 63.60"
                        easing="ease-cubic"
                        begin="die"
                    />
                    <a-animation
                        attribute="rotation"
                        dur="1"
                        fill="forwards"
                        to="5.16 66.5 1.72"
                        begin="respawn"
                    />
                </Entity>
                <Text
                    id="cpu_name"
                    text={`${this.state.cpu.name}`}
                    color="black"
                    position="-1.50 0.49 -2.51"
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
                    position={`${-1.87 + (game.hpWidth(this.state, false) / 2)} 0.47 -2.3`}
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
                    position="-1.07 0.47 -2.31"
                />


                {/* Battle Text */}
                <Text
                    id="battle_text"
                    text={this.state.battleText}
                    color="black"
                    position="-1.33 0.58 -1.47"
                    scale="0.60 0.60 0.60"
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
                    position="2.54 12.11 -0.57"
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
                    position="0.82 1.15 -3.44"
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
                    position="0.67 1.15 -3.57"
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
                    position="0.44 1.15 -3.75"
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
                    position="-1.55 -2 -4.62"
                >
                    <a-animation
                        attribute="position"
                        dur="1500"
                        fill="forwards"
                        from="-1.55 11 -4.62"
                        to="-1.55 1.5 -4.62"
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
                    position="1.34 2.06 -4.01"
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
                    position="-0.55 2.67 -2.51"
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
                    material={`color: #3C5659; shader: flat`}
                    position="0.00 2.36 -2.64"
                />
                <Text
                    id="move1_text"
                    text={this.state.player.move1.name}
                    color="#DADADA"
                    position="-1.06 2.39 -2.51"
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
                    position="0.16 2.39 -2.51"
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
                    position="-1.22 2.15 -2.51"
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
                    position="0.01 2.15 -2.51"
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
                    position="-1.31 2.18 -2.51"
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