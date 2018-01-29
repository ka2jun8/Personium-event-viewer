import {connect} from "react-redux";
import {Dispatch} from "redux";

import {Main, Packet} from "./View";
import {ViewerType} from "./reducer";
import {login, selectViewer, selectCell, connected, receiveEvent, websocketInitialized} from "./action";
import {reset, selectCell as selectCellForRuleViewer} from "./rule-viewer/action";
import {selectCell as selectCellForEventViewer, receiveEvent as receiveEventForEventView} from "./event-viewer/action";
import {selectedCell as selectCellForRuleEditor, getBoxList as getBoxListForRuleEditor} from "./rule-editor/action";

import {ReduxAction, ReduxState} from "../store";

export class MainActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {
        this.login();
    }

    login() {
        this.dispatch(login());
    }

    select(viewerType: ViewerType) {
        this.dispatch(selectViewer(viewerType));
    }

    selectCell(cell: string) {
        this.dispatch(selectCell(cell));
        this.dispatch(selectCellForRuleViewer(cell));
        this.dispatch(selectCellForEventViewer(cell));
        this.dispatch(selectCellForRuleEditor(cell));
        this.dispatch(getBoxListForRuleEditor(cell));
        this.dispatch(reset(cell));
    }

    connected(cell: string, connectionState: boolean) {
        this.dispatch(connected(cell, connectionState));
    }

    receiveEvent(cell: string, packet: Packet) {
        this.dispatch(receiveEvent(cell, packet));
        this.dispatch(receiveEventForEventView(cell, packet));
    }

    websocketInitialized() {
        this.dispatch(websocketInitialized());
    }
    
}

export default connect(
    (state: ReduxState) => ({mainState: state.main}),
    (dispatch: Dispatch<ReduxAction>) => ({actions: new MainActionDispatcher(dispatch)})
)(Main);

