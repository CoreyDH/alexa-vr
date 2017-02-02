import React from 'react';
import { hashHistory } from 'react-router';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from "../stores/UserStore";

export default class LoginForm extends React.Component {

    constructor() {
        super();

        this.state = {
            errors: null,
            form: {
                username: '',
                password: ''
            }
        }

        this.getErrors = this.getErrors.bind(this);
    }

    componentWillMount() {
        UserStore.on('session', this.isLoggedIn);
        UserStore.on('formError', this.getErrors);
    }

    componentWillUnmount() {
        UserStore.removeListener('session', this.isLoggedIn);
        UserStore.removeListener('formError', this.getErrors);
    }

    getErrors() {
        // console.log(UserStore.getFormErrors());
        this.setState({
            errors: UserStore.getFormErrors()
        });
    }

    isLoggedIn() {

        // console.log('logging in...', UserStore.isAuthenticated());
        if (UserStore.isAuthenticated()) {
            hashHistory.push('/account');
        }
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } });
    }

    handleSubmit(event) {
        event.preventDefault();
        // console.log(this.state.form);

        UserActions.logIn(this.state.form);
    }

    render() {

        let errors = null;

        if(this.state.errors) {
            errors = (
                <div className="alert alert-warning alert-dismissable">{this.state.errors}</div>
            );
        }

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                {errors}
                <FormGroup controlId="username">
                    <ControlLabel>Username: </ControlLabel>
                    <FormControl type="text" name="username" defaultValue={this.state.form.username} onChange={this.handleChange.bind(this)} placeholder="Create a username."></FormControl>
                </FormGroup>
                <FormGroup controlId="password">
                    <ControlLabel>Password: </ControlLabel>
                    <FormControl type="password" name="password" defaultValue={this.state.form.password} onChange={this.handleChange.bind(this)} placeholder="Enter your password here."></FormControl>
                </FormGroup>
                <Button type="submit">Log In</Button>
            </form>
        );
    }
}