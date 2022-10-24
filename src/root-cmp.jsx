import React from 'react'

// const { Switch, Route } = ReactRouterDOM
import { Routes, Route } from 'react-router'

import routes from './routes'

import { AppFooter } from './cmps/AppFooter'
import { MainMenu } from './cmps/MainMenu';
import { AppHeader } from './cmps/AppHeader';


// import { AppHeader } from './cmps/app-header'
// import { AppFooter } from './cmps/app-footer'
// import { UserDetails } from './pages/user-details'

// export class RootCmp extends React.Component {

//     render() {
//         return (
//             <div>
//                 <AppHeader />
//                 <main>
//                     <Routes>
//                         {routes.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}
//                         <Route path="user/:id" element={<UserDetails />} />
//                     </Routes>
//                 </main>
//                 <AppFooter />
//             </div>
//         )
//     }
// }

export function RootCmp() {

    return (
        <div className='root-cmp'>
            <AppHeader />
            <MainMenu />
            <Routes>
                {routes.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}
                {/* <Route path="user/:id" element={<UserDetails />} /> */}
            </Routes>
            <AppFooter />
        </div>
    )
}



