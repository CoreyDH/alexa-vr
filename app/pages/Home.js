import React from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import UserStore from '../stores/UserStore';

export default class Home extends React.Component {

    constructor() {
        super();

        this.state = {
            authenticated: false
        };
    }

    componentWillMount() {
        UserStore.on('session', this.isLoggedIn);
    }

    componentWillUnmount() {
        UserStore.removeListener('session', this.isLoggedIn);
    }

    isLoggedIn() {

        const auth = UserStore.isAuthenticated();

        if(auth) {
            this.setState({
                authenticated: auth
            });
        }
    }

    render() {

        let showButtons = null;

        if(this.state.authenticated) {
            showButtons = (
                <center>
                    <Link to="login"><Button bsStyle="danger">Log in to Battle!</Button></Link>
                    &nbsp;&nbsp;or&nbsp;&nbsp;
                    <Link to="register"><Button bsStyle="primary">Create an Account</Button></Link>
                    <br/><br/>
                    <i>*Demo requires an Amazon Echo device.</i>
                </center>
            );

        } else {
            showButtons = (
                <center>
                    <Link to="account"><Button bsStyle="danger">Go to your Account Page to Battle!</Button></Link>
                    <br/><br/>
                    <i>*Demo requires an Amazon Echo device.</i>
                </center>
            );
        }

        return (
            <div className="col-xs-12">
                <h1 className="text-center">Welcome to Alexa Battle VR!</h1>
                <div className="battle-holder">
                    <div className="circle alexa"></div>
                    <div className="versus"></div>
                    <div className="circle pikachu"></div>
                </div>
                <div className="row">
                    {showButtons}
                </div>
            </div>
        );
    }
}