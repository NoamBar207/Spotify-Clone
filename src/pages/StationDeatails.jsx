import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { StationHeader } from "../cmps/StationHeader"
import { stationService } from "../services/station.service"
import { setCurrSong, setCurrStation, setIsPlaying } from "../store/actions/station.actions"
import { MainMenu } from '../cmps/MainMenu'
import { useDispatch, useSelector } from "react-redux"
import { utilService } from "../services/util.service"



export function StationDeatails() {


    const dispatch = useDispatch()
    const { currSong, isPlaying, currStation } = useSelector((state) => state.stationModule)
    const [station, setStation] = useState({})
    const { stationId } = useParams()


    useEffect(() => {
        loadStation()
    }, [currStation])



    const loadStation = async () => {
        try {
            if (!Object.keys(currStation).length) {
                const station = await stationService.getById(stationId)
                dispatch(setCurrStation(station))
            }
            // // const stateStation = station[0]
            // console.log(station);
            // dispatch(setCurrStation(station))
        } catch {
            console.error('cannot load Stations')
        }
    }

    const cutExtraTitle = (songTitle) => {
        // {
        //     song.snippet.title.includes('(') ? 
        //     const idx = song.snippet.title.indexOf('(') 
        // }/
        //TODO :::: add more chars
        if (songTitle.includes('(')) {
            const idx = songTitle.indexOf('(')
            songTitle = songTitle.slice(0, idx)
        }
        return songTitle
    }


    // const getAutorName = (song) => {
    //     // let fullTitle = currSong.snippet.title
    //     // let idxToSplit = 0
    //     // if (fullTitle.includes('-')) {
    //     //     idxToSplit = fullTitle.indexOf('-')
    //     // } 
    //     // if (fullTitle.includes('(')) {
    //     //     let idxOfTitleFinish = fullTitle.indexOf('(')
    //     // } else setSongName(fullTitle.slice(idxToSplit))

    //     let fullTitle = song.snippet.title
    //     let idxToSplit
    //     if (fullTitle.includes('-')) {
    //         idxToSplit = fullTitle.indexOf('-')
    //     }
    //     let authorSong = fullTitle.slice(0, idxToSplit)
    //     return authorSong
    // }

    const getSongName = (song) => {
        let fullTitle = song.snippet.title
        let idxToSplitStart
        let idxToSplitEnd
        let songName
        if (fullTitle.includes('-')) idxToSplitStart = fullTitle.indexOf('-')
        if (fullTitle.includes('(')) idxToSplitEnd = fullTitle.indexOf('(')
        songName = fullTitle.slice(idxToSplitStart + 1, idxToSplitEnd)
        return songName
    }


    const onPlay = () => {
        if (!Object.keys(currSong).length) {
            dispatch(setCurrSong(currStation.songs[0]))
        } else {
            if (isPlaying) {
                dispatch(setIsPlaying(false))
            }
            else {
                dispatch(setIsPlaying(true))
            }
        }

    }

    if (!Object.keys(currStation).length) return <h1>Hello</h1>
    return (
        <section className="station-deatils">
            <StationHeader />
            <div className="color-container">

                <div className="play-btn-station">
                    <span onClick={onPlay}><i className="fa-solid fa-circle-play" style={{ width: '56px', height: '56px', color: '#1fdf64' }}></i></span>
                </div>
                <ul className="station-details-container">
                    <li className="details-header">
                        <div style={{ width: '12px' }}>#</div>
                        <div style={{ width: '30vw' }}>TITLE</div>
                        {/* <div>Album</div> */}
                        <div style={{ width: '15vw' }}>DATE ADDED</div>
                        <div style={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>🕞</div>
                    </li>
                    {
                        currStation.songs.map((song, idx) => {
                            return <li className="song-container" id={song.videoId} onDoubleClick={() => dispatch(setCurrSong(song))}>
                                <div style={{ width: '14px' }}>{idx + 1}</div>
                                <div className="song-img-title" >
                                    <img src={song.snippet.thumbnails.default.url} style={{ width: '50px', height: '50px' }} />
                                    <div className="station-details-song">
                                        {utilService.getAutorName(song) !== getSongName(song) ?
                                            <>
                                                <div>{getSongName(song)}</div>
                                                <div style={{ fontSize: '14px', color: '#B3B3B3' }}>{utilService.getAutorName(song)}</div>
                                            </>
                                            : <div>{getSongName(song)}</div>}
                                    </div>
                                    {/* {song.snippet.title.includes('(') ? <h3>{cutExtraTitle(song.snippet.title)}</h3> : <h3>{song.snippet.title}</h3>} */}
                                </div>
                                {/* {console.log(song.createdAt)} */}
                                <div className="added-at">{utilService.getFormatedDate(new Date(song.createdAt))}</div>
                            </li>
                        })
                    }
                </ul>
            </div>
        </section>
    )
}