import React from "react";

import RegisterForm from "../components/RegisterForm";

export default class Register extends React.Component {
    render() {
        return (
            <div className="register-holder col-xs-12">
                <h1>Create an Account</h1>
                <RegisterForm />
            </div>
        );
    }
}