import React from 'react';

class Nav extends React.Component {
    constructor() {
        super()
    }
    render() {
        return (
            <nav className="navbar navbar-default" role="navigation">
                {/* Brand and toggle get grouped for better mobile display */}
                <div className="navbar-header">
                    <button
                        type="button"
                        className="navbar-toggle"
                        data-toggle="collapse"
                        data-target=".navbar-ex1-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"/>
                        <span className="icon-bar"/>
                        <span className="icon-bar"/>
                    </button>
                    <a className="navbar-brand" href="#">Ripper</a>
                </div>
                {/* Collect the nav links, forms, and other content for toggling */}
                <div className="collapse navbar-collapse navbar-ex1-collapse">
                    <ul className="nav navbar-nav">
                        <li className="active">
                            <a href="#">Link</a>
                        </li>
                        <li>
                            <a href="#">Link</a>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <a href="#">Link</a>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Dropdown
                                <b className="caret"/></a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a href="#">Action</a>
                                </li>
                                <li>
                                    <a href="#">Another action</a>
                                </li>
                                <li>
                                    <a href="#">Something else here</a>
                                </li>
                                <li>
                                    <a href="#">Separated link</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                {/* /.navbar-collapse */}
            </nav>
        );
    }
};

export default Nav;