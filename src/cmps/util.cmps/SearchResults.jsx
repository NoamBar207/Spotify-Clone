// import { useState } from "react";
// import { useEffect } from "react";
// import { songService } from "../../services/song.service";
import { SongToAdd } from "./SongToAdd";

export const SearchResults = ({ isSearchYotube, items }) => {
  // const [results, setResults] = useState([])

  // useEffect(() => {
  //   // console.log('Resultsss', items);
  //   // onMount()
  //   console.log(items);
  // }, [items]);

  return (
    <section className="search-results-container">
      {Object.keys(items).length &&
        items.map((song) => (
          <SongToAdd
            isSearchYotube={isSearchYotube}
            song={song}
            key={song._id}
          />
        ))}
    </section>
  );
};
