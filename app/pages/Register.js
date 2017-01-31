import React from 'react';

import RegisterForm from "../components/RegisterForm";

export default class Register extends React.Component {
    render() {
        return (
            <div className="register-holder">
                <h3>Create an Account</h3>
                <RegisterForm />
            </div>
        );
    }
}