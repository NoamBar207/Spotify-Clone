import { useEffect } from "react"
import { ThreeDots } from "./ThreeDots"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { utilService } from "../../services/util.service"
import { setCurrSong } from "../../store/actions/station.actions"
import { LikeButton } from "./LikeButton"
import { YTService } from "../../services/youtube.service"
import { songService } from "../../services/song.service"



export const StationSong = ({ song, idx }) => {

    const { userStations } = useSelector((state) => state.stationModule)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!song.duration) {
            const songWithDuration = durationCheck(song.videoId)
        }
    }, [])

    const durationCheck = async (videoId) => {
        const duration = await YTService.getSongDuration(videoId)
        let songWithDuration = { ...song, duration }
        songWithDuration = await songService.updateSong(songWithDuration)
        console.log(songWithDuration);
        return songWithDuration
        // console.log(duration);

    }


    return (
        <div className="song-container" onDoubleClick={() => dispatch(setCurrSong(song))}>
            <div style={{ width: '14px' }}>{idx + 1}</div>
            <div className="song-img-title" >
                <img src={song.snippet.thumbnails.high.url} style={{ width: '50px', height: '50px' }} />
                <div className="station-details-song">
                    {utilService.getAutorName(song) !== utilService.getSongName(song) ?
                        <>
                            <div>{utilService.getSongName(song)}</div>
                            <div style={{ fontSize: '14px', color: '#B3B3B3' }}>{utilService.getAutorName(song)}</div>
                        </>
                        : <div>{utilService.getSongName(song)}</div>}
                </div>
                {/* {song.snippet.title.includes('(') ? <h3>{cutExtraTitle(song.snippet.title)}</h3> : <h3>{song.snippet.title}</h3>} */}
            </div>
            {/* {console.log(song.createdAt)} */}
            <div className="added-at">{utilService.getFormatedDate(new Date(song.createdAt))}</div>
            <div className="song-actions">
                <LikeButton songProp={song} />
                <div className="song-duration">{song.duration}</div>
                <ThreeDots song={song} userStations={userStations} />
            </div>
        </div>
    )
}