'use strict';

import 'aframe';
import {Entity, Scene} from 'aframe-react';
import React    from 'react'
import ReactDOM from 'react-dom'

// Render Main Component
ReactDOM.render(
  <div className='main-container'>
    <Scene>
      <a-assets>
        <a-asset-item id="bear-obj" src="/assets/obj/bear-obj.obj"></a-asset-item>
        <a-asset-item id="bear-mtl" src="/assets/obj/bear-obj.mtl"></a-asset-item>

        <a-asset-item id="boar-obj" src="/assets/obj/boar-obj.obj"></a-asset-item>
        <a-asset-item id="boar-mtl" src="/assets/obj/boar-obj.mtl"></a-asset-item>

        <a-asset-item id="deer-obj" src="/assets/obj/deer-obj.obj"></a-asset-item>
        <a-asset-item id="deer-mtl" src="/assets/obj/deer-obj.mtl"></a-asset-item>

        <a-asset-item id="wolf-obj" src="/assets/obj/wolf-obj.obj"></a-asset-item>
        <a-asset-item id="wolf-mtl" src="/assets/obj/wolf-obj.mtl"></a-asset-item>
      </a-assets>
      
      <Entity geometry={{primitive: 'plane', width: 100, height: 100}} material="color: #7BC8A4" position="0 0 -4" rotation="-90 0 0"/>
      
      <Entity obj-model="obj: #bear-obj; mtl: #bear-mtl" position="0 0 -5"   rotation="0 0 0"  scale=".1 .1 .1" />
      <Entity obj-model="obj: #boar-obj; mtl: #boar-mtl" position="3 0.5 -4" rotation="0 0 0"  scale=".1 .1 .1" />
      <Entity obj-model="obj: #deer-obj; mtl: #deer-mtl" position="-4 0 -5"  rotation="0 90 0" scale=".1 .1 .1" />
      <Entity obj-model="obj: #wolf-obj; mtl: #wolf-mtl" position="-2 0.5 -3" rotation="0 0 0"  scale=".1 .1 .1" />

    </Scene>
  </div>,
  document.getElementById('app')
)