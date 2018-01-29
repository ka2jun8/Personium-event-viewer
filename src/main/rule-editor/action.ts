import {Action} from "redux";
import { RuleEditorState } from "./reducer";

export enum ActionNames {
    ReceivedCellList = "rule-editor/cell-list",
    ChangeId = "rule-editor/change-id",
    ChangeAction = "rule-editor/change-action",
    ChangeType = "rule-editor/change-type",
    ChangeObject = "rule-editor/change-object",
    ChangeService = "rule-editor/change-service",
    ChangeBox = "rule-editor/change-box",
    RegisterRuleAction = "rule-editor/register-rule",
    RegisteredRuleAction = "rule-editor/registered-rule",
    SelectedCellAction = "rule-editor/selected-cell",
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
    type: ActionNames.RegisterRuleAction,
    cell: string,
    inputtedValues: RuleEditorState,
}

export interface RegisteredRuleAction extends Action {
    type: ActionNames.RegisteredRuleAction,
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
    type: ActionNames.RegisterRuleAction,
    cell: cell, 
    inputtedValues: inputtedValues,
});

export const registeredRule = (result: boolean): RegisteredRuleAction => ({
    type: ActionNames.RegisteredRuleAction,
    result: result,
});

