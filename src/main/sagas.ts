import { put, takeEvery } from "redux-saga/effects";

import { PersoniumClient, PersoniumAccessToken, Rule } from "personium-client";
import { ActionNames as MainActionNames, loginSuccess, receiveCells, SelecetViewAction, selectCell } from "./action";
import { ActionNames as RuleViewrActionNames, receiveRules, loginSuccessForRuleViewer, reset, SelectCellAction, selectCell as selectCellForRuleViewer } from "./rule-viewer/action";
import { ActionNames as EventViewerActionNames, selectCell as selectCellForEventViewer } from "./event-viewer/action";
import { ReduxAction } from "../store";
import { Cell } from "./View";
import { RuleViewerActions } from "./rule-viewer/reducer";

export interface Config {
    host: string,
    cell: string,
    username: string,
    password: string,
    master: string;
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
        yield put(reset(cells[0].Name));
    }
}

function* getRules(action: SelectCellAction) {
    const rules: Rule[] = yield client.getRules(action.cell, config.master);
    yield put(receiveRules(rules));
}

export default function* rootSaga() {
    yield takeEvery(MainActionNames.Login, loginPersonium);
    yield takeEvery(RuleViewrActionNames.ResetAction, getRules);
}

