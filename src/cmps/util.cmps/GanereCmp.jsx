import { useNavigate } from 'react-router-dom'


export function GanereCmp({ ganere }) {


    const navigate = useNavigate()


    const onGanerePick =()=>{
        // navigate(`/station/${station._id}`)
        navigate(`/station`)
    }

    return (
        <section className="ganere-container-grid" onClick={onGanerePick}>
            <section className="ganere-container-main">
                <div className="ganere-title">
                    {ganere}
                </div>
                <div className="ganere-pic">
                    PicHere
                </div>

            </section>
        </section>
    )
}