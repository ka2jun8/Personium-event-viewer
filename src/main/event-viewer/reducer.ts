import { ActionNames, ReceiveEventAction, SelectCellAction } from "./action";
import { JSONEvent } from "../View";

export interface EventViewerState {
    event: JSONEvent,
    cell: string,
}

export type EventViewerActions = 
    ReceiveEventAction | SelectCellAction;

const initialState: EventViewerState = {
    event: null,
    cell: "",
};

export default function reducer(state: EventViewerState = initialState, action: EventViewerActions) {
    switch(action.type) {
        case ActionNames.ReceiveEvent:
            let json: JSONEvent = null;
            const text = action.packet && action.packet.data;
            if(text){
                try {
                    json = JSON.parse(text);
                }catch(e) {
                    console.error("not json data: ", text);
                }
            }
            return {event: json, cell: action.cell};
        case ActionNames.SelectCell:
            return {event: state.event, cell: action.cell};
        default: 
            return state;
        }
}