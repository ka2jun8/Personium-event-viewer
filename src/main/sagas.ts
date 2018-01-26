import { put, takeEvery } from "redux-saga/effects";

import { PersoniumClient, PersoniumAccessToken, Rule } from "personium-client";
import { ActionNames as MainActionNames, loginSuccess, receiveCells, SelecetViewAction, selectCell } from "./action";
import { ActionNames as RuleViewrActionNames, receiveRules, loginSuccessForRuleViewer, reset, SelectCellAction, selectCell as selectCellForRuleViewer } from "./rule-viewer/action";
import { ActionNames as EventViewerActionNames, selectCell as selectCellForEventViewer, receiveCellList } from "./event-viewer/action";
import { ActionNames as RuleEditorActionNames, registeredRule, RegisterRuleAction, selectedCell as selectCellForRuleEditor } from "./rule-editor/action";
import { ReduxAction } from "../store";
import { Cell } from "./View";

export interface Config {
    host: string,
    cell: string,
    username: string,
    password: string,
    master: string;
    event: boolean;
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
        yield put(selectCellForRuleEditor(cells[0].Name));
        yield put(reset(cells[0].Name));
    }
}

function* getRules(action: SelectCellAction) {
    const rules: Rule[] = yield client.getRules(action.cell, config.master);
    yield put(receiveRules(rules));
}

function* registerRule(action: RegisterRuleAction) {
    const rule: Rule = {
        TargetUrl: action.inputtedValues.service,
        Action: action.inputtedValues.action,
        EventType: action.inputtedValues.type,
        EventObject: action.inputtedValues.object,
    };
    if(action.inputtedValues.id) {
        rule.Name = action.inputtedValues.id;
    }
    let result: boolean = false;
    const _id: string = rule.Name;
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
    yield takeEvery(RuleEditorActionNames.RegisterRuleAction, registerRule);
}

