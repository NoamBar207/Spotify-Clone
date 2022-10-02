import { Link } from "react-router-dom"
import { importService } from "../services/import-img-service"


export const MainMenu = () => {


    return (
        <section className="main-menu-container">
            <h1>Hello From Menu</h1>
            <Link className="menu-link"><img className="menu-pic" src={importService.homePageIcon} style={{ height: '24px', width: '24px' }} />Home</Link>
            <Link className="menu-link"><img src={importService.searchIcon} style={{ height: '24px', width: '24px' }}/>Search</Link>
            <Link className="menu-link"><img src={importService.libraryIcon} style={{ height: '24px', width: '24px' }}/>Library</Link>
        </section>
    )
}