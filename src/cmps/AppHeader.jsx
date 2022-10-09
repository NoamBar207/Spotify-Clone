import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { importService } from '../services/import-img-service';



export const AppHeader = () => {



    return (
        <header className="app-header-container">
            <div className="header-logo">
                logo
            </div>
            <div className="header-home-search">
                <div className='header-home-btn' style={{backgroundImage:`URL(${importService.homePageIcon})`}}>
                </div>
                <div className='header-search-container'>
                    <label className="label-search flex">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            // onChange={onSearchBoard}
                            className="header-search"
                            placeholder="What do you want to listen to?"
                        />
                    </label>
                </div>
            </div>
            <div className="user-icon">
                user Icon
            </div>
        </header>
    )
}

