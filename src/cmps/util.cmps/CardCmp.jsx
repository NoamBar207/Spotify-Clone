import { useNavigate } from 'react-router-dom'


export function CardCmp({ ganere }) {


    const navigate = useNavigate()


    const onGanerePick =()=>{
        // navigate(`/station/${station._id}`)
        navigate(`/station`)
    }

    return (
        <section className="card-container-grid" onClick={onGanerePick}>
            <section className="card-container-main">
                <div className="card-title">
                    {ganere}
                </div>
                <div className="card-pic">
                    PicHere
                </div>

            </section>
        </section>
    )
}