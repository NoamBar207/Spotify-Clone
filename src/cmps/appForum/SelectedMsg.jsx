import { Switch } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { forumService } from "../../services/forum.service";
import { socketService } from "../../services/socket.service";
import { utilService } from "../../services/util.service";
import { MsgComp } from "./MsgComp";



export const SelectedMsg = ({ selectedMsg, cluster, setSelectedCluster, subject, setSelectedMsg, loadSubjects }) => {
    const { currUser } = useSelector((state) => state.userModule)
    const [msgState, setMsgState] = useState('')
    const formRef = useRef()
    const [ansArr, setAnsArr] = useState([...selectedMsg.ans])
    const [isByDate, setIsByDate] = useState(true)
    const imgStyle = selectedMsg.createdBy?.imgUrl ? selectedMsg.createdBy?.imgUrl : 'https://res.cloudinary.com/noambar/image/upload/v1659384875/iwskowuhnzzcn2yjrf6e.png'



    useEffect(() => {
        socketService.off('add-msg')
        socketService.off('add-like')


        socketService.on('add-msg', (obj) => {
            if (selectedMsg && obj.selectedMsg?._id === selectedMsg?._id) {
                console.log('add-msg  ** chatapp', selectedMsg, obj);
                // console.log('add-selectedMsg  ** chatapp', selectedMsg);
                setSelectedMsg({ ...obj.selectedMsg })
            }
        })

        socketService.on('add-like', (obj) => {
            // console.log('like-change  ** selected-msg', obj);
            if (selectedMsg && obj.selectedMsg?._id === selectedMsg?._id) {
                console.log('likeChange-selectedMsg', selectedMsg);
                setSelectedMsg({...obj.selectedMsg})
            }
        })

        return () => {
            socketService.off('add-msg',)
            socketService.off('add-like')
        }
    }, [])


    useEffect(() => {
        setAnsArr([...selectedMsg.ans])
    }, [selectedMsg])

    const sortArr = (arr) => {
        const sortedAns = arr.sort((firstItem, secondItem) => secondItem.likes.length - firstItem.likes.length)
        // console.log(sortedAns);
        setAnsArr(sortedAns)
        // const sortedArr = { ...selectedMsg, ans:[]}
    }

    const onFilterBy = () => {
        if (isByDate) {
            setIsByDate(false)
            sortArr(ansArr)
        } else {
            setIsByDate(true)
            setAnsArr([...selectedMsg.ans])
        }
    }


    const handleChange = (ev) => {
        const value = ev.target.value
        setMsgState(value)
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        const answer = msgFormer()
        const objectFromBack = await forumService.sendMsg(answer, selectedMsg, cluster, subject)
        setSelectedMsg(objectFromBack.question)
        setSelectedCluster({ ...cluster, msgs: objectFromBack.msgsToReturn })
        loadSubjects()
        socketService.emit('send-msg', { subject, cluster, selectedMsg:objectFromBack.question })
        resetForm()
    }

    const resetForm = () => {
        formRef.current.reset()
        setMsgState('')
    }

    const msgFormer = () => {
        return {
            createdBy: Object.keys(currUser).length ? { fullname: currUser.fullname, userId: currUser._id, imgUrl: currUser.imgUrl } : { fullname: 'Guest', userId: 'Guest' },
            createdAt: Date.now(),
            likes: [],
            txt: msgState
        }
    }

    return (
        <>
            <section className="selected-msg-container">
                <div className="filter-by-msg">
                    <span>Select Filter:</span>
                    <div className="switch-msg">
                        <span className="thumbs-up"><i class="fa-solid fa-thumbs-up"></i></span>
                        <Switch size="small" defaultChecked onClick={() => { setIsByDate(!isByDate); onFilterBy() }} />
                        <span><i class="fa-solid fa-calendar-days"></i></span>
                    </div>
                </div>
                {/* {isByDate ? <button onClick={onFilterBy}>Sort By Like</button> : <button onClick={onFilterBy}>Sort By Date</button>} */}
                <div className="msg-container">
                    <div className="user-logo"
                        style={{
                            background: `url(${imgStyle}) center center/cover`,
                            height: '35px',
                            width: '35px',
                            borderRadius: '20px',
                        }}></div>
                    <div className="selected-question msg">
                        <span className="by">{selectedMsg.createdBy.fullname}:</span>
                        {selectedMsg.main}
                        <span className="sent-at">{utilService.getFormatedDateWithTime(new Date(selectedMsg.createdAt))}</span>
                    </div>
                </div>
                <div className="ans-container">
                    {ansArr.map(answer => <MsgComp answer={answer} selectedMsg={selectedMsg} cluster={cluster} subject={subject} isByDate={isByDate} />)}
                </div>
            </section>
            <div className="form-container">
                <form onSubmit={onSubmit} ref={formRef} className="msg-form">
                    <input onChange={handleChange} placeholder='Add answer' />
                    <button className="send-form"><i class="fa-solid fa-arrow-right"></i></button>
                </form>
            </div>
        </>
    )
}