import * as React from "react";
import * as ReactDOM from "react-dom";

import "element-theme-default";

import {Provider} from "react-redux";

import Main from "./main/Container";
import store from "./store";

ReactDOM.render(
    <Provider store={store}>
        <Main />
    </Provider>
    , document.getElementById("app")
);
