import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from "../stores/UserStore";

export default class Layout extends React.Component {

    constructor() {
        super();

        this.getStatus = this.getStatus.bind(this);
        this.state = {
            loggedIn: UserActions.checkStatus()
        }
    }

    componentWillMount() {
        UserStore.on('change', this.getStatus);
        console.log('count', UserStore.listenerCount('change'));
    }

    componentWillUnmount() {
        UserStore.removeListener('change', this.getStatus)
    }

    getStatus() {

        console.log('emitted change received');
        this.setState({
                loggedIn: UserStore.isLoggedIn()
        });
    }

    logOut() {
        UserActions.logOut();
    }

    render() {

        let userLinks = null;

        console.log('login state', this.state.loggedIn);

        if (this.state.loggedIn) {
            userLinks = (
                <Nav pullRight>
                    <NavDropdown title="My Account" id="my-account">
                        <LinkContainer to="account"><MenuItem>Dashboard</MenuItem></LinkContainer>
                        <MenuItem onSelect={this.logOut.bind(this)}>Log Out</MenuItem>
                    </NavDropdown>
                </Nav>);
        } else {
            userLinks = (
                <Nav pullRight>
                    <LinkContainer to="login"><NavItem>Log In</NavItem></LinkContainer>
                    <LinkContainer to="register"><NavItem>Create an Account</NavItem></LinkContainer>
                </Nav>);
        }

        return (
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">AlexaVR Pets</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="about"><NavItem>About</NavItem></LinkContainer>
                    </Nav>
                    {userLinks}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
