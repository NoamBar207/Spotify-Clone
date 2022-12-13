import { useRef, useState } from "react"
import { utilService } from "../../services/util.service"




export const TopicPrev = ({ subject, setSelectedSubject, setSelectedCluster }) => {
    const clusterRef = useRef()

    return (
        <section className="subject-container">
            <div className='subject-name' onClick={() => utilService.toggleDisplayNone(clusterRef)}>
                <span className="name">{subject.subjectName} </span>
                <span><i class="fa-solid fa-chevron-down"></i></span></div>
            <div className='subject-clusters hide-none' ref={clusterRef}>
                {subject.cluster.map(c => {
                    return <div className='cluster-container' onClick={() => { setSelectedCluster(c); setSelectedSubject(subject)}}>
                        <h4 className="cluster-name">{c.name}</h4>
                    </div>
                })}
            </div>
        </section>
    )
}