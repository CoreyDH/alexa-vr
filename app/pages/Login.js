import React from "react";

import LoginForm from "../components/LoginForm";

export default class Login extends React.Component {
    render() {
        return (
            <div className="login-holder">
                <h1>Log In</h1>
                <LoginForm />
            </div>
        );
    }
}