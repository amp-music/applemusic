import React from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

function SongsPerAlbumChart(props) {
    const myChart = {

        labels: props.names,
        datasets: [
            {
                label: 'Popularity',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: props.numTracks
            }
        ]
    }

    return (
        <div>
            <Bar data={myChart} options={{
                title: {
                    display: true,
                    text: 'Number of tracks per album',
                    fontSize: 20,
                },
                legend: {
                    display: true,
                    position: 'right',
                }
            }}/>
        </div>
    );
}

SongsPerAlbumChart.propTypes = {
   //data: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string, numTracks: PropTypes.number})),
    names: PropTypes.arrayOf(PropTypes.string).isRequired,
    numTracks: PropTypes.arrayOf(PropTypes.number).isRequired,
}

export default SongsPerAlbumChart;