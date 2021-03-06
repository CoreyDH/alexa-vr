import React from 'react'
import { hashHistory } from 'react-router';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from "../stores/UserStore";

export default class RegisterForm extends React.Component {

    constructor() {
        super();

        this.state = {
            errors: null,
            form: {
                username: '',
                email: '',
                password: '',
                password2: ''
            }
        }

        this.getErrors = this.getErrors.bind(this);
    }

    componentWillMount() {
        UserStore.on('session', this.redirectOnLogin);
        UserStore.on('formError', this.getErrors);
    }

    componentWillUnmount() {
        UserStore.removeListener('session', this.redirectOnLogin);
        UserStore.removeListener('formError', this.getErrors);
    }

    getErrors() {
        // console.log(UserStore.getFormErrors());
        this.setState({
            errors: UserStore.getFormErrors()
        });
    }

    redirectOnLogin() {
        if (UserStore.isAuthenticated()) {
            // location.reload();
        }
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } });
    }

    handleSubmit(event) {
        // event.preventDefault();
        // console.log(this.state.form);

        UserActions.register(this.state.form);
    }

    render() {

        let Errors = null;

        if (this.state.errors) {
            Errors = this.state.errors.map((error, i) => {
                return (
                    <div className="alert alert-warning alert-dismissable">
                        {error.msg} 
                    </div>
                );
            });
        }

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                {Errors}
                <FormGroup controlId="username">
                    <ControlLabel>Username: </ControlLabel>
                    <FormControl type="text" name="username" defaultValue={this.state.form.username} onChange={this.handleChange.bind(this)} placeholder="Create a username."></FormControl>
                </FormGroup>
                <FormGroup controlId="email">
                    <ControlLabel>E-mail: </ControlLabel>
                    <FormControl type="text" name="email" defaultValue={this.state.form.email} onChange={this.handleChange.bind(this)} placeholder="Enter your email here."></FormControl>
                </FormGroup>
                <FormGroup controlId="password">
                    <ControlLabel>Password: </ControlLabel>
                    <FormControl type="password" name="password" defaultValue={this.state.form.password} onChange={this.handleChange.bind(this)} placeholder="Enter your password here."></FormControl>
                </FormGroup>
                <FormGroup controlId="password2">
                    <ControlLabel>Confirm Password: </ControlLabel>
                    <FormControl type="password" name="password2" defaultValue={this.state.form.password2} onChange={this.handleChange.bind(this)} placeholder="Confirm your password."></FormControl>
                </FormGroup>
                <Button type="submit">Register</Button>
            </form>
        );
    }
}