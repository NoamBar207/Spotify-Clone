import { useEffect } from "react";
import { useState } from "react";
import { CardCmp } from "../cmps/util.cmps/CardCmp"
import { stationService } from "../services/station.service";
import { useNavigate } from 'react-router-dom'




export function SearchPage() {


    const ganeres = ['Rock', 'Pop', 'Hip-Hop', 'Maccabi', 'Jazz', 'Latin', 'Metal']
    const [stationList,setStationList] = useState({})



    const navigate = useNavigate()
    
    
    useEffect(()=>{
        loadStation()
    })


    const loadStation = async () => {
        try {
            const stations = await stationService.query()
            console.log(stations);
            setStationList(stations)
            // const stateStation = station[0]
            // dispatch(setCurrStation(station[0]))
            // await setStation(stateStation)
        } catch {
            console.error('cannot load Stations')
        }
    }

    return (
        <section className="search-page-container">
            <div>
                <h1 className="search-page-browse-all">Browse all</h1>
            </div>
            {Object.keys(stationList).length ? 
            <div className="search-page-grid">
                {stationList.map(station => {
                    return <CardCmp ganere={station.name} />
                })}
            </div> :<></>
            } 

        </section>
    )
}