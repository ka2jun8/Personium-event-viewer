import {createStore, combineReducers, Action, applyMiddleware} from "redux";

import rule, { RuleViewerState, RuleViewerActions } from "./main/rule-viewer/reducer";
import main, { MainState, MainActions } from "./main/reducer";
import event, { EventViewerState, EventViewerActions } from "./main/event-viewer/reducer";

import createSaga from "redux-saga";
import rootSaga from "./main/sagas";
const saga = createSaga();

export default createStore(
    combineReducers({
        rule,
        event,
        main,
    }),
    applyMiddleware(saga)
)

saga.run(rootSaga);

export type ReduxState = {
    main: MainState,
    rule: RuleViewerState,
    event: EventViewerState, 
}

export type ReduxAction =  EventViewerActions | RuleViewerActions | MainActions | Action;