import { useNavigate } from "react-router-dom"



export const ResponsiveFooter = () => {
    const navigate = useNavigate()
    
    
    const onHomeClick = () => {
        navigate('/')
    }

    const onSearchClick = () => {
        navigate('/search')
    }

    const onLibraryClick = () => {
        navigate('/library')
    }

    return (
        <section className="responsive-footer-container" >
            <div className="responsive-footer-button" onClick={onLibraryClick}><span><i className="fa-solid fa-book"></i>Library</span></div>
            <div className="responsive-footer-button" onClick={onSearchClick}><span><i className="fa-solid fa-magnifying-glass"></i>Search</span></div>
            <div className="responsive-footer-button" onClick={onHomeClick}><span><i class="fa-solid fa-house"></i>Home</span></div>
        </section>
    )
}