import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { forumService } from "../../services/forum.service";
import { socketService } from "../../services/socket.service";
import { utilService } from "../../services/util.service";
import { PopUpMsg } from "../util.cmps/PopUp";
import { SelectedMsg } from "./SelectedMsg";

export const ChatApp = ({
  selectedSubject,
  selectedCluster,
  setSelectedSubject,
  setSelectedCluster,
  loadSubjects,
}) => {
  const [selectedMsg, setSelectedMsg] = useState({});
  const formRef = useRef();
  const { currUser } = useSelector((state) => state.userModule);
  const [questionState, setQuestionState] = useState("");
  const imgStyle = selectedMsg.createdBy?.imgUrl
    ? selectedMsg.createdBy?.imgUrl
    : "https://res.cloudinary.com/noambar/image/upload/v1659384875/iwskowuhnzzcn2yjrf6e.png";
  const popUpRef = useRef();

  useEffect(() => {
    socketService.off("add-msg");
    socketService.off("add-qustion");
    socketService.off("add-like");

    socketService.on("add-msg", ({ subject, cluster }) => {
      if (selectedSubject.subjectName === subject.subjectName) {
        // console.log('add-msg  ** AppMenu',subject);
        setSelectedSubject({ ...subject });
        if (selectedCluster.name === cluster.name) {
          setSelectedCluster({ ...cluster });
        }
      } else loadSubjects();
    });

    socketService.on("add-question", (obj) => {
      // console.log('hey');
      console.log("add-qustion  ** AppMenu", obj);
      console.log(selectedCluster, selectedSubject);
      if (selectedSubject._id === obj.selectedSubject._id) {
        loadSubjects();
        // setSelectedSubject({ ...subject })
        if (selectedCluster._id === obj.clusterFromBack._id) {
          setSelectedCluster({ ...obj.clusterFromBack });
        }
      } else loadSubjects();
    });

    socketService.on("add-like", (obj) => {
      // console.log('like-change  ** selected-msg', obj);
      if (selectedSubject && obj.subject?._id === selectedSubject?._id) {
        setSelectedSubject({ ...obj.subject });
        if (selectedCluster && obj.cluster?._id === selectedCluster?._id) {
          setSelectedCluster({ ...obj.cluster });
        }
      } else loadSubjects();
    });

    return () => {
      socketService.off("add-qustion");
      socketService.off("add-msg");
      socketService.off("add-like");
    };
  }, []);

  useEffect(() => {
    console.log(Object.keys(currUser).length);
    if (!Object.keys(currUser).length) utilService.onLoadPopUp(popUpRef);
  }, []);

  const onGoBack = async () => {
    setSelectedMsg({});
    // setSelectedCluster({})
  };

  const handleChange = (ev) => {
    const value = ev.target.value;
    setQuestionState(value);
  };

  const resetForm = () => {
    formRef.current.reset();
    setQuestionState("");
  };

  const questionFormer = () => {
    return {
      createdBy: Object.keys(currUser).length
        ? {
            fullname: currUser.fullname,
            userId: currUser._id,
            imgUrl: currUser.imgUrl,
          }
        : { fullname: "Guest", userId: "Guest" },
      createdAt: Date.now(),
      main: questionState,
      ans: [],
    };
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const question = questionFormer();
    let clusterFromBack = null;
    if (question.main.length > 1 && Object.keys(currUser).length) {
      clusterFromBack = await forumService.addQuestion(
        question,
        selectedCluster,
        selectedSubject
      );
      setSelectedCluster(clusterFromBack);
      loadSubjects();
      socketService.emit("send-question", {
        selectedSubject,
        clusterFromBack,
        question,
      });
      resetForm();
    }
  };

  return (
    <section className="chat-app-container">
      <div className="chat-app-title">
        {!!Object.keys(selectedMsg).length && (
          <button onClick={onGoBack} className="go-back">
            <i className="fa fa-angle-left"></i>
          </button>
        )}
        <h1 className="cluster-name">{selectedCluster.name}</h1>
      </div>
      <main className="msgs-container">
        <div className="questions-container">
          {!Object.keys(selectedMsg).length ? (
            selectedCluster.msgs.map((msg) => {
              return (
                <div
                  className="question-container"
                  onClick={() => setSelectedMsg(msg)}
                >
                  <div className="question">
                    {msg.createdBy?.imgUrl ? (
                      <div
                        className="user-logo"
                        style={{
                          background: `url(${msg.createdBy.imgUrl}) center center/cover`,
                          height: "35px",
                          width: "35px",
                          borderRadius: "20px",
                        }}
                      ></div>
                    ) : (
                      <div
                        className="user-logo"
                        style={{
                          background: `url(https://res.cloudinary.com/noambar/image/upload/v1659384875/iwskowuhnzzcn2yjrf6e.png) center center/cover`,
                          height: "35px",
                          width: "35px",
                          borderRadius: "20px",
                        }}
                      ></div>
                    )}
                    <div className="question-main">{msg.main}</div>
                  </div>
                  <span className="question-created-add">
                    {utilService.getFormatedDateWithTime(
                      new Date(msg.createdAt)
                    )}
                  </span>
                  {/* <hr /> */}
                </div>
              );
            })
          ) : (
            <SelectedMsg
              selectedMsg={selectedMsg}
              setSelectedMsg={setSelectedMsg}
              cluster={selectedCluster}
              setSelectedCluster={setSelectedCluster}
              subject={selectedSubject}
              loadSubjects={loadSubjects}
            />
          )}
        </div>
        {!!(
          !Object.keys(selectedMsg).length && Object.keys(currUser).length
        ) ? (
          <div className="form-container">
            <form className="msg-form" ref={formRef} onSubmit={onSubmit}>
              <input onChange={handleChange} placeholder="Add question" />
              <button className="send-form">
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>
        ) : (
          <div className="pop-up-container" ref={popUpRef}>
            <PopUpMsg txt={"Login or Sign-up to add question"} />
          </div>
        )}
      </main>
      {/* <pre>{subject}</pre> */}
    </section>
  );
};
