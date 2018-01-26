import * as React from "react";
import { Input, Button, Message } from "element-react";
import * as _ from "underscore";
import { RuleEditorState } from "./reducer";
import { RuleEditorActionDispatcher } from "./Container";

interface Props {
    ruleEditorState: RuleEditorState,
    actions: RuleEditorActionDispatcher,
}

export class RuleEditor extends React.Component<Props, {}> {
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

        return (
            <div style={style.width}>
                <div style={style.flexColumn}>
                    <div style={style.flexRow}>
                        ID: 
                    </div>
                    <div style={style.flexRow}>
                        <Input value={this.props.ruleEditorState.id || ""} placeholder="id/Name" onChange={this.onChangeId.bind(this)}/>
                    </div>
                    <div style={style.flexRow}>
                        Action: 
                    </div>
                    <div style={style.flexRow}>
                        <Input value={this.props.ruleEditorState.action || ""} placeholder="Action" onChange={this.onChangeAction.bind(this)}/>
                    </div>
                    <div style={style.flexRow}>
                        Type: 
                    </div>
                    <div style={style.flexRow}>
                        <Input value={this.props.ruleEditorState.type || ""} placeholder="Type" onChange={this.onChangeType.bind(this)}/>
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
                        <Input value={this.props.ruleEditorState.box || ""} placeholder="Box" onChange={this.onChangeBox.bind(this)}/>
                    </div>
                    <div style={style.flexRow}>
                        <Button type="primary" onClick={this.onClick.bind(this)}>Commit</Button>
                    </div>
                </div>
            </div>
        );
    }
}
const style: any = {
    width: { width: "60%", margin: 30 },
    flexColumn: { display: "flex", flexDirection: "column" },
    flexRow: { display: "flex", flexDirection: "row" },
};

