import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { songService } from "../../services/song.service"
import { stationService } from "../../services/station.service"
import { userService } from "../../services/user.service"
import { utilService } from "../../services/util.service"
import { setCurrStation } from "../../store/actions/station.actions"
import { onUpdateUser } from "../../store/actions/user.action"



export const ThreeDots = ({ song, userStations }) => {

    const [isLiked, setIsLiked] = useState(false)
    const dotsRef = useRef()
    const playlistRef = useRef()
    const dispatch = useDispatch()
    const { currStation } = useSelector((state) => state.stationModule)
    const { currUser } = useSelector((state) => state.userModule)
    const [renderLine, setRenderLine] = useState('Save to your Liked Songs')


    useEffect(() => {
        let isSongLiked = false
        currUser.likedSongs?.forEach(songLiked => {
            if (song.videoId === songLiked.videoId) isSongLiked = true
        })
        setIsLiked(isSongLiked)
        isSongLiked ? setRenderLine('Remove from your Liked Songs') : setRenderLine('Save to your Liked Songs')
    }, [currUser])

    const onThreeDots = (ev, ref) => {
        ev.stopPropagation()
        utilService.toggleModal(ref)
    }

    const onAddSong = async (station) => {
        const newStation = await stationService.addSongToStation(song, station)
        console.log(newStation);
        if (currStation._id === newStation._id) dispatch(setCurrStation(newStation))
        dotsRef.current.classList.toggle('hide')
        playlistRef.current.classList.toggle('hide')
    }

    function toggleModal() {
        dotsRef.current.classList.toggle('hide')
    }
    function toggleModal2(ev) {
        playlistRef.current.classList.toggle('hide')
    }

    const toggleLike = async () => {
        // const song = (!songProp) ? currSong : songProp
        let userReturned = await songService.addSongToLike(song, currUser, isLiked)
        setIsLiked(!isLiked)
        userReturned = await userService.updateUser(userReturned)
        dispatch(onUpdateUser(userReturned))
    }

    return (
        <div className="three-dots-container" onClick={ev => ev.nativeEvent.stopImmediatePropagation()}>
            <span onClick={() => { utilService.toggleModal(dotsRef); utilService.closeModal(playlistRef) }}><i className="fa-solid fa-ellipsis"></i></span>
            <section className='three-dots-modal hide' ref={dotsRef} onClick={ev => ev.stopPropagation()}>
                <button className="three-dots-btn" onClick={toggleLike}>{renderLine}</button>
                <button className="three-dots-btn" onClick={toggleModal2}>Add to playlist</button>
            </section>
            <div className="playlist-modal three-dots-modal hide" ref={playlistRef}>
                {userStations.length && userStations.map(station => {
                    return <button className="three-dots-btn" onClick={() => onAddSong(station)}>{station.name}</button>
                })}
            </div>
        </div >
    )
}