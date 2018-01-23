import {Action} from "redux";

import {PersoniumClient, Rule, Cell} from "personium-client";

export enum ActionNames {
    ReceiveRules = "rule-viewer/receive-rules",
    SelectRuleAction = "rule-viewer/select-rule",
    LoginSuccessAction = "rule-viewer/login-success",
    ResetAction = "rule-viewer/reset",
    SelectCell = "rule-viewer/select-cell",
}

export interface ReceiveRulesAction extends Action {
    type: ActionNames.ReceiveRules,
    rules: Rule[],
}

export interface SelectRuleAction extends Action {
    type: ActionNames.SelectRuleAction,
    rule: Rule,
}

export interface LoginSuccessAction extends Action {
    type: ActionNames.LoginSuccessAction,
    client: PersoniumClient,
}

export interface ResetAction extends Action {
    type: ActionNames.ResetAction,
    cell: string,
}

export interface SelectCellAction extends Action {
    type: ActionNames.SelectCell,
    cell: string,
}



export const receiveRules = (rules: Rule[]): ReceiveRulesAction => ({
    type: ActionNames.ReceiveRules,
    rules: rules,
});

export const selectedRule = (rule: Rule): SelectRuleAction => ({
    type: ActionNames.SelectRuleAction,
    rule: rule,
});

export const loginSuccessForRuleViewer = (client: PersoniumClient): LoginSuccessAction => ({
    type: ActionNames.LoginSuccessAction,
    client: client,
});

export const reset = (cell: string): ResetAction => ({
    type: ActionNames.ResetAction,
    cell: cell,
});

export const selectCell = (cell: string): SelectCellAction => ({
    type: ActionNames.SelectCell,
    cell: cell,
});

