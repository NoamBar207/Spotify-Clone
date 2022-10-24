// import { HomePage } from './pages/home-page.jsx'
// import { AboutUs } from './pages/about-us.jsx'
// import { CarApp } from './pages/car-app.jsx'
// import { ReviewApp } from './pages/review-app.jsx'
// import { ChatApp } from './pages/chat-app.jsx'
// import { AdminApp } from './pages/admin-app.jsx'


import { HomePage } from './pages/HomePage'
import { StationDeatails } from './pages/StationDeatails';
import { SearchPage } from './pages/SearchPage';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';

// Routes accesible from the main navigation (in AppHeader)
const routes = [
    {
        path: '/',
        component: <HomePage />,
        label: 'Home 🏠',
    },
    {
        path: 'station/:stationId',
        component: <StationDeatails />,
        label: 'Station'
    },
    {
        path: 'search',
        component: <SearchPage />,
        label: 'Search'
    },
    {
        path: 'signup',
        component: <SignUp />,
        label: 'Sign Up'
    },
    {
        path: 'login',
        component: <Login />,
        label: 'Login'
    },
    // {
    //     path: 'chat',
    //     component: <ChatApp />,
    //     label: 'Chat'
    // },
    // {
    //     path: 'about',
    //     component: <AboutUs />,
    //     label: 'About us'
    // },
    // {
    //     path: 'admin',
    //     component: <AdminApp />,
    //     label: 'Admin Only'
    // }
]

export default routes