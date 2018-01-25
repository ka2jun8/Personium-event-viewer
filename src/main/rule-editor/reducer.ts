import { ActionNames, ChangeIdAction, ChangeActionAction, ChangeObjectAction, ChangeTypeAction, ChangeServiceAction, RegisteredRuleAction, SelectedCellAction, ChangeBoxAction } from "./action";
import { PersoniumClient, Rule } from "personium-client";

export interface RuleEditorState {
    cell: string;
    id: string;
    action: string;
    type: string;
    object: string;
    service: string;
    box: string;
    result: boolean;
}

export type RuleEditorActions = 
    SelectedCellAction |
    ChangeIdAction |
    ChangeActionAction | 
    ChangeTypeAction |
    ChangeObjectAction |
    ChangeServiceAction |
    ChangeBoxAction |
    RegisteredRuleAction 
    ;

const initialState: RuleEditorState = {
    cell: null,
    id: null,
    action: null,
    type: null,
    object: null,
    service: null,
    box: null,
    result: false,
};

export default function reducer(state: RuleEditorState = initialState, action: RuleEditorActions) {
    switch(action.type) {
        case ActionNames.SelectedCellAction:
            return {
                cell: action.cell,
                id: state.id,
                action: state.action,
                type: state.type,
                object: state.object,
                service: state.service,
                box: state.box,
                result: state.result,
            };
        case ActionNames.ChangeId:
            return {
                cell: state.cell,
                id: action.id,
                action: state.action,
                type: state.type,
                object: state.object,
                service: state.service,
                box: state.box,
                result: state.result,
            };
        case ActionNames.ChangeType:
            return {
                cell: state.cell,
                id: state.id,
                action: state.action,
                type: action.eventType,
                object: state.object,
                service: state.service,
                box: state.box,
                result: state.result,
            };
        case ActionNames.ChangeAction:
            return {
                cell: state.cell,
                id: state.id,
                action: action.action,
                type: state.type,
                object: state.object,
                service: state.service,
                box: state.box,
                result: state.result,
            };
        case ActionNames.ChangeObject:
            return {
                cell: state.cell,
                id: state.id,
                action: state.action,
                type: state.type,
                object: action.object,
                service: state.service,
                box: state.box,
                result: state.result,
            };
        case ActionNames.ChangeService:
            return {
                cell: state.cell,
                id: state.id,
                action: state.action,
                type: state.type,
                object: state.object,
                service: action.service,
                box: state.box,
                result: state.result,
            };
        case ActionNames.ChangeBox:
            return {
                cell: state.cell,
                id: state.id,
                action: state.action,
                type: state.type,
                object: state.object,
                service: state.service,
                box: action.box,
                result: state.result,
            };
        case ActionNames.RegisteredRuleAction:
            return {
                cell: state.cell,
                id: null,
                action: null,
                type: null,
                object: null,
                service: null,
                box: null,
                result: action.result,
            };
        default: 
            return state;
    }
}

