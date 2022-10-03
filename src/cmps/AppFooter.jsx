import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { playSvg } from '../services/import-img-service';
import { importService } from '../services/import-img-service';
import { setCurrSong, setIsPlaying } from '../store/actions/station.actions';
import YouTube from 'react-youtube';
import { setPlayer } from '../store/actions/player.action';
import { useRef } from 'react';
import { SliderBar } from './util.cmps/SlideBar';
import { utilService } from '../services/util.service';

export const AppFooter = () => {


    const { currSong, isPlaying } = useSelector((state) => state.stationModule)
    const { player } = useSelector((state) => state.playerModule)
    const [songName, setSongName] = useState('')
    const [songAutor, setSongAutor] = useState('')
    const [songDuration, setSongDuration] = useState(0)
    const [songTotalDuration, setSongTotalDuration] = useState('')
    const [songTotalDurationNum, setSongTotalDurationNum] = useState('')
    // let songTimeInterval = useRef(0)
    let intervalId = useRef()


    const dispatch = useDispatch()
    const opts = {
        height: '00',
        width: '00',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        }
    }

    // useEffect(() => {
    //     return ()=>{
    //         // dispatch(setPlayer(null))
    //         // dispatch(setCurrSong(null))
    //         clearInterval(intervalId.current)
    //     }
    //     // console.log('useEffect');
    // },[])

    const playerReady = (event) => {
        clearInterval(intervalId.current)
        setSongDuration(0)

        titleSplitter()

        // console.log(event.target.seekTo());
        event.target.playVideo()
        dispatch(setIsPlaying(true))
        dispatch(setPlayer(event.target))
        setSongTotalDuration(utilService.getSongDurationToMin(+event.target.getDuration()))
        setSongTotalDurationNum(+event.target.getDuration())
    }

    const playerOnPlay = () => {
        clearInterval(intervalId.current)
        intervalId.current = setInterval(() => {
            setSongDuration(prevDuration => +prevDuration + 1)
        }, 1000)
        // if (songDuration) {
        //     console.log(songDuration, 'heree58');
        //     player.seekTo(songDuration)
        // }
        player.playVideo()
        dispatch(setIsPlaying(true))
    }

    const playerOnStop = () => {
        console.log('stop video', intervalId);
        clearInterval(intervalId.current)
        console.log('stop video', intervalId.current);
        dispatch(setIsPlaying(false))
        player.stopVideo()
    }
    // const togglePlayPause = () => {
    //     if (!player) return
    //     dispatch(setIsPlaying(!isPlaying))
    //     if (isPlaying) {
    //         player.stopVideo()
    //     } else {
    //         player.playVideo()
    //     }
    // }


    // useEffect(() => {
    //     console.log(isPlaying);
    // }, [isPlaying])


    const titleSplitter = () => {
        let fullTitle = currSong.snippet.title
        let idxToSplit = fullTitle.indexOf('-')
        setSongAutor(fullTitle.slice(0, idxToSplit))
        if (fullTitle.includes('(')) {
            let idxOfTitleFinish = fullTitle.indexOf('(')
            setSongName(fullTitle.slice(idxToSplit + 1, idxOfTitleFinish))
        } else setSongName(fullTitle.slice(idxToSplit))
    }

    // const startStopSong = () => {
    // //     isPlaying = !isPlaying
    // // }

    return (
        <section className="app-footer" >


            <div className='curr-song'>
                {Object.keys(currSong).length ?
                    <div className='curr-song-container'>
                        <div className='curr-song-img'>
                            <img src={currSong.snippet.thumbnails.default.url} />
                            {/* <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={this._onReady} /> */}
                            <YouTube
                                videoId={currSong?.id.videoId}
                                opts={opts}
                                onReady={playerReady}
                                onPlay={playerOnPlay}
                                onPause={playerOnStop}
                            // onEnd={() => onChangeSong(1)}
                            />
                        </div>
                        <div className='title-author'>
                            <div className='song-title'>
                                {songName}
                            </div>
                            <div className='song-author'>
                                {songAutor}
                            </div>
                        </div>
                        <div className='heart-symbol'>

                        </div>
                    </div> : <></>
                }
            </div>


            <div className="song-player-container">
                <div className="song-player-controls">
                    <div className='song-player-left'>
                        <div>
                            <img src={importService.shuffleSvg} style={{ width: '20px', height: '20px' }} />
                        </div>
                        <div>
                            <img src={importService.prevSvg} style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>
                    <div className='song-player-play-pause'>
                        {!isPlaying ?
                            <img src={importService.playSvg} style={{ width: '36px', height: '36px' }} onClick={playerOnPlay} /> :
                            <img src={importService.pauseIcon} style={{ width: '36px', height: '36px' }} onClick={playerOnStop} />

                        }
                    </div>
                    <div className='song-player-right'>
                        <div>
                            <img src={importService.nextSvg} style={{ width: '20px', height: '20px' }} />
                        </div>
                        <div>
                            <img src={importService.repeatSvg} style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>
                </div>
                <div className='song-time-slider'>
                    <h1>{songDuration}</h1>
                    <SliderBar disabled={false} value={+songDuration} maxValue={songTotalDurationNum} />
                    {Object.keys(currSong).length ? <h1>{songTotalDuration}</h1>: <></> }

                </div>
            </div>


            <div className='app-footer-volume'>
                <div className='volume-container'>
                    <img src={importService.volumeSvg} style={{ width: '20px', height: '20px' }} />
                    <input type='range'></input>
                </div>
                <div>
                    <img src={importService.speakerSvg} style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                    <img src={importService.queueSvg} style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                    <img src={importService.micSvg} style={{ width: '20px', height: '20px' }} />
                </div>
            </div>


        </section >
    )
}