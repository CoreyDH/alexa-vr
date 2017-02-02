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
        if (this.props.children.props.route.name === 'vrscene') {
            return (
                <div className="a-frame">
                    <Header fixedTop={true} />
                    <div className="wrapper">
                        {this.props.children}
                    </div>
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