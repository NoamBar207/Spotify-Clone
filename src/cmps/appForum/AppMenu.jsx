import { useEffect, useState } from "react";
import { forumService } from "../../services/forum.service";
import { socketService } from "../../services/socket.service";
import { utilService } from "../../services/util.service";
import { loadSubjects } from "../../store/actions/forum.action";
import { ChatApp } from "./ChatApp";
import { TopicPrev } from "./TopicPrev";

export const AppMenu = ({ menuRef }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedType, setSelectedType] = useState("main-forum");
  const [selectedSubject, setSelectedSubject] = useState({});
  const [selectedCluster, setSelectedCluster] = useState({});

  // useEffect(() => {
  //     socketService.off('add-msg')
  //     // socketService.off('add-qustion')

  //     socketService.on('add-msg', ({ subject, cluster }) => {
  //         // loadSubjects()
  //         if (selectedSubject.subjectName === subject.subjectName) {
  //             // console.log('add-msg  ** AppMenu',subject);
  //             setSelectedSubject({ ...subject })
  //             if (selectedCluster.name === cluster.name) {
  //                 setSelectedCluster({ ...cluster })
  //             }
  //         }
  //     })

  //     // socketService.on('add-question', ({ subject, cluster }) => {
  //     //     // console.log('hey');
  //     //     console.log('add-qustion  ** AppMenu',subject);
  //     //     console.log(selectedCluster, selectedSubject);
  //     //     loadSubjects()
  //     //     if (selectedSubject.subjectName === subject.subjectName) {

  //     //         // setSelectedSubject({ ...subject })
  //     //         if (selectedCluster.name === cluster.name) {
  //     //             setSelectedCluster({ ...cluster })
  //     //         }
  //     //     }
  //     // })

  //     return () => {
  //         socketService.off('add-qustion')
  //         socketService.off('add-msg')
  //     }
  // }, [])

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async (subjectRecived = null) => {
    // const mellofyUser = await userService.getById('6383387d22d1c6761ceb374a')
    if (subjectRecived) await setSubjects(subjectRecived);
    else {
      const subjectsFromDb = await forumService.query();
      await setSubjects(subjectsFromDb);
    }
  };

  // const loadSubjects = async () => {
  //     // const mellofyUser = await userService.getById('6383387d22d1c6761ceb374a')
  //     const subjectsFromDb = await forumService.query()
  //     await setSubjects(subjectsFromDb)
  // }

  // const onGetStationsByUser = async (user) => {
  //     try {
  //         let userStations = await Promise.all(
  //             user.stations.map(async (id) => {
  //                 const station = await stationService.getById(id)
  //                 return station
  //             })
  //         )
  //         return userStations
  //     } catch (err) {
  //         console.log('Cannot get user subjects ', err);
  //     }
  // }

  const onGoBack = () => {
    setSelectedCluster({});
  };

  const onClose = () => {
    utilService.toggleModal(menuRef);
    setSelectedSubject({});
    setSelectedCluster({});
  };

  return (
    <section className="app-menu-container hide" ref={menuRef}>
      <header className="menu-header">
        {!!Object.keys(selectedCluster).length && (
          <button onClick={onGoBack} className="go-back">
            <i className="fa fa-angle-left"></i>
          </button>
        )}
        <h3 className="menu-title">Mellofy Forum</h3>
        <button className="closebtn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {/* <button className="closebtn" onClick={() => {utilService.toggleModal(menuRef)}}><i className="fa-solid fa-xmark"></i></button> */}
      </header>
      {!!Object.keys(selectedCluster).length ? (
        <ChatApp
          loadSubjects={loadSubjects}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          setSelectedCluster={setSelectedCluster}
          selectedCluster={selectedCluster}
        />
      ) : (
        <section className="forum-subject">
          <div className="forum-subject-header">
            <h5 className="topic-title">Topic</h5>
            {/* <button className="ask-question">ask a question ?</button> */}
          </div>
          {subjects.map((subject) => {
            return (
              <div key={subject._id}>
                <TopicPrev
                  subject={subject}
                  setSelectedSubject={setSelectedSubject}
                  setSelectedCluster={setSelectedCluster}
                />
              </div>
            );
          })}
        </section>
      )}
    </section>
  );
};
