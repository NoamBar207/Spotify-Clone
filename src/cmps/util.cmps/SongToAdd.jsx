import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { songService } from "../../services/song.service"
import { utilService } from "../../services/util.service"
import { setCurrSong, setIsPlaying } from "../../store/actions/station.actions"



export const SongToAdd = ({ isSearchYotube, song }) => {

    const { currSong, isPlaying, currStation } = useSelector((state) => state.stationModule)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('aaaa', song);
    }, [])

    const onSelectSong = async () => {
        if (isSearchYotube) {
            dispatch(setIsPlaying(false))
            dispatch(setCurrSong(song))
            await songService.addSong(song)
        } else {
            dispatch(setIsPlaying(false))
            dispatch(setCurrSong(song))
        }
    }




    return (
        <section className="search-result" onDoubleClick={onSelectSong}>
            <div className="search-result-img">
                <img src={song.snippet.thumbnails.high.url} style={{ width: '56px', height: '56px' }} />
            </div>
            <div className="title-autor">
                <div className="title">{utilService.getSongName(song)}</div>
                <div className="autor">{utilService.getAutorName(song)}</div>
            </div>
            {isSearchYotube && <div className="actions">
                <button className="add-song-btn">Add Now</button>
            </div>}
        </section >
    )
}