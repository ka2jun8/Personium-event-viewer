import * as React from "react";
import { Card, Input, Button, Table, MessageBox, Select } from "element-react";
import * as _ from "underscore";
import * as moment from "moment";
import { PersoniumAccessToken } from "personium-client";
import { EventViewerState, } from "./reducer";
import { EventViewerActionDispatcher } from "./Container";
import { JSONEvent } from "../View";
import { RuleTypeList } from "../rule-editor/View";

interface Props {
    eventState: EventViewerState,
    actions: EventViewerActionDispatcher,
}

export const ALL_CELL = "All cell";

export class EventViewer extends React.Component<Props, {}> {
    onClickCheckState() {
        this.props.actions.checkState();
    }

    onClickReconnect() {
        this.props.actions.reconnect();
    }

    onChangeCell(value: string) {
        this.props.actions.changeCell(value);
    }

    onChangeType(value: string) {
        this.props.actions.changeSubscribeType(value);
    }

    onChangeObject(value: string) {
        this.props.actions.changeSubscribeObject(value);
    }

    onClickSubscribe() {
        if(this.props.eventState.subscribeType && this.props.eventState.subscribeObject) {
            this.props.actions.subscribe({type: this.props.eventState.subscribeType, object: this.props.eventState.subscribeObject});
        }
    }

    onClickUnsubscribe() {
        if(this.props.eventState.subscribeType && this.props.eventState.subscribeObject) {
            this.props.actions.unsubscribe({type: this.props.eventState.subscribeType, object: this.props.eventState.subscribeObject});
        }
    }

    onClickDetail(eventText: string) {
        MessageBox.msgbox({
            title: "JSON",
            message: eventText,
            confirmButtonText: "OK",
        });

    }

    render() {
        const receivedState = this.props.eventState.receivedState;
        const stateList = receivedState?
            Object.keys(receivedState).map((cell)=>{
                const state = receivedState[cell];
                const subscribedView = state.subscriptions && state.subscriptions.map((subscribe, index)=>{
                    return (
                        <div key={cell+".subscribe."+index} style={style.flexColumn}>
                            <div style={style.flexRow}>
                                <div style={{margin: 1}}>Type: </div>
                                <div style={{margin: 1}}>{subscribe.type},</div>
                                <div style={{margin: 1}}>Object: </div>
                                <div style={{margin: 1}}>{subscribe.object}</div>
                            </div>
                        </div>
                    );
                });
                return {
                    cell: (
                        <div>{cell}</div>
                    ),
                    authorized: (
                        <div>{state.authorized? "Authorized":"Unauthorized"}</div>
                    ),
                    expires_in: (
                        <div>{moment().add(state.expires_in, "seconds").format("YYYY-MM-DD HH:mm:ss")}</div>
                    ),
                    subscribe_list: (
                        <div>{subscribedView}</div>
                    ),
                };
            }): [];

        let stateTableView = <div/>
        if(stateList.length > 0) {
            stateTableView = <Table
                style={{ width: "100%" }}
                columns={StateTableColumns}
                data={stateList}
            />
        }
                
        const eventList: JSONEvent[] = [];
        for(let i = this.props.eventState.eventList.length-1; i >= 0; i--) {
            const event = this.props.eventState.eventList[i];
            const _event: JSONEvent = _.assign({}, event);
            _event.Detail = null;
            const jsonText = _event && JSON.stringify(_event, null, "    ");
            _event.Detail = <span style={{ "float": "right" }}>
                                <Button type="primary" onClick={this.onClickDetail.bind(this, jsonText)}>JSON</Button>
                            </span>;
            eventList.push(_event);
        }

        let tableView = <div/>
        if(this.props.eventState.eventList.length > 0) {
            tableView = <Table
                style={{ width: "100%" }}
                columns={TableColumns}
                data={eventList}
            />
        }

        const subscribeActive: boolean = !!this.props.eventState.subscribeType && !!this.props.eventState.subscribeObject;

        const cellList: string[] = _.union([ALL_CELL], this.props.eventState.cellList);
        const cellListView = cellList.map(cell => {
            return <Select.Option key={cell} label={cell} value={cell} />
        })

        const subscribeTypes = _.union(["*"], RuleTypeList);
        const typeListView = subscribeTypes.map((type)=>{
            return <Select.Option key={type} label={type} value={type} />
        });

        return (
            <div>
                <div style={style.header}>
                    State
                </div>
                <div style={style.flexColumn}>
                    <div style={{margin: 30}}>
                        <Button type="primary" onClick={this.onClickCheckState.bind(this)}>Check State</Button>
                        <Button type="primary" onClick={this.onClickReconnect.bind(this)}>Reconnect</Button>
                    </div>
                    <div style={style.table}>
                        {stateTableView}
                    </div>
                </div>
                <div style={style.header}>
                    Subscribe
                </div>
                <div style={style.card}>
                    <div style={style.flexColumn}>
                        <div style={style.flexRow}>
                            Cell: 
                        </div>
                        <div style={style.flexRow}>
                            <Select value={this.props.eventState.cell || ALL_CELL} onChange={this.onChangeCell.bind(this)} placeholder="Cell">
                                {cellListView}
                            </Select>
                        </div>
                    </div>
                    <div>
                        <div style={style.flexRow}>
                            Subscribe Type: 
                        </div>
                        <div style={style.flexRow}>
                            <Select value={this.props.eventState.subscribeType} onChange={this.onChangeType.bind(this)} placeholder="Type">
                                {typeListView}
                            </Select>
                        </div>
                    </div>
                    <div>
                        <div style={style.flexRow}>
                            Subscribe Object: 
                        </div>
                        <div style={style.flexRow}>
                            <Input value={this.props.eventState.subscribeObject || ""} placeholder="Object" onChange={this.onChangeObject.bind(this)}/>
                        </div>
                    </div>
                    <div style={style.flexRow}>
                        <div style={{margin: 5}}>
                            <Button type="primary" disabled={!subscribeActive} onClick={this.onClickSubscribe.bind(this)}>Subscribe</Button>
                        </div>
                        <div style={{margin: 5}}>
                            <Button type="primary" disabled={!subscribeActive} onClick={this.onClickUnsubscribe.bind(this)}>Unsubscribe</Button>
                        </div>
                    </div>
                </div>
                <div style={style.header}>
                    Event View
                </div>
                <div style={style.table}>
                    {tableView}
                </div>
            </div>
        );
    }
}

