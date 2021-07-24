import React, {Component} from 'react';
import spacex_logo from "../assets/images/spacex_logo.svg"

class Header extends Component {
    //Create Header.js Component
    // header part design and insert a logo image
    render() {
        return (
            <header className="App-header">
                <img src={spacex_logo} className="App-logo" alt="logo" />
                <p className="title">
                    StarLink Tracker
                </p>
            </header>
        );
    }
}

export default Header;