import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ThreeDots } from "../cmps/util.cmps/ThreeDots"
import getAverageColor from 'get-average-color'
import { useNavigate, useParams } from "react-router-dom"
import { songService } from "../services/song.service"
import { setCurrSong } from "../store/actions/station.actions"
import { useDispatch } from "react-redux"



export const SongDeatails = () => {
    const { currSong, isPlaying, currStation, isShuffeld } = useSelector((state) => state.stationModule)
    const navigate = useNavigate()
    const [bgc, setBgc] = useState('#4A3591')
    const { songId } = useParams()
    const dispatch = useDispatch()
    
    useEffect(() => {
        (!Object.keys(currSong).length) ? loadSong() : getAvgColor()
    }, [currSong])
    
    const getAvgColor = async () => {
        if (Object.keys(currSong).length) {
            
            let color = await getAverageColor(currSong.snippet.thumbnails.high.url)
            color = `rgb(${color.r - 10},${color.g - 10}, ${color.b - 10})`
            setBgc(color)
        }
    }
    
    const loadSong = async () => {
        console.log('hey');
        const song = await songService.getById(songId)
        dispatch(setCurrSong(song))
    }


    const onGoBack = () => {
        navigate(`/station/${currStation._id}`)
    }


    if (!Object.keys(currSong).length) return <section className="song-deatails-container">Loadinggggg</section>
    return (
        <section className="song-deatails-container" style={{ background: `linear-gradient(rgba(0,0,0,.6) 0, #121212 80%), ${bgc}` }}>
            <header className="song-deatails-header">
                <ThreeDots song={currSong} />
                <div className="song-deatails-station">Playing Song From {currStation.name} Playlist</div>
                <div className="go-back" onClick={onGoBack}><span><i className="fa fa-angle-left" ></i></span></div>
            </header>
            
            <div className="song-deatails-img"><img alt="" src={currSong.snippet?.thumbnails.high.url} /></div>
        </section>
    )
}   