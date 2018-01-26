import * as moment from "moment";
import { ActionNames, ReceiveEventAction, SelectCellAction, ChangeSubscribeTypeAction, ChangeSubscribeObjectAction, SubscribeAction, UnsubscribeAction } from "./action";
import { JSONEvent } from "../View";
import * as _ from "underscore";
import { WebSocketWrapperManager } from "../WebSocketWrapper";

export interface EventViewerState {
    event: JSONEvent,
    cell: string,
    eventList: JSONEvent[],
    subscribeType: string,
    subscribeObject: string,
}

export type EventViewerActions = 
    ReceiveEventAction | 
    SelectCellAction |
    ChangeSubscribeTypeAction |
    ChangeSubscribeObjectAction |
    SubscribeAction |
    UnsubscribeAction
    ;

const initialState: EventViewerState = {
    event: null,
    cell: "",
    eventList: [],
    subscribeType: "*",
    subscribeObject: "*",
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
            list.push(json);
            return {event: json, cell: action.cell, eventList: list};
        case ActionNames.SelectCell:
            return _.assign({}, state, {cell: action.cell});
        case ActionNames.ChangeType: 
            return _.assign({}, state, {subscribeType: action.subscribeType});
        case ActionNames.ChangeObject:  
            return _.assign({}, state, {subscribeObject: action.object});
        case ActionNames.Subscribe:  
            wsman = WebSocketWrapperManager.getInstance();
            wsman.subscribe(action.info.type, action.info.object, state.cell);
            return _.assign({}, state, {subscribeType: "*", subscribeObject: "*"});
        case ActionNames.Unsubscribe:  
            wsman = WebSocketWrapperManager.getInstance();
            wsman.unsubscribe(action.info.type, action.info.object, state.cell);
            return _.assign({}, state, {subscribeType: "*", subscribeObject: "*"});
        default: 
            return state;
        }
}