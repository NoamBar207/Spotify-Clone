import { useEffect, useState } from "react"
import { forumService } from "../../services/forum.service"
import { utilService } from "../../services/util.service"
import { TopicPrev } from "./TopicPrev"




export const AppMenu = ({ menuRef }) => {

    const [check, setCheck] = useState("")
    const [selectedType, setSelectedType] = useState('main-forum')
    const [selectedSubject, setSelectedSubject] = useState({})

    //// 40wv
    const subjects = [
        {
            subjectName: 'Rock',
            cluster: [
                {
                    name: 'Song Recommendations',
                    msgs: [
                        [
                            {
                                createdBy: 'Bar',
                                createdAt: '28.11.2022',
                                // title:'Searching for new rock songs for my playlist',
                                main: 'Hello, I am looking for new songs for my playlist, I love Pink Floyd so I hope for somthing like them',
                                ans: [
                                    {
                                        createdBy: 'Noam',
                                        createdAt: '29.11.2022',
                                        txt: 'Led Zepplin - Wholla lotta love',
                                        likes: 0
                                    }
                                ]
                            }
                        ]
                    ]
                },
                {
                    name: 'Song Search',
                    msgs: []
                },
                {
                    name: 'Upcoming Concerts',
                    msgs: []
                }
            ]
        },
        {
            subjectName: 'Hip-Hop',
            cluster: [
                {
                    name: 'Song Recommendations'
                },
            ]
        },
    ]

    useEffect(() => {

    }, [])

    // const loadSubjects = async () => {
    //     // const mellofyUser = await userService.getById('6383387d22d1c6761ceb374a')
    //     const subjects = await forumService.query()
    //     console.log(subjects);
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

    return (
        <section className="app-menu-container hide" ref={menuRef}>
            <header className="menu-header">
                {/* <button className="closebtn">
                    <i className="fa-solid fa-xmark"></i>
                </button>
                {'main-board' &&
                    <button className="go-back"> <i className="fa fa-angle-left" ></i> </button>
                } */}
                <h3 className="menu-title">title</h3>
            </header>
            <hr className="menu-hr" />
            {Object.keys(selectedSubject).length ? <h1>{selectedSubject.name}</h1> :
                <section className="forum-subject">
                    {subjects.map(subject => {
                        return (<div>
                            <TopicPrev subject={subject} setSelectedSubject={setSelectedSubject} />
                            <hr />
                        </div>)
                    })}
                </section>
            }

        </section >
    )
}