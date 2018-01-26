import * as React from "react";
import { Card, Input, Button, Table, MessageBox, Message } from "element-react";
import * as _ from "underscore";
import { PersoniumAccessToken } from "personium-client";
import { EventViewerState, } from "./reducer";
import { EventViewerActionDispatcher } from "./Container";
import { JSONEvent } from "../View";

interface Props {
    eventState: EventViewerState,
    actions: EventViewerActionDispatcher,
}

export class EventViewer extends React.Component<Props, {}> {
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
        this.props.actions.subscribe({type: this.props.eventState.subscribeType, object: this.props.eventState.subscribeObject});
    }

    onClickUnsubscribe() {
        this.props.actions.unsubscribe({type: this.props.eventState.subscribeType, object: this.props.eventState.subscribeObject});
    }

    onClickDetail(eventText: string) {
        MessageBox.msgbox({
            title: "JSON",
            message: eventText,
            confirmButtonText: "OK",
        });

    }

    render() {
        const eventList: JSONEvent[] = this.props.eventState.eventList.map((event)=>{
            const _event: JSONEvent = _.assign({}, event);
            _event.Detail = null;
            const jsonText = _event && JSON.stringify(_event, null, "    ");
            _event.Detail = <span style={{ "float": "right" }}>
                                <Button type="primary" onClick={this.onClickDetail.bind(this, jsonText)}>JSON</Button>
                            </span>;
            return _event;
        });

        let tableView = <div/>
        if(this.props.eventState.eventList.length > 0) {
            tableView = <Table
                style={{ width: "100%" }}
                columns={TableColumns}
                data={eventList}
            />
        }

        return (
            <div>
                <div style={style.card}>
                    <div style={style.flexColumn}>
                        <div style={style.flexRow}>
                            Cell: 
                        </div>
                        <div style={style.flexRow}>
                            <Input value={this.props.eventState.cell || ""} placeholder="Cell" onChange={this.onChangeCell.bind(this)}/>
                        </div>
                    </div>
                    <div>
                        <div style={style.flexRow}>
                            Subscribe Type: 
                        </div>
                        <div style={style.flexRow}>
                            <Input value={this.props.eventState.subscribeType || ""} placeholder="Type" onChange={this.onChangeType.bind(this)}/>
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
                            <Button type="primary" onClick={this.onClickSubscribe.bind(this)}>Subscribe</Button>
                        </div>
                        <div style={{margin: 5}}>
                            <Button type="primary" onClick={this.onClickUnsubscribe.bind(this)}>Unsubscribe</Button>
                        </div>
                    </div>
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
        width: 180,
    },
    {
        label: "cellId",
        prop: "cellId",
        width: 180,
    },
    {
        label: "Type",
        prop: "Type",
        width: 180,
    },
    {
        label: "RequestKey",
        prop: "RequestKey",
        width: 180,
    },
    {
        label: "Object",
        prop: "Object",
        width: 180,
    },
    {
        label: "Info",
        prop: "Info",
        width: 180,
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


const style: any = {
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
        flexDirection: "row" 
    },
};

