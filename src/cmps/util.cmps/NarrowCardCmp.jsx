import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setCurrStation } from "../../store/actions/station.actions"



export function NarrowCardCmp({station}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const onStationClick = ()=>{
        dispatch(setCurrStation(station))
        navigate(`/station/likedsongs`)
    }

    return (
        !station.name?.includes("Playlist") && <div className="narrow-card-container" onClick={onStationClick}>
            <div className="narrow-card-img" style={{ background:`url(${station.stationImg}) center center/cover` }} />
            <h3>{station.name}</h3>
            <div className="play-btn-narrow-card">
                <span><i className="fa-solid fa-circle-play" style={{ width: '56px', height: '56px', color: '#1fdf64' }}></i></span>
            </div>
        </div>
    )
}