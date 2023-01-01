import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { forumService } from "../../services/forum.service"
import { socketService } from "../../services/socket.service"
import { utilService } from "../../services/util.service"
import { PopUpMsg } from "../util.cmps/PopUp"



export const MsgComp = ({ answer, selectedMsg, cluster, subject, isByDate, popUpRef }) => {

    const { currUser } = useSelector((state) => state.userModule)
    const [likesState, setLikesState] = useState([...answer.likes])


    const imgStyle = answer.createdBy?.imgUrl ? answer.createdBy?.imgUrl : 'https://res.cloudinary.com/noambar/image/upload/v1659384875/iwskowuhnzzcn2yjrf6e.png'

    const onLikeClick = async () => {
        if (Object.keys(currUser).length) {
            const ans = await forumService.addLikeToAnswer(answer, currUser._id, selectedMsg, cluster, subject)
            setLikesState([...ans.likes])
            socketService.emit('like-change', { answer, selectedMsg, cluster, subject })
        }
        else utilService.onLoadPopUp(popUpRef)
    }

    useEffect(() => {
        setLikesState([...answer.likes])
    }, [isByDate])



    return (
        <>
            {(Object.keys(currUser).length && answer.createdBy.userId === currUser._id) ?
                <div className='by-curr-user msg-container'>
                    <div className="user-logo"
                        style={{
                            background: `url(${imgStyle}) center center/cover`,
                            height: '35px',
                            width: '35px',
                            borderRadius: '20px',
                        }}></div>
                    {/* <div className="user-img-msg" style={{background:`url(${})`}}></div> */}
                    <div className="answer by-user msg">
                        <span className="by">{answer.createdBy.fullname}:</span>
                        {answer.txt}
                        <span className="sent-at">{utilService.getFormatedDateWithTime(new Date(answer.createdAt))}</span>
                    </div>
                </div> :
                <div className="answer-container">
                    <div className="answer-like-div">
                        {likesState.includes(currUser._id) && <span className="thumbs-up" onClick={onLikeClick} style={{ color: 'greenyellow' }}><i class="fa-solid fa-thumbs-up"></i></span>}
                        {!likesState.includes(currUser._id) && <span className="thumbs-up" onClick={onLikeClick}><i class="fa-solid fa-thumbs-up"></i></span>}
                        <span className="likes-length">{likesState.length}</span>
                    </div>
                    < div className="answer msg">
                        <span className="by">{answer.createdBy.fullname}:</span>
                        {answer.txt}
                        <span className="sent-at">{utilService.getFormatedDateWithTime(new Date(answer.createdAt))}</span>
                    </div>
                    <div className="user-logo"
                        style={{
                            background: `url(${imgStyle}) center center/cover`,
                            height: '35px',
                            width: '35px',
                            borderRadius: '20px',
                        }}></div>
                    <div className="pop-up-container"></div>
                </div>
            }
        </>
    )
}