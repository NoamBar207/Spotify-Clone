import { useEffect } from "react";
import { useState } from "react";
import { GanereCmp } from "../cmps/util.cmps/GanereCmp";
import { stationService } from "../services/station.service";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../cmps/AppHeader";

export function SearchPage() {
  const ganeres = [
    "Rock",
    "Pop",
    "Hip-Hop",
    "Maccabi",
    "Jazz",
    "Latin",
    "Metal",
  ];
  const [stationList, setStationList] = useState({});

  useEffect(() => {
    loadStation();
  });

  const loadStation = async () => {
    try {
      const stations = await stationService.query();
      setStationList(stations);
    } catch {
      console.error("cannot load Stations");
    }
  };

  return (
    <section className="search-page-container">
      <div>
        <AppHeader />
      </div>
      {/* {Object.keys(stationList).length ? 
            <div className="search-page-grid">
                {stationList.map(station => {
                    return <GanereCmp station={station} />
                })}
            </div> :<></>
            }  */}
    </section>
  );
}
