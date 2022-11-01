import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { StationHeader } from "../cmps/StationHeader"
import { stationService } from "../services/station.service"
import { setCurrSong, setCurrStation, setIsPlaying } from "../store/actions/station.actions"
import { MainMenu } from '../cmps/MainMenu'
import { useDispatch, useSelector } from "react-redux"
import { utilService } from "../services/util.service"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { StationSong } from "../cmps/util.cmps/StationSong"


export function StationDeatails() {


    const dispatch = useDispatch()
    const { currSong, isPlaying, currStation } = useSelector((state) => state.stationModule)
    const [station, setStation] = useState({})
    const [songsOrder, setSongsOreder] = useState(currStation.songs)
    const { stationId } = useParams()


    useEffect(() => {
        loadStation()
    }, [currStation])



    const loadStation = async () => {
        try {
            if (!Object.keys(currStation).length) {
                const station = await stationService.getById(stationId)
                dispatch(setCurrStation(station))
            }

            // // const stateStation = station[0]
            // console.log(station);
            // dispatch(setCurrStation(station))
        } catch {
            console.error('cannot load Stations')
        }
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

    const handleOnDragEnd = (result) => {
        if (!result.destination) return
        const newSongOreder = Array.from(songsOrder)
        const [movedSong] = newSongOreder.splice(result.source.index, 1)
        newSongOreder.splice(result.destination.index, 0, movedSong)
        setSongsOreder(newSongOreder)
        console.log(newSongOreder);
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
                </div>

                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="station-details-container">
                        {provided => (
                            <ul className="station-details-container"  {...provided.droppableProps} ref={provided.innerRef}>
                                <li className="details-header">
                                    <div style={{ width: '12px' }}>#</div>
                                    <div style={{ width: '30vw' }}>TITLE</div>
                                    <div style={{ width: '15vw' }}>DATE ADDED</div>
                                    <div style={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>🕞</div>
                                </li>
                                {/* <div>Album</div> */}
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
        </section>
    )
}