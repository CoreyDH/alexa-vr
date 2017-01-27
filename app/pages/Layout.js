import React from "react";

import Header from "../components/Header";

export default class Layout extends React.Component {
    render() {
        return (
            <div className='main-container'>
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