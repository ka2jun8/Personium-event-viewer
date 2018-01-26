import {connect} from "react-redux";
import {Dispatch} from "redux";
import {Rule} from "personium-client";
import {selectedRule, reset} from "./action";
import {RuleViewer} from "./View";
import {ReduxAction, ReduxState} from "../../store";
import { changeId, changeAction, changeType, changeObject, changeService, changeBox } from "../rule-editor/action";
import { selectViewer } from "../action";
import { ViewerType } from "../reducer";

export class RuleViewerActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {
    }
    selectedRule(rule: Rule, box: string) {
        this.dispatch(selectedRule(rule, box));
    }

    reset(cell: string) {
        this.dispatch(reset(cell));
    }

    editRule(rule: Rule, box: string) {
        this.dispatch(selectViewer(ViewerType.RuleEditor));
        this.dispatch(changeId(rule.Name));
        this.dispatch(changeAction(rule.Action));
        this.dispatch(changeType(rule.EventType));
        this.dispatch(changeObject(rule.EventObject));
        this.dispatch(changeService(rule.TargetUrl));
        this.dispatch(changeBox(box));
    }
}

export default connect(
    (state: ReduxState) => ({ruleState: state.rule}),
    (dispatch: Dispatch<ReduxAction>) => ({actions: new RuleViewerActionDispatcher(dispatch)})
)(RuleViewer);

