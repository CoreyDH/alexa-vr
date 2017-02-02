import React from 'react';
import { pushState }  from 'react-router';
import ajax from '../../helpers/ajax.js';

export default class Logout extends React.Component {
    constructor() {
        super();
        ajax.logout();

    }

    render() {
        return (
            <div className="login-holder">
                Logging you out..
            </div>
        );
    }
}