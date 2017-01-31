import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {
    render() {
        return (
            <div className="col-xs-12">
                Hello world!
                <Link to="login">This is a link</Link>
            </div>
        );
    }
}