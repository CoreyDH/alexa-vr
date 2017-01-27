import React from "react";
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

export default class LoginForm extends React.Component {
    render() {
        return (
            <form action="/account/login" method="post">
                <FormGroup controlId="email">
                    <ControlLabel>E-mail: </ControlLabel>
                    <FormControl type="text" name="email" placeholder="Enter your email here."></FormControl>
                </FormGroup>
                <FormGroup controlId="password">
                    <ControlLabel>Password: </ControlLabel>
                    <FormControl type="password" name="password" placeholder="Enter your password here."></FormControl>
                </FormGroup>
                <Button type="submit">Log In</Button>
            </form>
        );
    }
}