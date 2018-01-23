import {Action} from "redux";
import { Packet } from "../View";

export enum ActionNames {
    ReceiveEvent = "event-viewer/receive-event",
    SelectCell = "event-viewer/select-cell",
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


export const receiveEvent = (cell: string, packet: Packet): ReceiveEventAction => ({
    type: ActionNames.ReceiveEvent,
    cell: cell,
    packet: packet,
});

export const selectCell = (cell: string): SelectCellAction => ({
    type: ActionNames.SelectCell,
    cell: cell,
});

