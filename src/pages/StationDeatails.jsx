import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { StationHeader } from "../cmps/StationHeader"
import { stationService } from "../services/station.service"
import { onSaveStation, setCurrSong, setCurrStation, setIsPlaying } from "../store/actions/station.actions"
import { useDispatch, useSelector } from "react-redux"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { StationSong } from "../cmps/util.cmps/StationSong"
import { onUpdateUser } from "../store/actions/user.action"
import { socketService, SOCKET_EMIT_UPDATE_STATION } from "../services/socket.service"
import { utilService } from "../services/util.service"
import { userService } from "../services/user.service"


export function StationDeatails() {


    const dispatch = useDispatch()
    const { currSong, isPlaying, currStation } = useSelector((state) => state.stationModule)
    const { currUser } = useSelector((state) => state.userModule)
    const [songsOrder, setSongsOreder] = useState(currStation.songs)
    const [users, setUsers] = useState([])
    const { stationId } = useParams()
    const dotsRef = useRef()
    const usersRef = useRef()

    useEffect(() => {
        socketService.off(SOCKET_EMIT_UPDATE_STATION)
        socketService.on(SOCKET_EMIT_UPDATE_STATION, (station) => {
            dispatch({ type: 'SET_CURR_STATION', station })
        })
        return () => {
            socketService.off(SOCKET_EMIT_UPDATE_STATION)
        }
    }, [])

    useEffect(() => {
        loadStation()
        loadUsers()
        setSongsOreder(currStation.songs)
    }, [currStation])



    const loadStation = async () => {
        try {
            if (!Object.keys(currStation).length) {
                const station = await stationService.getById(stationId)
                await dispatch(setCurrStation(station))
            }
            // const station = await stationService.getById(stationId)
            // await dispatch(setCurrStation(station))

            // // const stateStation = station[0]
            // console.log(station);
            // dispatch(setCurrStation(station))
        } catch {
            console.error('cannot load Stations')
        }
    }

    const loadUsers = async () => {
        const users = await userService.getUsers()
        setUsers(users)
    }

    const cutExtraTitle = (songTitle) => {
        // {
        //     song.snippet.title.includes('(') ? 
        //     const idx = song.snippet.title.indexOf('(') 
        // }/
        //TODO :::: add more chars
        if (songTitle.includes('(')) {
            const idx = songTitle.indexOf('(')
            songTitle = songTitle.slice(0, idx)
        }
        return songTitle
    }

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return
        const newSongOreder = Array.from(songsOrder)
        const [movedSong] = newSongOreder.splice(result.source.index, 1)
        newSongOreder.splice(result.destination.index, 0, movedSong)
        setSongsOreder(newSongOreder)
        const updatedStation = { ...currStation, songs: newSongOreder }
        const newUserOrStation = await stationService.updateStation(updatedStation)
        if (currStation.name === "Liked Songs") dispatch(onUpdateUser(newUserOrStation))
        else dispatch(onSaveStation(newUserOrStation))
    }


    // const getAutorName = (song) => {
    //     // let fullTitle = currSong.snippet.title
    //     // let idxToSplit = 0
    //     // if (fullTitle.includes('-')) {
    //     //     idxToSplit = fullTitle.indexOf('-')
    //     // } 
    //     // if (fullTitle.includes('(')) {
    //     //     let idxOfTitleFinish = fullTitle.indexOf('(')
    //     // } else setSongName(fullTitle.slice(idxToSplit))

    //     let fullTitle = song.snippet.title
    //     let idxToSplit
    //     if (fullTitle.includes('-')) {
    //         idxToSplit = fullTitle.indexOf('-')
    //     }
    //     let authorSong = fullTitle.slice(0, idxToSplit)
    //     return authorSong
    // }


    const onPlay = () => {
        if (!Object.keys(currSong).length) {
            dispatch(setCurrSong(currStation.songs[0]))
        } else {
            if (isPlaying) {
                dispatch(setIsPlaying(false))
            }
            else {
                dispatch(setIsPlaying(true))
            }
        }

    }

    if (!Object.keys(currStation).length) return <h1>Hello</h1>
    return (
        <section className="station-deatils">
            <StationHeader />
            <div className="color-container">
                <div className="play-btn-station">
                    <span onClick={onPlay}><i className="fa-solid fa-circle-play" style={{ width: '56px', height: '56px', color: '#1fdf64' }}></i></span>
                    <div className="three-dots-container" onClick={ev => ev.nativeEvent.stopImmediatePropagation()}>
                        <span onClick={() => { utilService.toggleModal(dotsRef); utilService.closeModal(usersRef) }}><i className="fa-solid fa-ellipsis"></i></span>
                        <section className='three-dots-modal hide' ref={dotsRef} onClick={ev => ev.stopPropagation()}>
                            <button className="three-dots-btn" onClick={() => utilService.toggleModal(usersRef)}>Add listeners</button>
                            <button className="three-dots-btn">Delete playlist</button>
                        </section>
                        <div className="playlist-modal three-dots-modal hide" ref={usersRef}>
                            {users.length && users.map(user => {
                                return <button className="three-dots-btn" onClick={() => userService.toggleStationToUser(user, stationId)}>{user.fullname}</button>
                            })}
                        </div>
                    </div>
                </div>

                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="station-details-container">
                        {provided => (
                            <ul className="station-details-container"  {...provided.droppableProps} ref={provided.innerRef}>
                                {!!songsOrder.length && < li className="details-header">
                                    <div style={{ width: '14px' }}>#</div>
                                    <div style={{ width: '30vw' }}>TITLE</div>
                                    <div style={{ flex: '1' }}>DATE ADDED</div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>🕞</div>
                                </li>}
                                {/* <div>Album</div> */}
                                {!songsOrder.length && <div><h1>Let's find something for your playlist, use our search bar</h1></div>}
                                {songsOrder.map((song, idx) => {
                                    return (
                                        <Draggable key={song.videoId} draggableId={song.videoId} index={idx}>
                                            {(provided) => (
                                                <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <StationSong key={song.videoId} song={song} idx={idx}></StationSong>
                                                    {/* {song.snippet.title.includes('(') ? <h3>{cutExtraTitle(song.snippet.title)}</h3> : <h3>{song.snippet.title}</h3>} */}
                                                </li>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </section >
    )
}