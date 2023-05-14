import { useEffect, useRef } from "react";
import { utilService } from "../../services/util.service";

export const SongTitleAuthor = ({ song }) => {
  const titleRef = useRef();
  const authorRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (titleRef.current.clientWidth > containerRef.current.clientWidth)
      titleRef.current.classList.add("animate-text");
    else titleRef.current.classList.remove("animate-text");
    if (authorRef.current.clientWidth > containerRef.current.clientWidth)
      authorRef.current.classList.add("animate-text");
    else authorRef.current.classList.remove("animate-text");
  }, [song]);
  return (
    <div className="title-autor" ref={containerRef}>
      <div className="title">
        <span style={{ display: "inline-block" }} ref={titleRef}>
          {utilService.getSongName(song)}
        </span>
      </div>
      <div className="autor">
        <span style={{ display: "inline-block" }} ref={authorRef}>
          {utilService.getAutorName(song)}
        </span>
      </div>
    </div>
  );
};
