import React from 'react';

export default class AframeComponent extends React.Component {
    render() {
        return (
            <div>
            <script
                src="https://code.jquery.com/jquery-3.1.1.min.js"
                integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
                crossorigin="anonymous"></script>
            <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
            <a-scene>
                <a-cylinder id="cyl" position="0 0.75 -3" radius="0.3" height="1.5" color="grey">
                    <a-animation attribute="rotation" dur="10000" fill="forwards" to="180 360 0" begin="dance"></a-animation>
                </a-cylinder>
                <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
                <a-sky color="#ECECEC"></a-sky>
            </a-scene>

            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();
            socket.on('news', function (data) {
                    console.log(data);
                socket.emit('my other event', {my: 'data' });
                $('#cyl')[0].emit('dance');
            });
        </script>
        </div>
        );
    }
}