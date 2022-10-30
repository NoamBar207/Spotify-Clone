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
import { height } from '@mui/system';

export const AppFooter = () => {


    const { currSong, isPlaying, currStation } = useSelector((state) => state.stationModule)
    const { player } = useSelector((state) => state.playerModule)
    const [songName, setSongName] = useState('')
    const [songAutor, setSongAutor] = useState('')
    const [songDuration, setSongDuration] = useState(0)
    const [songTotalDuration, setSongTotalDuration] = useState('')
    const [songTotalDurationNum, setSongTotalDurationNum] = useState(0)
    const [volume, setVolume] = useState(0)
    const [reapetInd, setReapetInd] = useState(false)



    const [shuffle, setShuffle] = useState(false)
    const [shuffledSongs, setShuffleSongs] = useState(null)
    // let songTimeInterval = useRef(0)
    let intervalId = useRef()
    let currStationId = useRef(currStation.id)


    const dispatch = useDispatch()
    const opts = {
        height: '00',
        width: '00',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        }
    }

    useEffect(() => {
        if (Object.keys(player).length && isPlaying) playerOnPlay()
        else if (Object.keys(player).length && !isPlaying) playerOnPause()
    }, [isPlaying])





    const playerReady = (event) => {
        //cleaning
        console.log('OnPlayer Ready', event.target);
        clearInterval(intervalId.current)
        setSongDuration(0)

        titleSplitter()
        event.target.playVideo()

        //setters
        dispatch(setIsPlaying(true))
        dispatch(setPlayer(event.target))
        setSongTotalDuration(utilService.getSongDurationToMin(+event.target.getDuration()))
        setSongTotalDurationNum(+event.target.getDuration())
        if (!volume) {
            setVolume(event.target.getVolume())
        }
    }

    const playerOnPlay = () => {
        // if (songDuration) {
        //     console.log(songDuration, 'heree58');
        //     player.seekTo(50)
        // }
        clearInterval(intervalId.current)
        intervalId.current = setInterval(() => {
            setSongDuration(prevDuration => +prevDuration + 1)
        }, 1000)
        player.playVideo()
        player.setVolume(volume)
    }

    const playerOnPause = () => {
        if (!Object.keys(player).length) return
        clearInterval(intervalId.current)
        player.pauseVideo()
    }

    const titleSplitter = () => {
        let fullTitle = currSong.snippet.title
        setSongAutor('')
        setSongName('')
        let idxToSplit = 0
        if (fullTitle.includes('-')) {
            idxToSplit = fullTitle.indexOf('-')
            setSongAutor(fullTitle.slice(0, idxToSplit))
        }
        if (fullTitle.includes('(')) {
            let idxOfTitleFinish = fullTitle.indexOf('(')
            setSongName(fullTitle.slice(idxToSplit + 1, idxOfTitleFinish))
        } else setSongName(fullTitle.slice(idxToSplit))
    }

    const togglePlayer = () => {
        isPlaying ? dispatch(setIsPlaying(false)) : dispatch(setIsPlaying(true))
    }

    const handleChangeVolume = (event) => {
        // console.log(event.target);
        setVolume(event.target.value)
        player.setVolume(event.target.value)
    }

    const handleChangeSongMin = (event) => {
        // setVolume(event.target.value)
        // player.setVolume(event.target.value)
        setSongDuration(event.target.value)
        player.seekTo(event.target.value)
    }

    const onPrevNextSong = (diff) => {
        // if(shuffle && Object.keys(currSong).length){
        //     let idxPrevSong = currStation.songs.findIndex(song => (song.id.videoId === currSong.id.videoId))
        //     let songsAmount = currStation.songs.length
        //     let idxNextSong = Math.Random() * songsAmount

        // }
        if (reapetInd) {
            console.log(reapetInd);
            player.seekTo(0)
            setSongDuration(0)
        }
        else if (Object.keys(currSong).length) {
            let idxRem = currStation.songs.findIndex(song => (song.id.videoId === currSong.videoId))
            idxRem += diff
            if (idxRem === -1) {
                idxRem = 0
                player.seekTo(0)
                setSongDuration(0)
            }
            if (idxRem === currStation.songs.length) idxRem = 0
            dispatch(setCurrSong(currStation.songs[idxRem]))
        } else return
    }

    const onShuffle = () => {
        setShuffle(!shuffle)
        if (shuffle) {
            let shuffled = utilService.shuffleFunc(currStation.songs, currSong)
            console.log(shuffled);
            console.log(currStation.songs);
        }
    }


    const onReapet = () => {
        if (Object.keys(currSong).length) {
            setReapetInd(!reapetInd)
        }
        else return
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
                            <img src={currSong.snippet.thumbnails.high.url} style={{ height: '70px', width: '70px' }} />
                            {/* <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={this._onReady} /> */}
                            <YouTube
                                videoId={currSong?.videoId}
                                opts={opts}
                                onReady={playerReady}
                                onPlay={playerOnPlay}
                                onPause={playerOnPause}
                                onEnd={() => onPrevNextSong(1)}
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
                        <div onClick={onShuffle}>
                            <i class="fa-solid fa-shuffle" style={{ width: '20px', height: '20px', color: 'white' }}></i>
                        </div>
                        <div onClick={() => onPrevNextSong(-1)}>
                            <span><i class="fa-solid fa-backward-step" style={{ width: '24px', height: '24px', color: 'white' }}></i></span>
                            {/* <img src={importService.prevSvg} style={{ width: '20px', height: '20px' }} /> */}
                        </div>
                    </div>
                    <div className='song-player-play-pause'>
                        {!isPlaying ? <span onClick={togglePlayer}><i class="fa-solid fa-circle-play" style={{ width: '36px', height: '36px', color: 'white' }}></i></span> :
                            <span onClick={togglePlayer}><i class="fa-sharp fa-solid fa-circle-pause" style={{ width: '36px', height: '36px', color: 'white' }}></i></span>
                        }
                    </div>
                    <div className='song-player-right'>
                        <div onClick={() => onPrevNextSong(1)}>
                            <span><i class="fa-solid fa-forward-step" style={{ width: '24px', height: '24px', color: 'white' }}></i></span>
                            {/* <img src={importService.nextSvg} style={{ width: '20px', height: '20px' }} /> */}
                        </div>
                        <div onClick={onReapet}>
                            <i class="fa-solid fa-repeat" style={{ width: '20px', height: '20px', color: 'white' }}></i>
                        </div>
                    </div>
                </div>
                <div className='song-time-slider'>
                    <h1>{utilService.getSongDurationToMin(songDuration)}</h1>
                    <SliderBar disabled={false} value={+songDuration} maxValue={songTotalDurationNum} handleChange={handleChangeSongMin} />
                    {Object.keys(currSong).length ? <h1>{songTotalDuration}</h1> : <></>}

                </div>
            </div>


            <div className='app-footer-volume'>
                {/* <div>
                    <img src={importService.speakerSvg} style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                    <img src={importService.queueSvg} style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                    <img src={importService.micSvg} style={{ width: '20px', height: '20px' }} />
                </div> */}
                <div className='volume-container'>
                    {/* {volume === 0 ? <i class="fa-solid fa-volume-off" style={{ color: 'white' }}></i> : <></>}
                    {volume < 50 && volume !== 0 ? <i class="fa-solid fa-volume-low" style={{ color: 'white' }}></i> : <></>}
                    {volume >= 50 ? <i class="fa-solid fa-volume-high" style={{ color: 'white' }}></i> : <></>} */}


                    <i class="fa-solid fa-volume-high" style={{color:'white'}}></i>


                    {/* <img src={importService.volumeSvg} style={{ width: '20px', height: '20px' }} /> */}
                </div>
                <div style={{ width: '93px' }}>
                    <SliderBar disabled={false} value={volume} maxValue={100} handleChange={(event) => handleChangeVolume(event)} />
                </div>
            </div>


        </section >
    )
}