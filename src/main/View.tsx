import * as React from "react";
import { Menu, Notification } from "element-react";

import * as _ from "underscore";
import * as moment from "moment";

import {MainState, ViewerType} from "./reducer";
import {MainActionDispatcher} from "./Container";

import RuleViewer from "./rule-viewer/Container";
import EventViewer from "./event-viewer/Container";
import RuleEditor from "./rule-editor/Container";
import { WebSocketWrapperManager } from "./WebSocketWrapper";
import {Config} from "./sagas";
import { toJSON } from "./util";

declare const config: Config;

interface Props {
    mainState: MainState,
    actions: MainActionDispatcher,
}

export interface Cell {
    Name: string;
}

export interface Packet {
    data: any,
}

export interface WebSocketState {
    Response: string;
    Result: string;
    Cell?: string;
    ExpiresIn?: number;
    Subscriptions?: {Type: string, Object: string}[];
    Authorized?: boolean;
    Timestamp: number;
}

export interface JSONEvent {
    Name?: string;
    Timestamp?: string;
    Type: string;
    RequestKey: string; 
    Schema: string;
    External: boolean;
    Object: string;
    Info: string;
    Subject: string;
    Detail?: any;
}

export class Main extends React.Component<Props, {}> {
    constructor(props: Props, state: any) {
        super(props, state);
    }

    initializeWebSocket() {
        // console.log("initializeWebSocket"); 

        const cells = this.props.mainState.cells;
        let length = cells.length;
        if(length > 200) {
            length = 200;
        }
        for(let i=0; i<length; i++) { // almost limit max
            const cell = cells[i];
            const host = config.host;
            
            const access_token = config.master || this.props.mainState.client.personiumToken.access_token;
            const wsman = WebSocketWrapperManager.getInstance(host);
            const onConnect = ()=>{
                console.log("onConnect["+cell.Name+"]: ", moment().format("YYYY-MM-DD HH:mm:ss"));
                this.props.actions.connected(cell.Name, true);
            };
            const onData = (packet: any)=>{
                const dataJson = toJSON(packet);
                // console.log("onData: dataJson:" , dataJson);
                if(dataJson){
                    if(dataJson.Type) {
                        // event
                        this.props.actions.receiveEvent(cell.Name, packet);
                    }else {
                        // state
                        this.props.actions.receiveState(cell.Name, dataJson);
                    }
                }
            };
            const onDisconnect = ()=>{
                console.log("onDisconnect["+cell.Name+"]: ", moment().format("YYYY-MM-DD HH:mm:ss"));
                this.props.actions.connected(cell.Name, false);
            };
            wsman.create(cell.Name, access_token, onConnect, onData, onDisconnect);
        };
        this.props.actions.websocketInitialized();
    }

    componentDidMount() {
        // console.log("componentDidMount");
        if(config.event && !this.props.mainState.websocketInitialized) {
            let initilizeTimer = setInterval(()=>{
                if(this.props.mainState.cells.length > 0) {
                    clearInterval(initilizeTimer);
                    setTimeout(this.initializeWebSocket.bind(this), 0);
                }
            }, 500);
        }
    }

    componentDidUpdate() {
        if(this.props.mainState.stateChecking) {
            const wsman = WebSocketWrapperManager.getInstance();
            wsman.checkState();
            this.props.actions.checkedState();
        }
        if(this.props.mainState.reconnecting) {
            const wsman = WebSocketWrapperManager.getInstance();
            wsman.reconnect();
            this.props.actions.reconnected();
        }
        if(this.props.mainState.exevent) {
            const wsman = WebSocketWrapperManager.getInstance();
            wsman.exevent();
            this.props.actions.exevented();
        }
    }

    componentWillUnmount() {
        const wsman = WebSocketWrapperManager.getInstance();
        wsman.dispose();
    }
    

    onSelect(item: ViewerType, itemDetail: string[]) {
        if(_.include(ViewerType, item)) {
            this.props.actions.select(item);
        }else {
            this.props.actions.select(ViewerType.RuleViewer);
            this.props.actions.selectCell(item);
        }
    }

    render() {
        let MainContents = <div/>;

        if(this.props.mainState.viewer === ViewerType.RuleViewer) {
            MainContents = <RuleViewer />;
        }else if(this.props.mainState.viewer === ViewerType.EventViewer) {
            MainContents = <EventViewer />;
        }else if(this.props.mainState.viewer === ViewerType.RuleEditor) {
            MainContents = <RuleEditor />;
        }

        const cellListView = this.props.mainState.cells.map((cell, index)=>{
            return (
                <Menu.Item key={index} index={cell.Name}>{cell.Name}</Menu.Item>
            );
        });

        const message = this.props.mainState.notifyMessage;
        if(message) {
            setTimeout(()=>{
                Notification({
                    title: "Event received!",
                    message: message,
                });
            }, 0);
        }

        return (
            <div>
                <Menu defaultActive="1" className="el-menu-demo" mode="horizontal" onSelect={this.onSelect.bind(this)}>
                    <Menu.SubMenu index="1" title="Rule Viewer">
                        {cellListView}
                    </Menu.SubMenu>
                    <Menu.Item index="2">Event Viewer</Menu.Item>
                    <Menu.Item index="3">Rule Editor</Menu.Item>
                </Menu>
                <div>
                    {MainContents}
                </div>
            </div>
        );
    }
}

