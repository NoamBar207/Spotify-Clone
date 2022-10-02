import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { StationHeader } from "../cmps/StationHeader"
import { stationService } from "../services/station.service"
import { setCurrSong, setIsPlaying } from "../store/actions/station.actions"
import { MainMenu } from '../cmps/MainMenu'
import { useDispatch, useSelector } from "react-redux"



export function StationDeatails() {


    const dispatch = useDispatch()
    const { currSong, isPlaying } = useSelector((state) => state.stationModule)
    const [station, setStation] = useState({})

    useEffect(() => {
        loadStation()
    }, [])



    const loadStation = async () => {
        try {
            const station = await stationService.query()
            console.log(station);
            const stateStation = station[0]
            await setStation(stateStation)
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


    const CheckFunction = () => {
        station.songs.map(song => {
            console.log(song);
        })
    }

    if(!Object.keys(station).length) return <h1>Hello</h1>
    return (
        <section>
            <StationHeader />

            <ul className="station-details-container">
                <li className="song-container">
                    <h1>#</h1>
                    <h1>Title</h1>
                    {/* <h1>Album</h1> */}
                    <h1>🕞</h1>
                </li>

                {
                    station.songs.map((song, idx) => {
                        return <li className="song-container" id={song.id.videoId} onDoubleClick={()=>dispatch(setCurrSong(song))}>
                            <h1>{idx + 1}</h1>
                            <div className="song-img-title" >
                                <img src={song.snippet.thumbnails.default.url} style={{ width: '45px', height: '45px' }} />
                                {song.snippet.title.includes('(') ? <h3>{cutExtraTitle(song.snippet.title)}</h3> : <h3>{song.snippet.title}</h3>}
                            </div>
                            <h1></h1>
                        </li>
                    })
                }

            </ul>
        </section>
    )
}