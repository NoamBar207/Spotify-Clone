import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { forumService } from "../../services/forum.service";
import { socketService } from "../../services/socket.service";
import { MsgComp } from "./MsgComp";



export const SelectedMsg = ({ msg, cluster, subject, setSelectedMsg }) => {
    const { currUser } = useSelector((state) => state.userModule)
    const [msgState, setMsgState] = useState('')
    const formRef = useRef()


    // useEffect(()=>{
    //     socketService.setup()
    // },[])

    const handleChange = (ev) => {
        const value = ev.target.value
        setMsgState(value)
    }

    const onSubmit = (ev) => {
        ev.preventDefault()
        const answer = msgFormer()
        forumService.sendMsg(answer, msg, cluster, subject)
        // setSelectedMsg(msg)
        ///service
        socketService.emit('send-msg', { subject, cluster, msg })
        resetForm()
        console.log(answer);
    }

    const resetForm = () => {
        formRef.current.reset()
        setMsgState('')
    }

    const msgFormer = () => {
        return {
            createdBy: Object.keys(currUser).length ? { fullname: currUser.fullname, userId: currUser._id } : { fullname: 'Guest', userId: 'Guest' },
            createdAt: Date.now(),
            likes: [],
            txt: msgState
        }
    }

    return (
        <>
            <section className="selected-msg-container">
                <div className="selected-qustion msg">
                    <span className="by">{msg.createdBy.fullname}:</span>
                    {msg.main}
                    <span className="sent-at">{msg.createdAt}</span>
                </div>
                <div className="ans-container">
                    {msg.ans.map(answer => <MsgComp answer={answer} />)}
                </div>
            </section>
            <div className="form-container">
                <form onSubmit={onSubmit} ref={formRef} className="msg-form">
                    <input onChange={handleChange} placeholder='Add answer'/>
                    <button className="send-form"><i class="fa-solid fa-arrow-right"></i></button>
                </form>
            </div>
        </>
    )
}