import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { songService } from "../../services/song.service"
import { userService } from "../../services/user.service"
import { onUpdateUser } from "../../store/actions/user.action"



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


    const toggleLike = async () => {
        const song = (!songProp) ? currSong : songProp
        let userReturned = await songService.addSongToLike(song, currUser, isLiked)
        setIsLiked(!isLiked)
        userReturned = await userService.updateUser(userReturned)
        dispatch(onUpdateUser(userReturned))
    }

    return (
        <div className='heart-symbol'>
            {isLiked && <span onClick={toggleLike} style={{ color: 'green' }}><i class="fa-solid fa-heart"></i></span>}
            {!isLiked && <span onClick={toggleLike}><i class="fa-regular fa-heart"></i></span>}
        </div>
    )
}