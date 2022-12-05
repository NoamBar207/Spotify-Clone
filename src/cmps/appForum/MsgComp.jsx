import { useSelector } from "react-redux"



export const MsgComp = ({ answer }) => {

    const { currUser } = useSelector((state) => state.userModule)

    const onLikeClick = () => {
        if (Object.keys(currUser).length) {
            console.log(answer);
        }
    }


    return (
        <>
            {(Object.keys(currUser).length && answer.createdBy.userId === currUser._id) ?
                < div className="answer by-user msg">
                    <span className="by">{answer.createdBy.fullname}:</span>
                    {answer.txt}
                    <span className="sent-at">{answer.createdAt}</span>
                </div> :
                <div className="answer-container">
                    <span className="thumbs-up" onClick={onLikeClick}><i class="fa-solid fa-thumbs-up"></i></span>
                    < div className="answer msg">
                        <span className="by">{answer.createdBy.fullname}:</span>
                        {answer.txt}
                        <span className="sent-at">{answer.createdAt}</span>
                    </div>
                </div>
            }
        </>
    )
}