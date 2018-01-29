import * as React from "react";
import { Input, Button, Message, Select } from "element-react";
import * as _ from "underscore";
import { RuleEditorState } from "./reducer";
import { RuleEditorActionDispatcher } from "./Container";

interface Props {
    ruleEditorState: RuleEditorState,
    actions: RuleEditorActionDispatcher,
}

export class RuleEditor extends React.Component<Props, {}> {
    onChangeCell(value: string) {
        this.props.actions.changeCell(value);
    }

    onChangeId(value: string) {
        this.props.actions.changeId(value);
    }

    onChangeAction(value: string) {
        this.props.actions.changeAction(value);
    }

    onChangeType(value: string) {
        this.props.actions.changeType(value);
    }

    onChangeObject(value: string) {
        this.props.actions.changeObject(value);
    }

    onChangeService(value: string) {
        this.props.actions.changeService(value);
    }

    onChangeBox(value: string) {
        this.props.actions.changeBox(value);
    }

    onClick() {
        this.props.actions.registerRule(this.props.ruleEditorState.cell, this.props.ruleEditorState);
    }

    render() {
        if(this.props.ruleEditorState.result) {
            setTimeout(()=>{
                Message({
                    type: "success",
                    message: "Successed."
                });
                this.props.actions.reset(this.props.ruleEditorState.cell);
            }, 0);
        }

        const cellList: string[] = _.union([], this.props.ruleEditorState.cellList);
        const cellListView = cellList.map(cell => {
            return <Select.Option key={cell} label={cell} value={cell} />
        })

        const actionListView = RuleActionList.map((action)=>{
            return <Select.Option key={action} label={action} value={action} />
        });

        const typeListView = RuleTypeList.map((type)=>{
            return <Select.Option key={type} label={type} value={type} />
        });

        const boxListView = this.props.ruleEditorState.boxList.map((box)=>{
            return <Select.Option key={box} label={box} value={box} />
        });

        return (
            <div>
                <div style={style.header}>
                        Rule Edit
                </div>
                <div style={style.width}>
                    <div style={style.flexColumn}>
                        <div style={style.flexRow}>
                            Cell: 
                        </div>
                        <div style={style.flexRow}>
                            <Select value={this.props.ruleEditorState.cell} onChange={this.onChangeCell.bind(this)} placeholder="Cell">
                                {cellListView}
                            </Select>
                        </div>
                    </div>
                    <div style={style.flexColumn}>
                        <div style={style.flexRow}>
                            ID: 
                        </div>
                        <div style={style.flexRow}>
                            <Input value={this.props.ruleEditorState.id || ""} placeholder="id/Name (No need to input for new rule)" onChange={this.onChangeId.bind(this)}/>
                        </div>
                        <div style={style.flexRow}>
                            Action: 
                        </div>
                        <div style={style.flexRow}>
                            <Select value={this.props.ruleEditorState.action} onChange={this.onChangeAction.bind(this)} placeholder="Action">
                                {actionListView}
                            </Select>
                        </div>
                        <div style={style.flexRow}>
                            Type: 
                        </div>
                        <div style={style.flexRow}>
                            <Select value={this.props.ruleEditorState.type} onChange={this.onChangeType.bind(this)} placeholder="Type">
                                {typeListView}
                            </Select>
                        </div>
                        <div style={style.flexRow}>
                            Object: 
                        </div>
                        <div style={style.flexRow}>
                            <Input value={this.props.ruleEditorState.object || ""} placeholder="Object" onChange={this.onChangeObject.bind(this)}/>
                        </div>
                        <div style={style.flexRow}>
                            Service: 
                        </div>
                        <div style={style.flexRow}>
                            <Input value={this.props.ruleEditorState.service || ""} placeholder="Service" onChange={this.onChangeService.bind(this)}/>
                        </div>
                        <div style={style.flexRow}>
                            Box: 
                        </div>
                        <div style={style.flexRow}>
                            <Select disabled={this.props.ruleEditorState.boxList.length === 0} value={this.props.ruleEditorState.box} onChange={this.onChangeBox.bind(this)} placeholder="Box">
                                {boxListView}
                            </Select>
                        </div>
                        <div style={style.flexRow}>
                            <Button type="primary" onClick={this.onClick.bind(this)}>Commit</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const style: any = {
    header: { 
        width: 400,
        margin: 30,
        color: "#6594e0",
        borderBottom: "solid 2px #6594e0",
    },
    width: { width: 400, margin: 30 },
    flexColumn: { display: "flex", flexDirection: "column" },
    flexRow: { display: "flex", flexDirection: "row", margin: 5 },
};

const RuleActionList = [
    "log",
    "exec",
    "relay",
];

const RuleTypeList = [
    // event for odata
    "odata",
    "odata.create",
    "odata.list",
    "odata.get",
    "odata.update",
    "odata.patch",
    "odata.delete",
    "odata.links",
    "odata.navprop",
    // event for cellctl
    "cellctl",
    // event for cell
    "cell",
    "cell.create",
    "cell.list",
    "cell.get",
    "cell.update",
    "cell.patch",
    "cell.delete",
    "cell.links",
    "cell.navprop",
    // event for davfile
    "davfile",
    "davfile.create",
    "davfile.list",
    "davfile.get",
    "davfile.update",
    "davfile.patch",
    "davfile.delete",
    "davfile.links",
    "davfile.navprop",
    // event for message
    "message",
    "message.send",
    "message.receive",
    "message.unread",
    "message.read",
    "message.approve",
    "message.reject",
    // other
    "service",
    "boxinstall",
    "exec",
    "import",
    "export",
];

