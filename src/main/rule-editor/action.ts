import {Action} from "redux";
import { RuleEditorState } from "./reducer";

export interface Box {
    Name: string;
}

export enum ActionNames {
    ReceivedCellList = "rule-editor/cell-list",
    ChangeId = "rule-editor/change-id",
    ChangeAction = "rule-editor/change-action",
    ChangeType = "rule-editor/change-type",
    ChangeObject = "rule-editor/change-object",
    ChangeService = "rule-editor/change-service",
    ChangeBox = "rule-editor/change-box",
    RegisterRule = "rule-editor/register-rule",
    SelectedCellAction = "rule-editor/selected-cell",
    GetBoxList = "rule-editor/get-box-list",
    ReceiveBoxList = "rule-editor/receive-box-list",
    RegisterRuleResult = "rule-editor/register-rule-result",
    Reset = "rule-editor/reset",
}

export interface ReceivedCellListAction extends Action {
    type: ActionNames.ReceivedCellList,
    cellList: string[],
}

export interface SelectedCellAction extends Action {
    type: ActionNames.SelectedCellAction,
    cell: string,
}

export interface ChangeIdAction extends Action {
    type: ActionNames.ChangeId,
    id: string,
}

export interface ChangeActionAction extends Action {
    type: ActionNames.ChangeAction,
    action: string,
}

export interface ChangeTypeAction extends Action {
    type: ActionNames.ChangeType,
    eventType: string,
}

export interface ChangeObjectAction extends Action {
    type: ActionNames.ChangeObject,
    object: string,
}

export interface ChangeServiceAction extends Action {
    type: ActionNames.ChangeService,
    service: string,
}

export interface ChangeBoxAction extends Action {
    type: ActionNames.ChangeBox,
    box: string,
}

export interface RegisterRuleAction extends Action {
    type: ActionNames.RegisterRule,
    cell: string,
    inputtedValues: RuleEditorState,
}

export interface GetBoxListAction extends Action {
    type: ActionNames.GetBoxList,
    cell: string,
}

export interface ReceiveBoxListAction extends Action {
    type: ActionNames.ReceiveBoxList,
    boxList: Box[],
}

export interface ResetAction extends Action {
    type: ActionNames.Reset,
}

export interface RegisterRuleResultAction extends Action {
    type: ActionNames.RegisterRuleResult,
    result: boolean,
}


export const receiveCellList = (cellList: string[]): ReceivedCellListAction => ({
    type: ActionNames.ReceivedCellList,
    cellList: cellList,
});

export const selectedCell = (cell: string): SelectedCellAction => ({
    type: ActionNames.SelectedCellAction,
    cell: cell,
});

export const changeId = (id: string): ChangeIdAction => ({
    type: ActionNames.ChangeId,
    id: id,
});

export const changeAction = (action: string): ChangeActionAction => ({
    type: ActionNames.ChangeAction,
    action: action,
});

export const changeType = (eventType: string): ChangeTypeAction => ({
    type: ActionNames.ChangeType,
    eventType: eventType,
});

export const changeObject = (object: string): ChangeObjectAction => ({
    type: ActionNames.ChangeObject,
    object: object,
});

export const changeService = (service: string): ChangeServiceAction => ({
    type: ActionNames.ChangeService,
    service: service,
});

export const changeBox = (box: string): ChangeBoxAction => ({
    type: ActionNames.ChangeBox,
    box: box,
});

export const registerRule = (cell: string, inputtedValues: RuleEditorState): RegisterRuleAction => ({
    type: ActionNames.RegisterRule,
    cell: cell, 
    inputtedValues: inputtedValues,
});

export const registeredRule = (result: boolean): RegisterRuleResultAction => ({
    type: ActionNames.RegisterRuleResult,
    result: result,
});

export const reset = (): ResetAction => ({
    type: ActionNames.Reset,
});

export const getBoxList = (cell: string): GetBoxListAction => ({
    type: ActionNames.GetBoxList,
    cell: cell,
});

export const receiveBoxList = (result: Box[]): ReceiveBoxListAction => ({
    type: ActionNames.ReceiveBoxList,
    boxList: result,
});
