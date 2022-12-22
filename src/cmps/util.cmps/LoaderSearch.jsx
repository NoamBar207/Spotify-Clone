import { useEffect, useState } from 'react'
import { Bars, MagnifyingGlass } from 'react-loader-spinner'
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


export const LoaderSearch = () => {

    // const [innerWidthState, setInnerWidthState] = useState(window.innerWidth)

    // useEffect(()=>{
    //     setInnerWidthState(innerWidthState)
    // },[window.innerWidth])

    return (
        <div className='loader-search-container'>
            <div>Waiting for your search...</div>
            {window.innerWidth>480 ? 
            <Bars
            height="100"
            width="150"
            color="lightgreen"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            />:
            <Bars
            height="100%"
            width="200px"
            color="lightgreen"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            />
        }
        </div>
    )
}