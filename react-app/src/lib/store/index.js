import { combineReducers, createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
// import { sideBarReducer, categoriesReducer } from "../../features";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { mainReducer } from "./reducer";
const persistConfig = {
    key: "main",
    storage,
};
const rootReducer = combineReducers({
    main: persistReducer(persistConfig, mainReducer),
    // sidebar: sideBarReducer,
    // categories: categoriesReducer,
});

// const persistedReducer =

let enhacers;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    enhacers = applyMiddleware(thunk, createLogger({ collapsed: true }));
} else {
    enhacers = applyMiddleware(thunk);
}

function configureStore() {
    const store = createStore(rootReducer, undefined, enhacers);
    return store;
}

export const store = configureStore();
export const persistor = persistStore(store);
