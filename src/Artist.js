import React, {useEffect, useState, useRef} from 'react';
import { useParams } from 'react-router-dom';
//import TopTracks from './TopTracks';
import Albums from "./Albums";
//import ChartjsBar from "./ChartjsBar";
//import TracksPerAlbumChart from "./TracksPerAlbumChart";
import TOKEN from './token';


function Artist(props) {
    let { id } = useParams();


    const [name, setName] = useState("");
    //const [albums, setAlbums] = useState([]);
    const [albumIDs, setAlbumIDs] = useState(false); // initial state set to false instead of empty array because [] is truthy, and I don't want to call Albums.js until array populated.
    const [albumHrefs, setAlbumHrefs] = useState(false); // initial state set to false instead of empty array because [] is truthy, and I don't want to call Albums.js until array populated.
    //const [avgSongsPerAlbum, setAvgSongsPerAlbum] = useState(0);
    //const [avgAlbumPopularity, setAvgAlbumPopularity] = useState(0);
    const [genres, setGenres] = useState("");
    const [avgSongs, setAvgSongs] = useState(null);


    async function getArtist() {
        const resp = await fetch(`https://api.music.apple.com/v1/catalog/us/artists/${id}`, {
            headers: {
                "Authorization": `Bearer ${TOKEN}`
            }
        });
        const respjson = await resp.json();
        console.dir(respjson.data[0]);
        setName(respjson.data[0]?.attributes?.name);
        setGenres(respjson.data[0].attributes.genreNames);
        let tempAlbumIDs = [];
        let tempAlbumHrefs = []

        respjson.data[0].relationships.albums.data.forEach(album => {
            tempAlbumIDs.push(album.id);
            tempAlbumHrefs.push(album.href);

        })
        setAlbumHrefs(tempAlbumHrefs);
        setAlbumIDs(tempAlbumIDs);

    }

    function avgSongsPerTrack(avg) {
        setAvgSongs(avg);
    }

    useEffect( () => {
        getArtist()
            .catch(err => {
                console.error(err);
            });
    }, []);

    if (avgSongs) {
        return (
            <div>
                <h2>name: {name}</h2>
                <h4>Genres: {genres}</h4>
                <h4>Average of {avgSongs} songs per album</h4>
                <br/>
                <Albums artistID={id} albumHrefs={albumHrefs} avgSongsPerAlbumCallback={avgSongsPerTrack}/>

            </div>
        );
    }

    else if (albumIDs) {
        return (
            <div>
                <h2>name: {name}</h2>
                <h4>Genres: {genres}</h4>
                <h3>Loading album and track data. Please wait.</h3>
                <br/>
                <Albums artistID={id} albumHrefs={albumHrefs} avgSongsPerAlbumCallback={avgSongsPerTrack}/>

            </div>
        );
    }
    else {
        return null;
    }

}

export default Artist