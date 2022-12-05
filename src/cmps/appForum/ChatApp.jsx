import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { forumService } from "../../services/forum.service"
import { socketService } from "../../services/socket.service"
import { SelectedMsg } from "./SelectedMsg"



export const ChatApp = ({ subject, cluster }) => {

    const [selectedMsg, setSelectedMsg] = useState({})
    const formRef = useRef()
    const { currUser } = useSelector((state) => state.userModule)
    const [questionState, setQuestionState] = useState('')

    useEffect(() => {
        socketService.off('add-msg')
        socketService.on('add-msg', ({ msg }) => {
            console.log('add-msg  ** chatapp');
            if (msg && selectedMsg?.main === msg?.main) setSelectedMsg(msg)
        })

        return () => {
            socketService.off('add-msg',)
        }
    })

    const onGoBack = async () => {
        await setSelectedMsg({})
    }

    const handleChange = (ev) => {
        const value = ev.target.value
        setQuestionState(value)
    }

    const resetForm = () => {
        formRef.current.reset()
        setQuestionState('')
    }

    const questionFormer = () => {
        return {
            createdBy: Object.keys(currUser).length ? { fullname: currUser.fullname, userId: currUser._id } : { fullname: 'Guest', userId: 'Guest' },
            createdAt: Date.now(),
            main: questionState,
            ans: []
        }
    }

    const onSubmit = (ev) => {
        ev.preventDefault()
        const question = questionFormer()
        console.log(question);
        if (question.main.length > 5 && Object.keys(currUser).length) {
            forumService.addQuestion(question, cluster, subject)
            socketService.emit('send-question', { subject, cluster, question })
            resetForm()
        }
    }

    return (
        <section className="chat-app-container">
            <div className="chat-app-title">
                {!!Object.keys(selectedMsg).length && <button onClick={onGoBack} className="go-back"><i className="fa fa-angle-left" ></i></button>}
                <h1 className="cluster-name">{cluster.name}</h1>
            </div>
            <hr />
            <main className="msgs-container">
                <div className="questions-container">
                    {!Object.keys(selectedMsg).length ? cluster.msgs.map(msg => {
                        return (
                            <>
                                <div className="question" onClick={() => setSelectedMsg(msg)}>
                                    <div>{msg.main}</div>
                                </div>
                                <hr />
                            </>
                        )
                    }) : <SelectedMsg msg={selectedMsg} setSelectedMsg={setSelectedMsg} cluster={cluster} subject={subject} />
                    }
                </div>
                {!!(!Object.keys(selectedMsg).length && Object.keys(currUser).length) && <div className="form-container">
                    <form className="msg-form" ref={formRef} onSubmit={onSubmit}>
                        <input onChange={handleChange} placeholder='Add question' />
                        <button className="send-form"><i class="fa-solid fa-arrow-right"></i></button>
                    </form>
                </div>}

            </main>
            {/* <pre>{subject}</pre> */}
        </section>
    )
}