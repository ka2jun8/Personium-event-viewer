import {connect} from "react-redux";
import {Dispatch} from "redux";
import {Rule} from "personium-client";
import {selectedRule, reset} from "./action";
import {RuleViewer} from "./View";
import {ReduxAction, ReduxState} from "../../store";

export class RuleViewerActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {
    }
    selectedRule(rule: Rule) {
        this.dispatch(selectedRule(rule));
    }

    reset(cell: string) {
        this.dispatch(reset(cell));
    }
}

export default connect(
    (state: ReduxState) => ({ruleState: state.rule}),
    (dispatch: Dispatch<ReduxAction>) => ({actions: new RuleViewerActionDispatcher(dispatch)})
)(RuleViewer);

