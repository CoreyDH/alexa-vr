import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button } from 'react-bootstrap';

import UserStore from "../stores/UserStore";

export default class Layout extends React.Component {

    constructor() {
        super();
        this.state = {
            loggedIn: false
        }
    }

    componentWillMount() {

        console.log('hit mount');
        UserStore.on('change', () => {
            this.setState({
                loggedIn: UserStore.isLoggedIn()
            });
        })
    }

    render() {

        let userLinks = null;

        console.log('login state', this.state.loggedIn.responseText);

        if (this.state.loggedIn.data) {
            userLinks = (
                <Nav pullRight>
                    <NavDropdown title="My Account" id="my-account">
                        <LinkContainer to="account"><MenuItem>Dashboard</MenuItem></LinkContainer>
                        <LinkContainer to="logout"><MenuItem>Log Out</MenuItem></LinkContainer>
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
