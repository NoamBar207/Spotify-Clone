import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { songService } from "../../services/song.service"
import { userService } from "../../services/user.service"
import { onUpdateUser } from "../../store/actions/user.action"
import { setLikedSongsUser } from "../../store/actions/station.actions";



export const LikeButton = ({ songProp = null }) => {

    const [isLiked, setIsLiked] = useState(false)
    const { currSong } = useSelector((state) => state.stationModule)
    const { currUser } = useSelector((state) => state.userModule)
    const dispatch = useDispatch()


    useEffect(() => {
        const songRecived = (!songProp) ? currSong : songProp
        let isSongLiked = false
        currUser.likedSongs?.forEach(song => {
            if (song.videoId === songRecived.videoId) isSongLiked = true
        })
        setIsLiked(isSongLiked)
        // if (!songProp) {
        //     let isSongLiked = false
        //     currUser.likedSongs?.forEach(song => {
        //         if (song.videoId === currSong.videoId) isSongLiked = true
        //     })
        //     setIsLiked(isSongLiked)
        // } else {
        //     let isSongLiked = false
        //     currUser.likedSongs?.forEach(song => {
        //         if (song.videoId === songProp.videoId) isSongLiked = true
        //     })
        //     setIsLiked(isSongLiked)
        // }
    }, [currUser])

    const getLikedSongsUser = async (userReturned) => {
        await dispatch(setLikedSongsUser(userReturned))
    }

    const toggleLike = async (ev) => {
        ev.stopPropagation()
        const song = (!songProp) ? currSong : songProp
        let userReturned = await songService.addSongToLike(song, currUser, isLiked)
        setIsLiked(!isLiked)
        userReturned = await userService.updateUser(userReturned)
        await dispatch(onUpdateUser(userReturned))
        await getLikedSongsUser(userReturned)
    }

    return (
        <div className='heart-symbol'>
            {isLiked && <span onClick={(ev) => { toggleLike(ev) }} style={{ color: 'green' }}><i class="fa-solid fa-heart"></i></span>}
            {!isLiked && <span onClick={(ev) => { toggleLike(ev) }}><i class="fa-regular fa-heart"></i></span>}
        </div>
    )
}