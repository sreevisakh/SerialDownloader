import React from 'react';
import $ from 'jquery';

class Serial extends React.Component {
    constructor() {
        super();
        this.state = {
            url: ''
        }
    }
    play(url) {
        $.post('/api/video', {url: url}).then(response => {
            this.setState({url : JSON.parse(response.url)});
        });
    }
    closeVideo() {
        this.setState({url: null})
    }
    render() {
        if (!this.props.data) {
            return null;
        }

        let episodeRender = (episode) => (
            <li key={episode.name} className="list-group-item">
                <span>{episode.name}</span>
                <button className="pull-right" onClick={this.play.bind(this, episode.video)}>Play</button>
            </li>
        )
        let seasonRender = (season, index) => (
            <div key={index} className='panel-body col-md-4'>
                <ul className="list-group" key={season.id + index}>
                    <li className="list-group-item list-group-item-info">Season {season.id}</li>
                    {season.episodes.map(episodeRender)}
                </ul>
            </div>

        )
        let videoRender = () => {
            if (this.state.url) {
                return (
                    <div className="overlay">
                        <div className="close" onClick={this.closeVideo.bind(this)}>&times;</div>
                        <video controls autoPlay className="video" src={this.state.url}></video>
                    </div>
                )
            }

        }

        return (
            <div className="panel panel-default">
                {this.props.data.seasons.map(seasonRender)}
                {videoRender.bind(this)()}

            </div>
        )
    }
}

export default Serial;