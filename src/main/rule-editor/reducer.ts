import { ActionNames, ChangeIdAction, ChangeActionAction, ChangeObjectAction, ChangeTypeAction, ChangeServiceAction, ResetAction, SelectedCellAction, ChangeBoxAction, ReceivedCellListAction, ReceiveBoxListAction, RegisterRuleResultAction } from "./action";
import * as _ from "underscore";
import { PersoniumClient, Rule } from "personium-client";

export const LocalCellAddress = "personium-localcell:/";
export const LocalBoxAddress = "personium-localbox:/";

export interface RuleEditorState {
    cellList: string[];
    cell: string;
    id: string;
    action: string;
    type: string;
    object: string;
    service: string;
    box: string;
    boxList: string[];
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
    RegisterRuleResultAction |
    ResetAction |
    ReceivedCellListAction |
    ReceiveBoxListAction 
    ;

const initialState: RuleEditorState = {
    cellList: [],
    cell: null,
    id: null,
    action: null,
    type: null,
    object: LocalCellAddress,
    service: null,
    box: null,
    boxList: [],
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
            let object = state.object;
            if(!object || object === LocalCellAddress || object === LocalBoxAddress) {
                object = action.box? LocalBoxAddress: LocalCellAddress;
            }
            return _.assign({}, state, {box: action.box, object: object});
        case ActionNames.RegisterRuleResult:
            return _.assign({}, state, {result: action.result});
        case ActionNames.Reset:
            return {
                cellList: state.cellList,
                cell: state.cell,
                id: null,
                action: null,
                type: null,
                object: LocalCellAddress,
                service: null,
                box: null,
                boxList: state.boxList,
                result: false,
            };
        case ActionNames.ReceiveBoxList:
            const boxNameList = _.union([], ["__"], action.boxList.map(box=>box.Name));
            return _.assign({}, state, {boxList: boxNameList});
        default: 
            return state;
    }
}

