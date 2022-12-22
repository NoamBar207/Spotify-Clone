import { useEffect } from "react";
import { useState } from "react";
import { GanereCmp } from "../cmps/util.cmps/GanereCmp"
import { stationService } from "../services/station.service";
import { useNavigate } from 'react-router-dom'
import { AppHeader } from "../cmps/AppHeader";




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
                <AppHeader/>
                <h1 className="search-page-browse-all">Browse all</h1>
            </div>
            {/* {Object.keys(stationList).length ? 
            <div className="search-page-grid">
                {stationList.map(station => {
                    return <GanereCmp station={station} />
                })}
            </div> :<></>
            }  */}

        </section>
    )
}