import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button } from 'react-bootstrap';

import * as UserActions from '../actions/UserActions';
import UserStore from "../stores/UserStore";

export default class Layout extends React.Component {

    constructor() {
        super();

        this.state = {
            isLoggedIn: UserStore.isAuthenticated(),
        }

        this.checkAuthentication = this.checkAuthentication.bind(this);
    }

    componentWillMount() {
        UserStore.on('session', this.checkAuthentication);
    }

    componentWillUnmount() {
        UserStore.removeListener('session', this.checkAuthentication);
    }

    checkAuthentication() {
        this.setState({
            isLoggedIn: UserStore.isAuthenticated()
        })
    }

    logOut() {
        UserActions.logOut();
    }

    render() {

        let userLinks = null;

        // console.log('login state', this.state.isLoggedIn);

        if (this.state.isLoggedIn) {
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
            <Navbar collapseOnSelect fixedTop={this.props.fixedTop}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">AlexaVR Pets</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    {userLinks}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
