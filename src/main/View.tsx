import * as React from "react";
import { Menu, Notification } from "element-react";

import * as _ from "underscore";

import {MainState, ViewerType} from "./reducer";
import {MainActionDispatcher} from "./Container";

import RuleViewer from "./rule-viewer/Container";
import EventViewer from "./event-viewer/Container";
import RuleEditor from "./rule-editor/Container";
import { WebSocketWrapper } from "./WebSocketWrapper";
import {Config} from "./sagas";

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

export interface JSONEvent {
    Type: string;
    RequestKey: string; 
    Schema: string;
    External: boolean;
    Object: string;
    Info: string;
    cellId: string;
    Subject: string;
}

export class Main extends React.Component<Props, {}> {
    wslist: {[cellName: string]: WebSocketWrapper} = {};

    constructor(props: Props, state: any) {
        super(props, state);
    }

    initializeWebSocket() {
        console.log("initializeWebSocket"); // 2回呼ばれてない？

        const cells = this.props.mainState.cells;
        cells.forEach((cell) => {
            const host = config.host;
            const endpoint = "wss://"+host+"/"+cell.Name+"/__event";
            
            const access_token = config.master || this.props.mainState.client.personiumToken.access_token;
            const ws = new WebSocketWrapper(endpoint, access_token);
            
            const onConnect = ()=>{
                // console.log("onConnect");
                this.props.actions.connected(cell.Name, true);
            };
            const onData = (packet: any)=>{
                // console.log("onData:" , packet);
                this.props.actions.receiveEvent(cell.Name, packet);
            };
            const onDisconnect = ()=>{
                // console.log("onDisconnect");
                this.props.actions.connected(cell.Name, false);
            };
            ws.enter(onConnect, onData, onDisconnect);
            setTimeout(()=>{
                ws.subscribe("cellctl.Rule.create", "*"); 
                ws.subscribe("*", "*"); 
                this.wslist[cell.Name] = ws;
            }, 500);
        });
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

    componentWillUnmount() {
        Object.keys(this.wslist).forEach((cellName) => {
            this.props.actions.connected(cellName, false);
            this.wslist[cellName].exit();
        });
    }
    

    onSelect(item: ViewerType, itemDetail: string[]) {
        if(_.include(ViewerType, item)) {
            this.props.actions.select(item);
        }else {
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
                    <Menu.SubMenu index="Cell" title={this.props.mainState.cell}>
                        {cellListView}
                    </Menu.SubMenu>
                    <Menu.Item index="1">Rule Viewer</Menu.Item>
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
