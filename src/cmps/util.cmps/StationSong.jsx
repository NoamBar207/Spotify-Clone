import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { utilService } from "../../services/util.service"
import { setCurrSong } from "../../store/actions/station.actions"



export const StationSong = ({song, idx}) => {


    const dispatch = useDispatch()
    useEffect(() => {
        console.log(song);
    },[])


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
        </div>
    )
}