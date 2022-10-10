import React from 'react';
import { HashRouter, HashRouter as Router, Route, Routes } from 'react-router-dom'
import { AppFooter } from './cmps/AppFooter'
import { MainMenu } from './cmps/MainMenu';
import { Home } from './pages/Home'
import { StationDeatails } from './pages/StationDeatails';
import { AppHeader } from './cmps/AppHeader';
import { SearchPage } from './pages/SearchPage';


function App() {

	return (
		// <Router>
		// 	<div className="App">
		// 		<Routes>
		// 			<Route path="/boards/:boardId" element={<BoardDeatails />}>
		// 				<Route path="/boards/:boardId/:taskId" element={<TaskDetails />} />
		// 			</Route>

		// 			<Route path="/boards" element={<BoardList />} />
		// 			<Route path="/signup" element={<Signup />} />
		// 			<Route path="/login" element={<Login />} />
		// 			<Route path="/" element={<Home />} />
		// 		</Routes>
		// 	</div>
		// </Router>
		<HashRouter>
			<div className='App'>
				<AppHeader />
				<MainMenu />
				<Routes>
					<Route path='/station' element={<StationDeatails />} />
					<Route path='/' element={<SearchPage />} />
					{/* <Route path='/' element={<Home />} /> */}
				</Routes>
				<AppFooter />	
			</div>
		</HashRouter>
	)
}

export default App