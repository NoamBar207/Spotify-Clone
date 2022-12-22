import { useEffect } from "react";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { utilService } from "../../services/util.service"
import { setCurrStation } from "../../store/actions/station.actions";


export function CardCmp({ station }) {

    // console.log(station);
    // const { currSong, isPlaying, currStation } = useSelector((state) => state.stationModule)
    const dispatch = useDispatch()
    const [authorsState, setAutorsState] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        infoAutorsGetter()
    }, [])

    // useEffect(() => {
    // console.log(currStation);
    // }, [currStation])

    const infoAutorsGetter = () => {
        station.songs.map((song, idx) => {
            let author = utilService.getAutorName(song)
            // console.log(author);
            if (idx > 3) return
            else if (idx === 0) setAutorsState(author)
            else if (idx < 3 && !authorsState.includes(author)) {
                setAutorsState(prevState => {
                    return prevState + ', ' + author
                })
            }
            else if (idx === 3) setAutorsState(prevState => {
                return prevState + ', and more'
            })
        })
    }

    const onGanerePick = () => {
        dispatch(setCurrStation(station))
        navigate(`/station/${station._id}`)
    }

    return (
        !station.name.includes("Playlist") && <section className="card-container" onClick={onGanerePick}>
            <div className="card-img">
                {/* {station.stationImg ? :<img src={station.songs[0]?.snippet.thumbnails.high.url} /> } */}
                {/* <img src={station.songs[0]?.snippet.thumbnails.high.url} /> */}
                <img src={station.stationImg} />
            </div>
            <div className="card-info">
                <h2 className="card-title">{station.name}</h2>
                {station.renderType === 'byArtist' ?

                    <h4 className="card-autors">{
                        station.name
                    }</h4> :
                    <h4 className="card-autors">{
                        authorsState
                        // station.songs.map((song, idx) => {
                        //     if (idx === 4) return
                        //     return idx < 3 ? utilService.getAutorName(song) + ', ' : ' and more...'
                        // })
                    }</h4>
                }

            </div>
        </section>
    )
}