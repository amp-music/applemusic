import React, {Component} from 'react';
import { Accordion, Card, Button } from "react-bootstrap";
import PropTypes from 'prop-types';
import TOKEN from "./token";
import SongsPerAlbumChart from "./SongsPerAlbumChart";

class Albums extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finishedSettingUp: false,
            albums: null,
        }
        this.numSongsPerAlbum = [];
        this.getAvgSongsPerAlbum = this.getAvgSongsPerAlbum.bind(this);
    }

    getSumOfTracksPerAlbum() {
        return this.numSongsPerAlbum.reduce((total, num) => {return total + num}); // Gets the sum of all elements in the array.
    }

    getAvgSongsPerAlbum(nextNum) {
        //this.numSongsPerAlbum.push(nextNum);
        //this.props.avgSongsPerAlbumCallback(this.getSumOfTracksPerAlbum()/this.numSongsPerAlbum.length); // average = sum / how many there are.
        let tracks = 0;
        let albums = 0;
        for (const album of this.state.albums) {
            tracks += album.relationships.tracks.data.length;
            albums += 1;
        }
        this.props.avgSongsPerAlbumCallback(tracks/albums);
    }

    getTracks(albumIndex) {
        const album = this.state.albums[albumIndex];
        const trackData = [];
        const tracks = album?.relationships?.tracks.data;
        this.getAvgSongsPerAlbum(album?.relationships.tracks.length);
        for (const track of tracks) {
            trackData.push(<Card.Body key={track.attributes.trackNumber}>{track.attributes.name}</Card.Body>)
        }
        return trackData;

    }

    displayAlbums() {
        let ret = [];
        if (this.state.albums.length > 0) {
            this.state.albums.forEach((album, index) => {
                ret.push(
                    <Card key={index}>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey={index}>
                                {album.attributes.name} - {album.attributes.contentRating}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={index}>
                            <div>
                                {this.getTracks(index)}
                            </div>
                        </Accordion.Collapse>
                    </Card>
                );
            });
            return ret;
        }
        return [];
    }

    async componentDidMount() {
        let albumData = [];
        for (const albumHref of this.props.albumHrefs) {
            await fetch(`https://api.music.apple.com${albumHref}`, {headers: {
                    "Authorization": `Bearer ${TOKEN}`
                }})
                .then(resp => resp.json())
                .then(respjson => {
                    albumData.push(respjson.data[0])
                    console.log("Pushing album to albumData...");
                });
        }
        console.log(`albumData length: ${albumData.length}`);
        console.log(`albumHrefs length: ${this.props.albumHrefs.length}`);
        if (albumData.length === this.props.albumHrefs.length) {
            console.log("Updating album state...");
            this.setState({albums: albumData, finishedSettingUp: true});
        }
    }


    render() {
        if (this.state.finishedSettingUp && this.props.albumHrefs.length > 0) {
            return (
                <div>
                    <Accordion>
                        {this.displayAlbums()}
                    </Accordion>
                    <SongsPerAlbumChart names={this.state.albums.map((album) => {return `${album.attributes.name} - ${album.attributes.contentRating}`})} numTracks={this.state.albums.map((album) => {return album.attributes.trackCount})}/>
                </div>
            );
        }
        else {
            return null;
        }
    }
}

Albums.defaultProps = {
    visible: true,
    albumHrefs: [],
}

Albums.propTypes = {
    artistID: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    avgSongsPerAlbumCallback: PropTypes.func, // callback that sets state in parent component.
    albumHrefs: PropTypes.array,
}

export default Albums;


/**
 * Travis scott album data for reference. Arrays have been minimized to only show one value.
 * {
  "finishedSettingUp": true,
  "albums": [
    { (first item of array)
      "id": "1421241217",
      "type": "albums",
      "href": "/v1/catalog/us/albums/1421241217",
      "attributes": {
        "artwork": "{bgColor: \"a2bad1\", height: 3000, textColor1: \"1b03…}",
        "artistName": "Travis Scott",
        "isSingle": false,
        "url": "https://music.apple.com/us/album/astroworld/1421241217",
        "isComplete": true,
        "genreNames": "[\"Hip-Hop/Rap\", \"Music\", \"Dirty South\", \"Rap\"]",
        "trackCount": 17,
        "isMasteredForItunes": true,
        "releaseDate": "2018-08-03",
        "name": "ASTROWORLD",
        "recordLabel": "Cactus Jack / Epic / Grand Hustle",
        "copyright": "℗ 2018 Epic Records/Sony. With Cactus Jack and Grand Hustle.",
        "playParams": "{id: \"1421241217\", kind: \"album\"}",
        "editorialNotes": "{short: \"A tour of the shadowy theme park that is t…}",
        "isCompilation": false,
        "contentRating": "explicit"
      },
      "relationships": {
        "artists": "{data: Array(1), href: \"/v1/catalog/us/albums/14212…}",
        "tracks": {
          "href": "/v1/catalog/us/albums/1421241217/tracks",
          "data": [
            { (first item of array)
              "id": "1421242380",
              "type": "songs",
              "href": "/v1/catalog/us/songs/1421242380",
              "attributes": {
                "previews": "[{…}]",
                "artwork": "{bgColor: \"a2bad1\", height: 3000, textColor1: \"1b03…}",
                "artistName": "Travis Scott",
                "url": "https://music.apple.com/us/album/stargazing/1421241217?i=1421242380",
                "discNumber": 1,
                "genreNames": "[\"Hip-Hop/Rap\", \"Music\"]",
                "durationInMillis": 270715,
                "releaseDate": "2018-08-03",
                "name": "STARGAZING",
                "isrc": "USSM11806658",
                "hasLyrics": true,
                "albumName": "ASTROWORLD",
                "playParams": "{id: \"1421242380\", kind: \"song\"}",
                "trackNumber": 1,
                "composerName": "Jacques Webster",
                "contentRating": "explicit"
              }
            },
          ]
        }
      }
    },
  ]
}
 * */