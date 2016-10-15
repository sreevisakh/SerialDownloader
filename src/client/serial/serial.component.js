import React from 'react';

class Serial extends React.Component {
    constructor(){
        super();
    }
    render() {
        if(!this.props.data){
            return null;
        }
        
        let episodeRender = (episode) => (
            <li key="{episode.name}" classname="list-group-item">
                <span>{episode.name}</span>
                <button onClick="this.play.bind(this,episode.video)">Play</button>
            </li>
        )
        let seasonRender = (season) => (
            <div className="col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Season {season.id}</h3>
                    </div>
                    <div className="panel-body">
                        <ul classname="list-group">
                        {season.episodes.map(episode=>episodeRender(episode))}
                        </ul>
                    </div>
                </div>
            </div>
        )
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{this.props.data.title}</h3>
                </div>
                <div className="panel-body">
                    <div className="row">
                    {this.props.data.seasons.map(season=>seasonRender(season))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Serial;