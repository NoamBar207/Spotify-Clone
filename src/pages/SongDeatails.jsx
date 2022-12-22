import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ThreeDots } from "../cmps/util.cmps/ThreeDots"
import getAverageColor from "get-average-color"
import { useNavigate } from "react-router-dom"



export const SongDeatails = () => {
    const { currSong, isPlaying, currStation, isShuffeld } = useSelector((state) => state.stationModule)
    const navigate = useNavigate()
    const [bgc, setBgc] = useState('#4A3591')
    
    useEffect(()=>{
        getAvgColor()
    },[currSong])
    
    const getAvgColor = async () => {
        let color = await getAverageColor(currSong.snippet.thumbnails.high.url)
        color = `rgb(${color.r - 10},${color.g - 10}, ${color.b - 10})`
        setBgc(color)
    }

    const onGoBack = () =>{
        navigate(`/station/${currStation._id}`)
    }


    return (
        <section className="song-deatails-container" style={{background:`linear-gradient(rgba(0,0,0,.6) 0, #121212 80%), ${bgc}`}}>
            <header className="song-deatails-header">
                <ThreeDots song={currSong} />
                <div className="song-deatails-station">Playing Song From {currStation.name} Playlist</div>
                <div className="go-back" onClick={onGoBack}><span><i className="fa fa-angle-left" ></i></span></div>
            </header>
            <div className="song-deatails-img"><img alt="" src={currSong.snippet.thumbnails.high.url} /></div>
        </section>
    )
}   