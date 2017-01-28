import React from 'react';
import { Link}  from 'react-router';
import { Button } from 'react-bootstrap';

import LoginForm from "../components/LoginForm";

export default class Login extends React.Component {
    render() {
        return (
            <div className="login-holder">
                <div className="col-xs-12 col-sm-6">
                    <h3>Log In</h3>
                    <LoginForm />
                </div>
                <div className="col-xs-12 col-sm-6">
                    <h3>Don't have an account?</h3>
                    <p>Click below to register an account.</p>
                    <Link to="register"><Button>Create Account</Button></Link>
                </div>
            </div>
        );
    }
}