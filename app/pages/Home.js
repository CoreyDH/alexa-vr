import React from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

export default class Home extends React.Component {
    render() {
        return (
            <div className="col-xs-12">
                <h1 className="text-center">Welcome to Alexa Battle VR!</h1>
                <div className="battle-holder">
                    <div className="circle alexa"></div>
                    <div className="versus"></div>
                    <div className="circle pikachu"></div>
                </div>
                <div className="row">
                    <center>
                        <Link to="login"><Button bsStyle="danger">Log in to Battle!</Button></Link>
                        &nbsp;&nbsp;or&nbsp;&nbsp;
                        <Link to="login"><Button bsStyle="primary">Create an Account.</Button></Link>
                    </center>
                </div>
            </div>
        );
    }
}