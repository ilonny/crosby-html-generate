import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { history } from "./lib";
import { App } from "./app";
import { store, persistor } from "./lib";
const root = document.querySelector("#root");
const render = () => {
    if (root) {
        ReactDOM.render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router history={history}>
                        <App />
                    </Router>
                </PersistGate>
            </Provider>,
            root
        );
    }
};

if (module.hot) {
    module.hot.accept("./app", render);
}

render();
