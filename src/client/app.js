import React from 'react';
import ReactDom from 'react-dom';
import Nav from './nav/nav.component';
import Search from './search/search.component';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="container">
                <Nav></Nav>
                <Search></Search>
            </div>
        )
    }
}

ReactDom.render(
    <App></App>, document.getElementById('app'));