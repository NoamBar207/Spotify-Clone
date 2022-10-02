import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';



export function YoutubeCmp() {

    const { currSong, isPlaying } = useSelector((state) => state.stationModule)
    // const [stateIsPlaying, setStateIsPlaying] = useState(isPlaying)

    // useEffect(() => {
    //     setStateIsPlaying(!isPlaying)
    // }, [isPlaying])

    useEffect(() => {
        // isPlaying ? _onReady() : _onPause()
    }, [isPlaying])


    const opts = {
        height: '100',
        width: '100',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };


    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        // event.target.pauseVideo();
        console.log(event);
        event.target.playVideo()
    }

    const _onPause = (event) => {
        event.target.pauseVideo()
    }



    return (
        <YouTube videoId={currSong.id.videoId} opts={opts} />
    )
}