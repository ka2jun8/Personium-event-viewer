import {Action} from "redux";
import { Packet } from "../View";
import { SubscribeCondition } from "./Container";

export enum ActionNames {
    ReceiveEvent = "event-viewer/receive-event",
    SelectCell = "event-viewer/select-cell",
    ChangeType = "event-viewer/change-type",
    ChangeObject = "event-viewer/change-object",
    Subscribe = "event-viewer/subscribe",
    Unsubscribe = "event-viewer/unsubscribe",
    ReceivedCellList = "event-viewer/received-cell-list",
}

export interface ReceiveEventAction extends Action {
    type: ActionNames.ReceiveEvent,
    cell: string,
    packet: Packet,
}

export interface SelectCellAction extends Action {
    type: ActionNames.SelectCell,
    cell: string,
}

export interface ChangeSubscribeTypeAction extends Action {
    type: ActionNames.ChangeType,
    subscribeType: string,
}

export interface ChangeSubscribeObjectAction extends Action {
    type: ActionNames.ChangeObject,
    object: string,
}

export interface SubscribeAction extends Action {
    type: ActionNames.Subscribe,
    info: SubscribeCondition,
}

export interface UnsubscribeAction extends Action {
    type: ActionNames.Unsubscribe,
    info: SubscribeCondition,
}

export interface ReceivedCellListAction extends Action {
    type: ActionNames.ReceivedCellList,
    cellList: string[],
}


export const receiveEvent = (cell: string, packet: Packet): ReceiveEventAction => ({
    type: ActionNames.ReceiveEvent,
    cell: cell,
    packet: packet,
});

export const selectCell = (cell: string): SelectCellAction => ({
    type: ActionNames.SelectCell,
    cell: cell,
});

export const changeSubscribeType = (type: string): ChangeSubscribeTypeAction => ({
    type: ActionNames.ChangeType,
    subscribeType: type,
});

export const changeSubscribeObject = (object: string): ChangeSubscribeObjectAction => ({
    type: ActionNames.ChangeObject,
    object: object,
});

export const subscribe = (info: SubscribeCondition): SubscribeAction => ({
    type: ActionNames.Subscribe,
    info,
});

export const unsubscribe = (info: SubscribeCondition): UnsubscribeAction => ({
    type: ActionNames.Unsubscribe,
    info,
});

export const receiveCellList = (cellList: string[]): ReceivedCellListAction => ({
    type: ActionNames.ReceivedCellList,
    cellList: cellList,
});
