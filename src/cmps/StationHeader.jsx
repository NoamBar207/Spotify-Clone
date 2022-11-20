import { useEffect, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { onSaveStation } from "../store/actions/station.actions"



export function StationHeader() {


    const { currStation } = useSelector((state) => state.stationModule)
    const { currUser } = useSelector((state) => state.userModule)
    const [stationName, setStationName] = useState(currStation.name)
    const dispatch = useDispatch()

    useEffect(() => {
        setStationName(currStation.name)
    }, [currStation])

    const handleChange = (ev) => {
        const value = ev.target.value
        dispatch(onSaveStation({ ...currStation, name: value }))
    }

    return (
        <section className="station-header-container">
            <div className="station-header-img">
                {currStation.stationImg ?
                    <img src={currStation.stationImg} alt="" />
                    : <div className="station-header-no-pic"><i class="fa-solid fa-music"></i></div>}
            </div>
            <div className="station-header-deatails">
                <h1 className="playlist">PLAYLIST</h1>
                {currUser._id === currStation.createdBy ?
                    <DebounceInput
                        className="station-header"
                        value={stationName}
                        // value={currStation.name}
                        name="title"
                        minLength={5}
                        type="text"
                        debounceTimeout={2000}
                        onChange={handleChange}
                    /> :
                    <h1 className="station-header">
                        {currStation.name}
                    </h1>
                }
                <div className="user-info">
                    <div>
                        <div className="header-station-user-logo"></div>
                        {currStation.songs.length}
                    </div>
                </div>
            </div>
        </section>
    )
}