/**
    Type: string;
    RequestKey: string; 
    Schema: string;
    External: boolean;
    Object: string;
    Info: string;
    cellId: string;
    Subject: string;
 */
const TableColumns = [
    {
        label: "Date",
        prop: "date",
        width: 120,
    },
    {
        label: "cellId",
        prop: "cellId",
        width: 120,
    },
    {
        label: "Type",
        prop: "Type",
        width: 100,
    },
    {
        label: "RequestKey",
        prop: "RequestKey",
        width: 130,
    },
    {
        label: "Object",
        prop: "Object",
        width: 250,
    },
    {
        label: "Info",
        prop: "Info",
        width: 250,
    },
    {
        label: "Detail",
        prop: "Detail",
        width: 100,
    }
    // {
    //     label: "Subject",
    //     prop: "Subject",
    //     width: 180,
    // },
    // {
    //     label: "Schema",
    //     prop: "Schema",
    //     width: 180,
    // },
    // {
    //     label: "External",
    //     prop: "External",
    //     width: 180,
    // },
];

const StateTableColumns = [
    {
        label: "Cell",
        prop: "cell",
        width: 130,
    },
    {
        label: "authorized",
        prop: "authorized",
        width: 120,
    },
    {
        label: "expires_in",
        prop: "expires_in",
        width: 200,
    },
    {
        label: "subscribed",
        prop: "subscribe_list",
        width: 400,
    },
];


const style: any = {
    header: { 
        width: 400,
        margin: 30,
        color: "#6594e0",
        borderBottom: "solid 2px #6594e0",
    },
    card: {
        width: 400,
        margin: 30,
    },
    table: {
        width: "90%",
        margin: 30,
    },
    flexColumn: { 
        display: "flex", 
        flexDirection: "column" 
    },
    flexRow: { 
        display: "flex",
        flexDirection: "row",
        margin: 5, 
    },
};

