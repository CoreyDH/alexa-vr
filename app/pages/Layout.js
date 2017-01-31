import React from 'react';

import Header from "../components/Header";

export default class Layout extends React.Component {

    render() {
        if (this.props.children.props.route.name === 'vrscene') {
            return (
                <div className="wrapper" style={{position: 'absolute', height: '100%', width: '100%'}}>
                    {this.props.children}
                </div>
            );

        } else {
            return (
                <div className="wrapper">
                    <Header />
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