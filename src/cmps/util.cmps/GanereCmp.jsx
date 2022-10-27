import { useNavigate } from 'react-router-dom'


export function GanereCmp({ station }) {


    const navigate = useNavigate()


    const onStationPick =()=>{
        // navigate(`/station/${station._id}`)
        navigate(`/station`)
    }

    return (
        !station.name.includes("Playlist") && <section className="ganere-container-grid" onClick={onStationPick}>
            <section className="ganere-container-main">
                <div className="ganere-title">
                    {station.name}
                </div>
                <div className="ganere-pic">
                    PicHere
                </div>

            </section>
        </section>
    )
}