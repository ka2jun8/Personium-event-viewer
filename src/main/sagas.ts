import { put, takeEvery } from "redux-saga/effects";

import { PersoniumClient, PersoniumAccessToken, Rule } from "personium-client";
import { ActionNames as MainActionNames, loginSuccess, receiveCells, SelecetViewAction, selectCell } from "./action";
import { ActionNames as RuleViewrActionNames, receiveRules, loginSuccessForRuleViewer, SelectCellAction, selectCell as selectCellForRuleViewer, reset } from "./rule-viewer/action";
import { ActionNames as EventViewerActionNames, selectCell as selectCellForEventViewer, receiveCellList } from "./event-viewer/action";
import { ActionNames as RuleEditorActionNames, receiveCellList as receiveCellListForRuleEditor, registeredRule, RegisterRuleAction, selectedCell as selectCellForRuleEditor, receiveBoxList as receiveBoxListForRuleEditor, getBoxList as getBoxListForRuleEditor, Box } from "./rule-editor/action";
import { ReduxAction } from "../store";
import { Cell } from "./View";
import { LocalCellAddress, LocalBoxAddress } from "./rule-editor/reducer";

export interface Config {
    host: string,
    cell: string,
    username: string,
    password: string,
    master: string;
    event: boolean;
    oldVersion: boolean;
}

declare const config: Config;
const client = new PersoniumClient(config.host);

function* loginPersonium(action: ReduxAction) {
    if(config.cell) {
        const token: PersoniumAccessToken = yield client.login(config.cell, config.username, config.password, (refreshToken)=>{
            client.refreshAccessToken(config.cell, refreshToken);
        });
        console.log("Personium logined.: ", config.cell);
        yield put(loginSuccess(client));
    }
    yield put(loginSuccessForRuleViewer(client));
    yield getCellList(action);
    // yield getRules(action);
}

function* getCellList(action: ReduxAction) {
    let cells: Cell[] = [];
    if(config.master) {
        cells = yield client.getCellList(config.master);
        yield put(receiveCells(cells));
    }else {
        cells = [{Name: config.cell}];
        yield put(receiveCells(cells));
    }
    if(cells[0]) {
        yield put(selectCell(cells[0].Name));
        yield put(selectCellForRuleViewer(cells[0].Name));
        yield put(selectCellForEventViewer(cells[0].Name));
        yield put(receiveCellList(cells.map(cell => cell.Name)));
        yield put(receiveCellListForRuleEditor(cells.map(cell => cell.Name)));
        yield put(selectCellForRuleEditor(cells[0].Name));
        yield put(reset(cells[0].Name));
        yield put(getBoxListForRuleEditor(cells[0].Name));
    }
}

function* getBoxList(action: SelectCellAction) {
    const boxes: Box[] = yield client.getBox(action.cell, null, config.master);
    yield put(receiveBoxListForRuleEditor(boxes));
}

function* getRules(action: SelectCellAction) {
    const rules: Rule[] = yield client.getRules(action.cell, config.master);
    yield put(receiveRules(rules));
}

function* registerRule(action: RegisterRuleAction) {
    let object = null;
    if(action.inputtedValues.object && 
        action.inputtedValues.object !== LocalCellAddress &&
        action.inputtedValues.object !== LocalBoxAddress) {
            object = action.inputtedValues.object;
    }

    let rule: any = null;
    let result: boolean = false;
    let _id: string = null;

    if(config.oldVersion) {
        rule = {
            Service: action.inputtedValues.service,
            Action: action.inputtedValues.action,
            Type: action.inputtedValues.type,
            Object: object,
        };
    
        if(action.inputtedValues.box) {
            rule["_Box.Name"] = action.inputtedValues.box;
        }
    
        if(action.inputtedValues.id) {
            rule.__id = action.inputtedValues.id;
        }
    
        result = false;
        _id = rule.__id;
    
    }else {
        rule = {
            TargetUrl: action.inputtedValues.service,
            Action: action.inputtedValues.action,
            EventType: action.inputtedValues.type,
            EventObject: object,
        };
    
        if(action.inputtedValues.box) {
            rule["_Box.Name"] = action.inputtedValues.box;
        }
    
        if(action.inputtedValues.id) {
            rule.Name = action.inputtedValues.id;
        }
    
        result = false;
        _id = rule.Name;
    }
    
    if(!_id){
        result = yield client.setRule(action.cell, rule, config.master);
    }else {
        result = yield client.updateRule(action.cell, rule, _id, config.master);
    }
    yield put(registeredRule(result));
}

export default function* rootSaga() {
    yield takeEvery(MainActionNames.Login, loginPersonium);
    yield takeEvery(RuleViewrActionNames.ResetAction, getRules);
    yield takeEvery(RuleEditorActionNames.RegisterRule, registerRule);
    yield takeEvery(RuleEditorActionNames.GetBoxList, getBoxList);
}

