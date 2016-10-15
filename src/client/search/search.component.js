import React from 'react';
import $ from 'jquery';
import Serial from '../serial/serial.component';

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            input: '',
            result: [],
            serial:null
        }
    }
    getSerials(e) {
        e.preventDefault();
        let input = this
            .refs
            .searchText
            .value
            .trim();
        $
            .get('/api/search', {q: input})
            .then(result => {
                this.setState({result});
            })

        return false;

    }
    showSerial(id) {
        $.get('/api/serial/'+id).then(seasons=>{
            this.setState({serial : {
                title : id,
                seasons
            }});
        });
    }
    render() {
        var searchInput = (
            <div className="panel-body">
                <div className="input-group">
                    <form
                        className="form-inline"
                        onSubmit={this
                        .getSerials
                        .bind(this)}>
                        <div className="form-group">
                            <input type="text" className="form-control" id="email" ref="searchText"/>
                        </div>
                        <button type="submit" className="btn btn-default">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        )
        var listItems = this::list();
        return (
            <div className="container">
                <div className="panel panel-default">
                    {searchInput}
                    <div className="panel-body">
                        <ul className="list-group">
                            {listItems}
                        </ul>
                    </div>
                    <div className="panel-body">
                    <Serial data="this.state.serial"></Serial>
                    </div>
                </div>
            </div>
        ) 
    }
}
function list() {
    return this.state.result.map(item => 
    <li key={item.show_id} className="list-group-item" onClick={this.showSerial.bind(this,item.show_id)}>{item.label}</li>)
}

export default Search;