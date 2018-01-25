import {PersoniumClient, Rule, Cell} from "personium-client";
import { ActionNames, SelecetViewAction, LoginSuccessAction, ReceiveCellsAction, SelectCellAction, ReceiveEventAction, ConnectedAction, WebSocketInitializedAction } from "./action";
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
}

export type MainActions = LoginSuccessAction | SelecetViewAction | ReceiveCellsAction | SelectCellAction | ReceiveEventAction | ConnectedAction | WebSocketInitializedAction;

const initialState: MainState = {
    client: null,
    viewer: ViewerType.RuleViewer,
    cells: [],
    cell: "Default Cell",
    notifyMessage: null,
    connectionState: false,
    websocketInitialized: false,
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
        default: 
            return state;
    }
}