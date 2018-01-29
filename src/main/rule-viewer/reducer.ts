import {ReceiveRulesAction, SelectRuleAction, LoginSuccessAction, ActionNames, SelectCellAction} from "./action";
import * as _ from "underscore";
import { PersoniumClient, Rule } from "personium-client";

interface CollectionRuleListMap {
    [collection: string]: Rule[],
}

export interface BoxRuleListMap {
    [box: string]: CollectionRuleListMap,
}

export interface RuleViewerState {
    client: PersoniumClient,
    rules: Rule[],
    boxRuleListMap: BoxRuleListMap,
    boxNameList: string[],
    selectedRule: Rule,
    cell: string,
    box: string,
}

export type RuleViewerActions = ReceiveRulesAction | SelectRuleAction | LoginSuccessAction | SelectCellAction;

const initialState: RuleViewerState = {
    client: null,
    rules: [],
    boxRuleListMap: {},
    boxNameList: [],
    selectedRule: null,
    cell: "",
    box: "__",
};

export default function reducer(state: RuleViewerState = initialState, action: RuleViewerActions) {
    switch(action.type) {
        case ActionNames.ReceiveRules:
            const ruleList = action.rules;
            const boxRuleListMap: BoxRuleListMap = {};

            const MainBox: string = "__";
            const NonCollection: string = "__";
            ruleList.forEach((rule)=>{
                const boxName = rule["_Box.Name"];
                if(boxName){
                    if(!boxRuleListMap[boxName]) {
                        boxRuleListMap[boxName] = {};
                    }
                    const objctName = rule.EventObject || (rule as any).Object;
                    const collectionName = extractCollectionName(objctName);
                    if(collectionName) {
                        if(!boxRuleListMap[boxName][collectionName]) {
                            boxRuleListMap[boxName][collectionName] = [];
                        }
                        boxRuleListMap[boxName][collectionName].push(rule);
                    }else {
                        if(!boxRuleListMap[boxName][NonCollection]) {
                            boxRuleListMap[boxName][NonCollection] = [];
                        }
                        boxRuleListMap[boxName][NonCollection].push(rule);
                    }
                }else {
                    if(!boxRuleListMap[MainBox]){
                        boxRuleListMap[MainBox] = {};
                    }
                    if(!boxRuleListMap[MainBox][NonCollection]) {
                        boxRuleListMap[MainBox][NonCollection] = [];
                    }
                    boxRuleListMap[MainBox][NonCollection].push(rule);
                }
            });
            const boxNameList: string[] = Object.keys(boxRuleListMap); 

            return _.assign({}, state, {boxRuleListMap: boxRuleListMap, boxNameList: boxNameList, rules: action.rules, selectedRule: action.rules[0]});
        case ActionNames.SelectRuleAction: 
            return _.assign({}, state, {selectedRule: action.rule, box: action.box});
        case ActionNames.LoginSuccessAction: 
            return _.assign({}, state, {client: action.client});
        case ActionNames.SelectCell: 
            return _.assign({}, state, {cell: action.cell});
        default: 
            return state;
    }
}

function extractCollectionName(object: string): string {
    let collectionName: string = null;
    if(object && object.match(/personium-localbox/)) {
        const slash = object.indexOf("/", 20);
        collectionName = object.substring(20, slash);
    }
    return collectionName;
}