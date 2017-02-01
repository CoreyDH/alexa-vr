import React from 'react';

import * as UserActions from '../actions/UserActions';
import UserStore from "../stores/UserStore";

import 'aframe'
import extras from 'aframe-extras'
import {Entity, Scene} from 'aframe-react'

extras.loaders.registerAll();

const socket = io();

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
  document.getElementById('cyl').emit('dance');
});

export default class Aframe extends React.Component {

    constructor() {
        super()
    }

    render() {

        console.log(this.props);

        return (
            <Scene>
                <a-assets>
                    <a-asset-item id="bear-obj" src="/assets/obj/bear-obj.obj"></a-asset-item>
                    <a-asset-item id="bear-mtl" src="/assets/obj/bear-obj.mtl"></a-asset-item>

                    <a-asset-item id="boar-obj" src="/assets/obj/boar-obj.obj"></a-asset-item>
                    <a-asset-item id="boar-mtl" src="/assets/obj/boar-obj.mtl"></a-asset-item>

                    <a-asset-item id="wolf-obj" src="/assets/obj/wolf-obj.obj"></a-asset-item>
                    <a-asset-item id="wolf-mtl" src="/assets/obj/wolf-obj.mtl"></a-asset-item>
                </a-assets>
                
                <Entity geometry={{primitive: 'plane', width: 100, height: 100}} material="color: #55BB88" position="0 0 -4" rotation="-90 0 0"/>
                <a-sky color="#F0FEFE"></a-sky>
                
                <Entity obj-model="obj: #bear-obj; mtl: #bear-mtl" position="0 0 -5"    rotation="0 0 0"  scale=".1 .1 .1" />
                <Entity obj-model="obj: #boar-obj; mtl: #boar-mtl" position="3 0.5 -4"  rotation="0 0 0"  scale=".1 .1 .1" />
                <Entity obj-model="obj: #wolf-obj; mtl: #wolf-mtl" position="-2 0.5 -3" rotation="0 0 0"  scale=".1 .1 .1" />
                <Entity position="-2 0 -5" scale=".05 .05 .05" object-model="src: url(/assets/obj/pikachu/pikachu.json);" />
            </Scene>
        );
    }
}