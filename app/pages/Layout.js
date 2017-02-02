import React from 'react';

import Header from "../components/Header";

import * as UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

export default class Layout extends React.Component {

    constructor() {
        super()

        const token = UserStore.getToken();
        if(token && !UserStore.isAuthenticated()) {
            UserActions.logInWithToken(token);
        }
    }

    render() {
        if (this.props.children.props.route.name === 'aframe') {
            return (
                <div className="a-frame" style={{position: 'absolute', height: '100%', width: '100%'}}>
                    <Header fixedTop={true} />
                    {this.props.children}
                </div>
            );

        } else {
            return (
                <div className="wrapper">
                    <Header fixedTop={false} />
                    <div className="container">
                        <div className="row">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            );
        }
    }
}