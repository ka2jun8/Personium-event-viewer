import * as moment from "moment";
import { ActionNames, ReceiveEventAction, SelectCellAction, ChangeSubscribeTypeAction, ChangeSubscribeObjectAction, SubscribeAction, UnsubscribeAction, ReceivedCellListAction, ReceivedStateAction } from "./action";
import { JSONEvent, WebSocketState } from "../View";
import * as _ from "underscore";
import { WebSocketWrapperManager } from "../WebSocketWrapper";
import { ALL_CELL } from "./View";

export interface EventViewerState {
    event: JSONEvent,
    cell: string,
    eventList: JSONEvent[],
    subscribeType: string,
    subscribeObject: string,
    cellList: string[],
    receivedState: {[cell: string]: WebSocketState},
}

export type EventViewerActions = 
    ReceiveEventAction | 
    SelectCellAction |
    ChangeSubscribeTypeAction |
    ChangeSubscribeObjectAction |
    SubscribeAction |
    UnsubscribeAction |
    ReceivedCellListAction |
    ReceivedStateAction
    ;

const initialState: EventViewerState = {
    event: null,
    cell: "",
    eventList: [],
    subscribeType: "*",
    subscribeObject: "*",
    cellList: [],
    receivedState: {},
};

export default function reducer(state: EventViewerState = initialState, action: EventViewerActions) {
    let wsman: WebSocketWrapperManager = null;
    switch(action.type) {
        case ActionNames.ReceiveEvent:
            let json: JSONEvent = null;
            const text = action.packet && action.packet.data;
            if(text){
                try {
                    json = JSON.parse(text);
                    json.date = moment().format("YYYY-MM-DD HH:mm:ss");
                }catch(e) {
                    console.error("not json data: ", text);
                }
            }
            const list = state.eventList;
            if(list.length >= 50) {
                list.splice(0, 1);
            }
            list.push(json);
            return _.assign({}, state, {event: json, cell: action.cell, eventList: list});
        case ActionNames.SelectCell:
            return _.assign({}, state, {cell: action.cell});
        case ActionNames.ChangeType: 
            return _.assign({}, state, {subscribeType: action.subscribeType});
        case ActionNames.ChangeObject:  
            return _.assign({}, state, {subscribeObject: action.object});
        case ActionNames.Subscribe:  
            wsman = WebSocketWrapperManager.getInstance();
            if(state.cell === ALL_CELL) {
                wsman.subscribe(action.info.type, action.info.object);
            }else {
                wsman.subscribe(action.info.type, action.info.object, state.cell);
            }
            return _.assign({}, state, {subscribeType: "*", subscribeObject: "*"});
        case ActionNames.Unsubscribe:  
            wsman = WebSocketWrapperManager.getInstance();
            if(state.cell === ALL_CELL) {
                wsman.unsubscribe(action.info.type, action.info.object);
            }else {
                wsman.unsubscribe(action.info.type, action.info.object, state.cell);
            }
            return _.assign({}, state, {subscribeType: "*", subscribeObject: "*"});
        case ActionNames.ReceivedCellList:  
            return _.assign({}, state, {cellList: action.cellList});
        case ActionNames.ReceivedState:  
            const currentState = state.receivedState;
            const receivedState = action.receivedState;
            const nextState = _.assign({}, currentState[action.cell], receivedState);
            currentState[action.cell] = nextState;
            return _.assign({}, state, {receivedState: currentState});
        default: 
            return state;
        }
}