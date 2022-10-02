import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { playSvg } from '../services/import-img-service';
import { importService } from '../services/import-img-service';
import { setIsPlaying } from '../store/actions/station.actions';
import YouTube from 'react-youtube';
import { setPlayer } from '../store/actions/player.action';

export const AppFooter = () => {


    const { currSong, isPlaying } = useSelector((state) => state.stationModule)
    const { player } = useSelector((state) => state.playerModule)
    const dispatch = useDispatch()
    const opts = {
        height: '0',
        width: '0',
        // playerVars: {
        //     // https://developers.google.com/youtube/player_parameters
        //     autoplay: 1,
        // }
    }

    const playerReady = ({ target }) => {
        target.playVideo()
        dispatch(setPlayer(target))
    }
    const playerOnPlay = ({ target }) => {
        target.playVideo()
    }
    const playerOnStop = ({ target }) => {
        target.pauseVideo()
    }
    const togglePlayPause = () => {
        if (!player) return
        dispatch(setIsPlaying(!isPlaying))
        if (isPlaying) {
            player.pauseVideo()
        } else {
            player.playVideo()
        }
    }


    // useEffect(() => {
    //     console.log(isPlaying);
    // }, [isPlaying])


    const titleSplitter = (currSong) => {

    }

    // const startStopSong = () => {
    // //     isPlaying = !isPlaying
    // // }

    return (
        <section className="app-footer" >
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


            <div className="song-player-container">
                <div className="song-player-container">
                    <div className='song-player-left'>
                        <div>
                            <img src={importService.shuffleSvg} style={{ width: '20px', height: '20px' }} />
                        </div>
                        <div>
                            <img src={importService.prevSvg} style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>
                    {isPlaying & Object.keys(currSong).length ?
                        <img src={importService.playSvg} style={{ width: '36px', height: '36px' }} onClick={() => { dispatch(setIsPlaying(true)) }} /> :
                        <img src={importService.pauseIcon} style={{ width: '36px', height: '36px' }} onClick={() => { dispatch(setIsPlaying(false)) }} />

                    }
                    <div className='song-player-right'>
                        <div>
                            <img src={importService.nextSvg} style={{ width: '20px', height: '20px' }} />
                        </div>
                        <div>
                            <img src={importService.repeatSvg} style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>
                </div>
            </div>


            {Object.keys(currSong).length ? <div className='curr-song'>
                <div className='heart-symbol'>

                </div>
                <div className='title-author'>
                    <div className='song-title'>

                    </div>
                    <div className='song-author'>

                    </div>
                </div>
                <div className='curr-song-img'>
                    <img src={currSong.snippet.thumbnails.default.url} />
                    {/* <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={this._onReady} /> */}
                    <YouTube
                        videoId={currSong?.id}
                        opts={opts}
                        onReady={playerReady}
                    // onPlay={playerOnPlay}
                    // onPause={playerOnPause}
                    // onEnd={() => onChangeSong(1)}
                    />
                </div>
            </div> : <></>
            }

        </section >
    )
}