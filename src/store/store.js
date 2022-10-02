import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
// import { boardReducer } from "./reducers/boardReducer";
// import { userReducer } from "./reducers/userReducer";
import { stationReducer } from "./reducers/stationReducer";
import { playerReducer } from "./reducers/playerReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose


const rootReducer = combineReducers({
    // userModule: userReducer,
    stationModule: stationReducer,
    playerModule: playerReducer,
})

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

window.myStore = store