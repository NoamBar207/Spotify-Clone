import { useEffect } from "react"
import { ThreeDots } from "./ThreeDots"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { utilService } from "../../services/util.service"
import { setCurrSong } from "../../store/actions/station.actions"
import { LikeButton } from "./LikeButton"
import { YTService } from "../../services/youtube.service"
import { songService } from "../../services/song.service"
import { uploadService } from "../../services/upload.service"
import { useState } from "react"
import { useParams } from "react-router-dom"



export const StationSong = ({ song, idx }) => {

    const { userStations } = useSelector((state) => state.stationModule)
    const { currUser } = useSelector((state) => state.userModule)
    const dispatch = useDispatch()
    const songId = useParams()
    const [songState, setSongState] = useState(song)

    useEffect(() => {
        if (!songState.duration) {
            const songStateWithDuration = durationCheck(songState.videoId)
        }
        // if(!song.snippet.thumbnails.high.url.includes('cloudinary')) fixImgs()

    }, [])

    const fixImgs = async () => {
        console.log('amount ');
        const resUpload = await uploadService.uploadImg(song.snippet.thumbnails.high.url)
        await songService.updateSong({
            ...song,
            snippet: {
                thumbnails: {
                    high: {
                        url: resUpload.url
                    }
                },
                title: song.snippet.title
            }
        })

    }

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
            <div className="song-num" style={{ width: '14px' }}>{idx + 1}</div>
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
                {/* {!!Object.keys(currUser).length && <LikeButton songProp={song} />} */}
                <LikeButton songProp={song} />
                <div className="song-duration">{song.duration}</div>
                {/* {!!Object.keys(currUser).length &&<ThreeDots song={song} userStations={userStations} />} */}
                <ThreeDots song={song} userStations={userStations} />
            </div>
        </div>
    )
}