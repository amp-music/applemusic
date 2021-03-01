import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

function Home(props) {
    const [artistID, setArtistID] = useState();
    const [searchBarState, setSearchBarState] = useState();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent browser reload
        console.dir(event);

        if (searchBarState.includes("music.apple.com") && searchBarState.includes('/artist/')) {
            //const artistID = searchBarState.substring(searchBarState.indexOf("/artist/")+8);
            let nameAndId = searchBarState.substring(searchBarState.indexOf("/artist/")+8); // For example, "billy-joel/485953"
            const artistID = nameAndId.substring(nameAndId.indexOf("/")+1);
            setArtistID(artistID);
        }
        else {
            setArtistID(searchBarState);
        }

    }

    const handleChange = (event) => {
        setSearchBarState(event.target.value);
    }

    if (artistID) {
        return <Redirect to={{pathname: `/${artistID}`}} />
    }

    return (
        <div className="App">
            <header className="App-header">
                <Form onSubmit={handleSubmit}>
                    <Form.Control size="lg" type="text" placeholder="Artist ID here" value={searchBarState} onChange={handleChange}/>
                </Form>
            </header>
        </div>
    );
}

export default Home;