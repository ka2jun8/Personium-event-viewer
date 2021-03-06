import {Action} from "redux";

import {PersoniumClient} from "personium-client";
import { ViewerType } from "./reducer";
import { Cell, Packet } from "./View";

export enum ActionNames {
    Login = "main/login",
    LoginSuccess = "main/login-success",
    SelectViewer = "main/increment",
    ReceiveCells = "main/receive-cells",
    SelectCell = "main/select-cell",
    ReceiveEvent = "main/receive-event",
    Connected = "main/connected",
    WebSocketInitialized = "main/websocket-initilized",
    CheckState = "main/check-state",
    CheckedState = "main/checked-state",
    Reconnect = "main/reconnect",
    Reconnected = "main/reconnected",
    Exevent = "main/exevent",
    Exevented = "main/exevent-ed",
}

export interface LoginAction extends Action {
    type: ActionNames.Login,
}

export interface LoginSuccessAction extends Action {
    type: ActionNames.LoginSuccess,
    client: PersoniumClient,
}

export interface SelecetViewAction extends Action {
    type: ActionNames.SelectViewer,
    selectedViewer: ViewerType,
}

export interface ReceiveCellsAction extends Action {
    type: ActionNames.ReceiveCells,
    cells: Cell[],
}

export interface SelectCellAction extends Action {
    type: ActionNames.SelectCell,
    cell: string,
}

export interface ReceiveEventAction extends Action {
    type: ActionNames.ReceiveEvent,
    cell: string,
    packet: Packet,
}

export interface ConnectedAction extends Action {
    type: ActionNames.Connected,
    cell: string,
    connectionState: boolean,
}

export interface WebSocketInitializedAction extends Action {
    type: ActionNames.WebSocketInitialized,
}

export interface CheckStateAction extends Action {
    type: ActionNames.CheckState,
}

export interface CheckedStateAction extends Action {
    type: ActionNames.CheckedState,
}

export interface ReconnectAction extends Action {
    type: ActionNames.Reconnect,
}

export interface ReconnectedAction extends Action {
    type: ActionNames.Reconnected,
}

export interface ExeventAction extends Action { 
    type: ActionNames.Exevent,
}

export interface ExeventedAction extends Action { 
    type: ActionNames.Exevented,
}


export const selectViewer = (viewer: ViewerType): SelecetViewAction => ({
    type: ActionNames.SelectViewer,
    selectedViewer: viewer,
});

export const login = (): LoginAction => ({
    type: ActionNames.Login,
});

export const loginSuccess = (client: PersoniumClient): LoginSuccessAction => ({
    type: ActionNames.LoginSuccess,
    client: client,
});

export const receiveCells = (cells: Cell[]): ReceiveCellsAction => ({
    type: ActionNames.ReceiveCells,
    cells: cells,
});

export const selectCell = (cell: string): SelectCellAction => ({
    type: ActionNames.SelectCell,
    cell: cell,
});

export const receiveEvent = (cell: string, packet: Packet): ReceiveEventAction => ({
    type: ActionNames.ReceiveEvent,
    cell: cell,
    packet: packet,
});

export const connected = (cell: string, state: boolean): ConnectedAction => ({
    type: ActionNames.Connected,
    cell: cell,
    connectionState: state,
});

export const websocketInitialized = (): WebSocketInitializedAction => ({
    type: ActionNames.WebSocketInitialized,
});

export const checkState = (): CheckStateAction => ({
    type: ActionNames.CheckState,
});

export const checkedState = (): CheckedStateAction => ({
    type: ActionNames.CheckedState,
});

export const reconnect = (): ReconnectAction => ({
    type: ActionNames.Reconnect,
});

export const reconnected = (): ReconnectedAction => ({
    type: ActionNames.Reconnected,
});

export const exevent = (): ExeventAction => ({
    type: ActionNames.Exevent,
});

export const exevented = (): ExeventedAction => ({
    type: ActionNames.Exevented,
});
