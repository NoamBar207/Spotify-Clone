import { useEffect, useState } from "react"
import { forumService } from "../../services/forum.service"
import { socketService } from "../../services/socket.service"
import { utilService } from "../../services/util.service"
import { ChatApp } from "./ChatApp"
import { TopicPrev } from "./TopicPrev"




export const AppMenu = ({ menuRef }) => {

    const [subjects, setSubjects] = useState([])
    const [selectedType, setSelectedType] = useState('main-forum')
    const [selectedSubject, setSelectedSubject] = useState({})
    const [selectedCluster, setSelectedCluster] = useState({})


    useEffect(() => {
        // socketService.off('add-msg')
        // socketService.off('add-qustion')

        socketService.on('add-msg', ({ subject, cluster }) => {
            console.log('add-msg  ** AppMenu');
            loadSubjects()
            if (selectedSubject.subjectName === subject.subjectName) {
                setSelectedSubject(subject)
                if (selectedCluster.name === cluster.name) {
                    setSelectedCluster(cluster)
                }
            }
        })

        socketService.on('add-question', ({ subject, cluster }) => {
            // console.log('hey');
            console.log('add-qustion  ** AppMenu');
            // console.log(cluster);
            loadSubjects()
            if (selectedSubject.subjectName === subject.subjectName) setSelectedSubject(subject)
            if (selectedCluster.name === cluster.name) {
                setSelectedCluster(cluster)
            }
        })

        return () => {
            socketService.off('add-qustion')
            socketService.off('add-msg')
        }
    }, [])

    //// 40wv
    // const subjects = [
    //     {
    //         "clusterName": "Rock",
    //         "cluster": [
    //             {
    //                 "name": "Song Recommendations",
    //                 "msgs": [
    //                     {
    //                         "createdBy": "Bar",
    //                         "createdAt": "28.11.2022",
    //                         "main": "Hello, I am looking for new songs for my playlist, I love Pink Floyd so I hope for somthing like them",
    //                         "ans": [
    //                             {
    //                                 "createdBy": "Noam",
    //                                 "createdAt": "29.11.2022",
    //                                 "txt": "Led Zepplin - Wholla lotta love",
    //                                 "likes": 0
    //                             },
    //                             {
    //                                 "createdBy": "Noam",
    //                                 "createdAt": "16:55",
    //                                 "txt": "The Temptations - Papa Was A Rolling Stone",
    //                                 "likes": 0
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "createdBy": "Bar",
    //                         "createdAt": "27.11.2022",
    //                         "main": "Trying to find a song of Drake with future",
    //                         "ans": [
    //                             {
    //                                 "createdBy": "Noam",
    //                                 "createdAt": "29.11.2022",
    //                                 "txt": "try Life if good",
    //                                 "likes": 0
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "Song Search",
    //                 "msgs": [
    //                     {
    //                         "createdBy": "Bar",
    //                         "createdAt": "27.11.2022",
    //                         "main": "Trying to find a song of Drake with future",
    //                         "ans": [
    //                             {
    //                                 "createdBy": "Noam",
    //                                 "createdAt": "29.11.2022",
    //                                 "txt": "try Life if good",
    //                                 "likes": 0
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "Upcoming Concerts",
    //                 "msgs": []
    //             }
    //         ]
    //     },
    // {
    //     "clusterName": "Hip-Hop",
    //     "cluster": [
    //         {
    //             "name": "Song Recommendations"
    //         }
    //     ]
    // }
    // ]

    useEffect(() => {
        loadSubjects()
    }, [])

    const loadSubjects = async () => {
        // const mellofyUser = await userService.getById('6383387d22d1c6761ceb374a')
        const subjectsFromDb = await forumService.query()
        await setSubjects(subjectsFromDb)
    }

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

    const check1 = (subject) => {
        console.log('hey');
        setSelectedSubject(subject)
    }

    const DynamicCmp = ({ menuRef }) => {
        switch (selectedType) {
            case 'main-forum': {
                return <AppMenu menuRef={menuRef} />
            }
            // case 'chat-app': {
            //     return <TopicPrev/>
            // }
        }
    }

    const onGoBack = () => {
        // setSelectedSubject({})
        setSelectedCluster({})
    }

    const onClose = () => {
        utilService.toggleModal(menuRef)
        setSelectedSubject({})
        setSelectedCluster({})
    }

    return (
        <section className="app-menu-container hide" ref={menuRef}>
            {/* {console.log(Object.keys(selectedSubject).length)} */}
            <header className="menu-header">
                {!!Object.keys(selectedCluster).length && <button onClick={onGoBack} className="go-back"><i className="fa fa-angle-left" ></i></button>}
                <h3 className="menu-title">title</h3>
                <button className="closebtn" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
                {/* <button className="closebtn" onClick={() => {utilService.toggleModal(menuRef)}}><i className="fa-solid fa-xmark"></i></button> */}
            </header>
            <hr className="menu-hr" />
            {!!Object.keys(selectedCluster).length ? <ChatApp subject={selectedSubject} cluster={selectedCluster} /> :
                <section className="forum-subject">
                    {subjects.map(subject => {
                        return (<div>
                            <TopicPrev subject={subject} setSelectedSubject={setSelectedSubject} setSelectedCluster={setSelectedCluster} />
                            <hr />
                        </div>)
                    })}
                </section>
            }

        </section >
    )
}