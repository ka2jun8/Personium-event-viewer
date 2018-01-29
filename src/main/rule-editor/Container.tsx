import {connect} from "react-redux";
import {Dispatch} from "redux";
import {RuleEditor} from "./View";
import {ReduxAction, ReduxState} from "../../store";
import { selectedCell, changeId, changeAction, changeType, changeObject, changeService, registerRule, reset, changeBox, getBoxList, registeredRule} from "./action";
import { reset as resetForRuleViewer } from "../rule-viewer/action";
import { RuleEditorState } from "./reducer";
import { selectViewer } from "../action";
import { ViewerType } from "../reducer";

export class RuleEditorActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {
    }
    changeCell(cell: string) {
        this.dispatch(selectedCell(cell));
        this.dispatch(getBoxList(cell));
    }
    changeId(id: string) {
        this.dispatch(changeId(id));
    }
    changeAction(action: string) {
        this.dispatch(changeAction(action));
    }
    changeType(type: string) {
        this.dispatch(changeType(type));
    }
    changeObject(object: string) {
        this.dispatch(changeObject(object));
    }
    changeService(service: string) {
        this.dispatch(changeService(service));
    }
    changeBox(box: string) {
        this.dispatch(changeBox(box));
    }
    registerRule(cell: string, inputtedValues: RuleEditorState) {
        this.dispatch(registerRule(cell, inputtedValues));
    }
    registeredRule(sentFlag: boolean) {
        this.dispatch(registeredRule(sentFlag));
    }
    reset(cell: string) {
        this.dispatch(reset());
        // this.dispatch(selectViewer(ViewerType.RuleViewer));
        this.dispatch(resetForRuleViewer(cell));
    }
}

export default connect(
    (state: ReduxState) => ({ruleEditorState: state.ruleEditor}),
    (dispatch: Dispatch<ReduxAction>) => ({actions: new RuleEditorActionDispatcher(dispatch)})
)(RuleEditor);

