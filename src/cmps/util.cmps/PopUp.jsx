import { useEffect, useRef } from "react"
import { utilService } from "../../services/util.service"



export function PopUpMsg({ txt }) {
    return <section className="pop-up-msg">
        <i class="fa-regular fa-circle-check"></i>
        <span className="txt">{txt}</span>
    </section>
}