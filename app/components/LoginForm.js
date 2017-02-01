import React from 'react';
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
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.form);

        UserActions.logIn(this.state.form);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
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