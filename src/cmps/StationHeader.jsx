import { useEffect, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { stationService } from "../services/station.service"
import { userService } from "../services/user.service"
import { onSaveStation } from "../store/actions/station.actions"



export function StationHeader() {


    const { currStation } = useSelector((state) => state.stationModule)
    const { currUser } = useSelector((state) => state.userModule)
    const [stationName, setStationName] = useState(currStation.name)
    const dispatch = useDispatch()
    const [stationCreator, setStationCreator] = useState({})

    useEffect(() => {
        setStationName(currStation.name)
        if (currStation.createdBy) getCreator()
        else setStationCreator({ fullname: 'Mellofy', imgUrl: '' })
        console.log('station header');
        // stationService.getStationDuration(currStation.songs)
        //////// ADD IMG URL
    }, [currStation])

    const handleChange = (ev) => {
        const value = ev.target.value
        dispatch(onSaveStation({ ...currStation, name: value }))
    }

    const getCreator = async () => {
        const creatorStation = await userService.getById(currStation.createdBy)
        setStationCreator(creatorStation)
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
                        <div className="header-station-user-logo">{stationCreator.fullname}</div>
                        <div>{currStation.songs.length}</div>
                        <div>{currStation.duration}</div>
                    </div>
                </div>
            </div>
        </section>
    )
}