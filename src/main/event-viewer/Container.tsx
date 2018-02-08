import {connect} from "react-redux";
import {Dispatch} from "redux";
import {EventViewer} from "./View";
import {ReduxAction, ReduxState} from "../../store";
import {receiveEvent as receiveEventForMainView, checkState, reconnect} from "../action";
import { changeSubscribeType, changeSubscribeObject, subscribe, unsubscribe, selectCell } from "./action";

export interface SubscribeCondition {
    type: string,
    object: string;
}

export class EventViewerActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {
    }

    checkState() {
        this.dispatch(checkState());
    }

    reconnect() {
        this.dispatch(reconnect());
    }

    changeCell(cell: string) {
        this.dispatch(selectCell(cell));
    }

    changeSubscribeType(type: string) {
        this.dispatch(changeSubscribeType(type));
    }

    changeSubscribeObject(object: string) {
        this.dispatch(changeSubscribeObject(object));
    }

    subscribe(info: SubscribeCondition) {
        this.dispatch(subscribe(info));
    }

    unsubscribe(info: SubscribeCondition) {
        this.dispatch(unsubscribe(info));
    }

}

export default connect(
    (state: ReduxState) => ({eventState: state.event}),
    (dispatch: Dispatch<ReduxAction>) => ({actions: new EventViewerActionDispatcher(dispatch)})
)(EventViewer);

