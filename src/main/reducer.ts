import * as _ from "underscore";
import {PersoniumClient, Rule, Cell} from "personium-client";
import { ActionNames, SelecetViewAction, LoginSuccessAction, ReceiveCellsAction, SelectCellAction, ReceiveEventAction, ConnectedAction, WebSocketInitializedAction, CheckStateAction, CheckedStateAction, ReconnectAction, ReconnectedAction, ExeventAction, ExeventedAction } from "./action";
import { JSONEvent } from "./View";

export enum ViewerType {
    RuleViewer = "1",
    EventViewer = "2",
    RuleEditor = "3",
}

export interface MainState {
    client: PersoniumClient,
    viewer: ViewerType,
    cells: Cell[],
    cell: string,
    notifyMessage: string,
    connectionState: boolean;
    websocketInitialized: boolean;
    stateChecking: boolean;
    reconnecting: boolean;
    exevent: boolean;
}

export type MainActions =
     LoginSuccessAction | 
     SelecetViewAction | 
     ReceiveCellsAction | 
     SelectCellAction | 
     ReceiveEventAction | 
     ConnectedAction | 
     WebSocketInitializedAction |
     CheckStateAction |
     CheckedStateAction |
     ReconnectAction |
     ReconnectedAction | 
     ExeventAction |
     ExeventedAction
     ;

const initialState: MainState = {
    client: null,
    viewer: ViewerType.RuleViewer,
    cells: [],
    cell: "Default Cell",
    notifyMessage: null,
    connectionState: false,
    websocketInitialized: false,
    stateChecking: false,
    reconnecting: false,
    exevent: false,
};

export default function reducer(state: MainState = initialState, action: MainActions) {
    switch(action.type) {
        case ActionNames.LoginSuccess:
            return {
                client: action.client, 
                viewer: state.viewer, 
                cells: state.cells, 
                cell: state.cell,
                connectionState: state.connectionState, 
                websocketInitialized: state.websocketInitialized,
            };
        case ActionNames.SelectViewer: 
            return {
                client: state.client, 
                viewer: action.selectedViewer, 
                cells: state.cells, 
                cell: state.cell,
                connectionState: state.connectionState, 
                websocketInitialized: state.websocketInitialized,
            };
        case ActionNames.ReceiveCells:
            return {
                client: state.client, 
                viewer: state.viewer, 
                cells: action.cells, 
                cell: action.cells[0] && action.cells[0].Name,
                connectionState: state.connectionState, 
                websocketInitialized: state.websocketInitialized,
            }
        case ActionNames.SelectCell:
            return {
                client: state.client,
                viewer: state.viewer, 
                cells: state.cells, 
                cell: action.cell, 
                connectionState: state.connectionState, 
                websocketInitialized: state.websocketInitialized,
            }
        case ActionNames.Connected:
            return {
                client: state.client, 
                viewer: state.viewer, 
                cells: state.cells, 
                cell: action.cell, 
                connectionState: action.connectionState, 
                websocketInitialized: state.websocketInitialized,
            }
        case ActionNames.WebSocketInitialized: 
            return {
                client: state.client, 
                viewer: state.viewer,
                cells: state.cells, 
                cell: state.cell, 
                connectionState: state.connectionState, 
                websocketInitialized: true,
            };
        case ActionNames.ReceiveEvent:
            const event: JSONEvent = JSON.parse(action.packet.data);
            const notifyMessage: string = `${JSON.stringify(event)}`;
            return {
                client: state.client, 
                viewer: state.viewer, 
                cells: state.cells,
                cell: action.cell,
                connectionState: state.connectionState, 
                websocketInitialized: state.websocketInitialized,
                notifyMessage: notifyMessage, 
            };
        case ActionNames.CheckState:
            return _.assign({}, state, {stateChecking: true});
        case ActionNames.CheckedState:
            return _.assign({}, state, {stateChecking: false});
        case ActionNames.Reconnect:
            return _.assign({}, state, {reconnecting: true});
        case ActionNames.Reconnected:
            return _.assign({}, state, {reconnecting: false});
        case ActionNames.Exevent:
            return _.assign({}, state, {exevent: true});
        case ActionNames.Exevented:
            return _.assign({}, state, {exevent: false});
        default: 
            return state;
    }
}