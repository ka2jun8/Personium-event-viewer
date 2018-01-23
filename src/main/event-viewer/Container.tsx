import {connect} from "react-redux";
import {Dispatch} from "redux";
import {EventViewer} from "./View";
import {ReduxAction, ReduxState} from "../../store";
import {receiveEvent as receiveEventForMainView} from "../action";

export class EventViewerActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {
    }
}

export default connect(
    (state: ReduxState) => ({eventState: state.event}),
    (dispatch: Dispatch<ReduxAction>) => ({actions: new EventViewerActionDispatcher(dispatch)})
)(EventViewer);

