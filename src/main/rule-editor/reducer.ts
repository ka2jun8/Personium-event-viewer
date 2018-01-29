import { ActionNames, ChangeIdAction, ChangeActionAction, ChangeObjectAction, ChangeTypeAction, ChangeServiceAction, RegisteredRuleAction, SelectedCellAction, ChangeBoxAction, ReceivedCellListAction } from "./action";
import * as _ from "underscore";
import { PersoniumClient, Rule } from "personium-client";

export interface RuleEditorState {
    cellList: string[];
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
    RegisteredRuleAction |
    ReceivedCellListAction
    ;

const initialState: RuleEditorState = {
    cellList: [],
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
        case ActionNames.ReceivedCellList:  
            return _.assign({}, state, {cellList: action.cellList});
        case ActionNames.SelectedCellAction:
            return _.assign({}, state, {cell: action.cell});
        case ActionNames.ChangeId:
            return _.assign({}, state, {id: action.id});
        case ActionNames.ChangeType:
            return _.assign({}, state, {type: action.eventType});
        case ActionNames.ChangeAction:
            return _.assign({}, state, {action: action.action});
        case ActionNames.ChangeObject:
            return _.assign({}, state, {object: action.object});
        case ActionNames.ChangeService:
            return _.assign({}, state, {service: action.service});
        case ActionNames.ChangeBox:
            return _.assign({}, state, {box: action.box});
        case ActionNames.RegisteredRuleAction:
            return {
                cellList: state.cellList,
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

