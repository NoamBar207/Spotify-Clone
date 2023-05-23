import { Switch } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { forumService } from "../../services/forum.service";
import { socketService } from "../../services/socket.service";
import { utilService } from "../../services/util.service";
import { PopUpMsg } from "../util.cmps/PopUp";
import { MsgComp } from "./MsgComp";

export const SelectedMsg = ({
  selectedMsg,
  cluster,
  setSelectedCluster,
  subject,
  setSelectedMsg,
  loadSubjects,
}) => {
  const { currUser } = useSelector((state) => state.userModule);
  const [msgState, setMsgState] = useState("");
  const formRef = useRef();
  const popUpRef = useRef();
  const [ansArr, setAnsArr] = useState([]);
  const [isByDate, setIsByDate] = useState(false);
  const imgStyle = selectedMsg.createdBy?.imgUrl
    ? selectedMsg.createdBy?.imgUrl
    : "https://res.cloudinary.com/noambar/image/upload/v1659384875/iwskowuhnzzcn2yjrf6e.png";

  useEffect(() => {
    // setAnsArr([...selectedMsg.ans])
    sortArr([...selectedMsg.ans]);
    // utilService.onLoadPopUp(popUpRef)
  }, [selectedMsg]);

  useEffect(() => {
    socketService.off("add-msg");
    socketService.off("add-like");

    socketService.on("add-msg", (obj) => {
      if (selectedMsg && obj.selectedMsg?._id === selectedMsg?._id) {
        setSelectedMsg({ ...obj.selectedMsg });
      }
    });

    socketService.on("add-like", (obj) => {
      if (selectedMsg && obj.selectedMsg?._id === selectedMsg?._id) {
        setSelectedMsg({ ...obj.selectedMsg });
      }
    });

    return () => {
      socketService.off("add-msg");
      socketService.off("add-like");
    };
  }, []);

  const sortArr = (arr) => {
    const sortedAns = arr.sort(
      (firstItem, secondItem) =>
        secondItem.likes.length - firstItem.likes.length
    );
    setAnsArr(sortedAns);
  };

  const onFilterBy = () => {
    if (isByDate) {
      setIsByDate(false);
      sortArr(ansArr);
    } else {
      setIsByDate(true);
      setAnsArr([...selectedMsg.ans]);
    }
  };

  const handleChange = (ev) => {
    const value = ev.target.value;
    setMsgState(value);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const answer = msgFormer();
    const objectFromBack = await forumService.sendMsg(
      answer,
      selectedMsg,
      cluster,
      subject
    );
    setSelectedMsg(objectFromBack.question);
    setSelectedCluster({ ...cluster, msgs: objectFromBack.msgsToReturn });
    loadSubjects();
    socketService.emit("send-msg", {
      subject,
      cluster,
      selectedMsg: objectFromBack.question,
    });
    resetForm();
  };

  const resetForm = () => {
    formRef.current.reset();
    setMsgState("");
  };

  const msgFormer = () => {
    return {
      createdBy: Object.keys(currUser).length
        ? {
            fullname: currUser.fullname,
            userId: currUser._id,
            imgUrl: currUser.imgUrl,
          }
        : { fullname: "Guest", userId: "Guest" },
      createdAt: Date.now(),
      likes: [],
      txt: msgState,
    };
  };

  return (
    <>
      <section className="selected-msg-container">
        <div className="filter-by-msg">
          <span>Select Filter:</span>
          <div className="switch-msg">
            <span>
              <i className="fa-solid fa-calendar-days"></i>
            </span>
            <Switch
              size="small"
              defaultChecked
              onClick={() => {
                setIsByDate(!isByDate);
                onFilterBy();
              }}
            />
            <span className="thumbs-up">
              <i className="fa-solid fa-thumbs-up"></i>
            </span>
          </div>
        </div>
        {/* {isByDate ? <button onClick={onFilterBy}>Sort By Like</button> : <button onClick={onFilterBy}>Sort By Date</button>} */}
        <div className="msg-container">
          <div
            className="user-logo"
            style={{
              background: `url(${imgStyle}) center center/cover`,
              height: "35px",
              width: "35px",
              borderRadius: "20px",
            }}
          ></div>
          <div className="selected-question msg">
            <span className="by">{selectedMsg.createdBy.fullname}:</span>
            {selectedMsg.main}
            <span className="sent-at">
              {utilService.getFormatedDateWithTime(
                new Date(selectedMsg.createdAt)
              )}
            </span>
          </div>
        </div>
        <div className="ans-container">
          {ansArr.map((answer) => (
            <MsgComp
              answer={answer}
              selectedMsg={selectedMsg}
              cluster={cluster}
              subject={subject}
              isByDate={isByDate}
              popUpRef={popUpRef}
            />
          ))}
        </div>
      </section>
      <div className="form-container">
        <form onSubmit={onSubmit} ref={formRef} className="msg-form">
          <input onChange={handleChange} placeholder="Add answer" />
          <button className="send-form">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
        <div
          className="pop-up-container"
          ref={popUpRef}
          style={{ zIndex: "50" }}
        >
          <PopUpMsg txt={"Login or Sign-up to Like a Msg"} />
        </div>
      </div>
    </>
  );
};
