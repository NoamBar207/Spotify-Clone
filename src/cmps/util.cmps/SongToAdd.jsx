import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { songService } from "../../services/song.service"
import { stationService } from "../../services/station.service"
import { utilService } from "../../services/util.service"
import { setCurrSong, setIsPlaying } from "../../store/actions/station.actions"
import { ThreeDots } from "./ThreeDots"



export const SongToAdd = ({ isSearchYotube, song }) => {

    const { userStations } = useSelector((state) => state.stationModule)
    const dispatch = useDispatch()


    useEffect(() => {
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
            <div className="actions">
                {/* <div className="three-dots-container">
                    <span onClick={(ev) => onThreeDots(ev, dotsRef)}><i className="fa-solid fa-ellipsis"></i></span>
                    <section className='three-dots-modal hide' ref={dotsRef}>
                        <button className="three-dots-btn">Save to your Liked Songs</button>
                        <button className="three-dots-btn" onClick={() => utilService.toggleModal(playlistRef)}>Add to playlist</button>
                    </section>
                    <div className="playlist-modal three-dots-modal hide" ref={playlistRef}>
                        {userStations.length && userStations.map(station => {
                            return <button className="three-dots-btn" onClick={() => onAddSong(station)}>{station.name}</button>
                        })}
                    </div>
                </div> */}
                <ThreeDots song={song} userStations={userStations}/>
                {/* {isSearchYotube && <div>
                    <button className="add-song-btn">Add Now</button>
                </div>} */}
            </div>
        </section >
    )
}