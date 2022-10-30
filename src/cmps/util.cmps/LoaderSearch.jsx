import { useEffect } from 'react'
import { Bars, MagnifyingGlass } from 'react-loader-spinner'
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


export const LoaderSearch = () => {

    return (
        <div className='loader-search-container'>
            Waiting for your search...
            <Bars
                height="100"
                width="150"
                color="lightgreen"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    )
}