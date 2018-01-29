import * as React from "react";
import { Menu, Layout, Button, Message, MessageBox } from "element-react";
import * as _ from "underscore";

import { RuleViewerState, BoxRuleListMap } from "./reducer";
import { RuleViewerActionDispatcher } from "./Container";
import { Config } from "../sagas";

declare const config: Config;

export interface Rule {
    __id?: string;
    Name?: string;
    External?: boolean;
    TargetUrl: string;
    Action: string;
    EventType: string;
    EventObject: string;
    "_Box.Name"?: string;
}

interface Props {
    ruleState: RuleViewerState,
    actions: RuleViewerActionDispatcher,
}

export class RuleViewer extends React.Component<Props, {}> {
    onSelectMenuItem(itemIndex: string) {
        const boxRuleListMap = this.props.ruleState.boxRuleListMap;

        const splittedItemInfo = itemIndex.split(".");
        const boxNameOfselectedRule = splittedItemInfo[0];
        const collectionNameOfselectedRule = splittedItemInfo[1];
        const indexOfselectedRule = Number(splittedItemInfo[2]);
        const selectedRule = boxRuleListMap[boxNameOfselectedRule][collectionNameOfselectedRule][indexOfselectedRule];

        this.props.actions.selectedRule(selectedRule, boxNameOfselectedRule);
    }

    onClickDelete(selectedRule: Rule) {
        MessageBox.confirm("Are you sure?", "Delete Rule", {
            type: "warning",
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
        }).then(() => {
            const id = selectedRule.Name || selectedRule.__id;
            const cell = config.cell || this.props.ruleState.cell;
            return this.props.ruleState.client.deleteRule(cell, id, selectedRule["_Box.Name"], config.master);
        }).then(() => {
            Message({
                type: "success",
                message: "Successed."
            });
            this.props.actions.reset(this.props.ruleState.cell);
        }).catch((error) => {
            error && console.error(error);
            Message({
                type: "info",
                message: "Canceled."
            });
        });
    }

    onClickEdit(selectedRule: Rule) {
        console.log();
        this.props.actions.editRule(selectedRule, selectedRule["_Box.Name"]);
    }

    render() {
        const rules = this.props.ruleState.rules;
        const boxNameList = this.props.ruleState.boxNameList;
        const boxRuleListMap = this.props.ruleState.boxRuleListMap;
        const selectedRule = this.props.ruleState.selectedRule || rules[0];

        return (
            <div>
                <Layout.Row className="tac">
                    <Layout.Col span={4}>
                        <Menu mode="vertical" defaultActive="1" className="el-menu-vertical-demo" onSelect={this.onSelectMenuItem.bind(this)}>
                            {menuGroupView(boxNameList, boxRuleListMap)}
                        </Menu>
                    </Layout.Col>
                    <Layout.Col span={8}>
                        <div style={style.header}>
                            {this.props.ruleState.cell}
                        </div>
                        <div style={style.card}>
                            {selectedRule && ruleCardView(selectedRule, this.onClickDelete.bind(this, selectedRule), this.onClickEdit.bind(this, selectedRule))}
                        </div>
                    </Layout.Col>
                </Layout.Row>
            </div>
        );
    }
}

function ruleCardView(rule: Rule, onClickDelete: (event: any) => void, onClickEdit:  (event: any) => void) {
    const eventType = rule.EventType || (rule as any).Type;
    const eventObject = rule.EventObject || (rule as any).Object;
    const service = rule.TargetUrl || (rule as any).Service;

    return (
        <div style={style.flexColumn}>
            <div style={style.flexRow}>
                <div style={style.label}>Id: </div>
                <div style={style.sentence}>{rule.__id}</div>
            </div>
            <div style={style.flexRow}>
                <div style={style.label}>Name: </div>
                <div style={style.sentence}>{rule.Name}</div>
            </div>
            <div style={style.flexRow}>
                <div style={style.label}>Action: </div>
                <div style={style.sentence}>{rule.Action}</div>
            </div>
            <div style={style.flexRow}>
                <div style={style.label}>Type: </div>
                <div style={style.sentence}>{eventType}</div>
            </div>
            <div style={style.flexRow}>
                <div style={style.label}>Object: </div>
                <div style={style.sentence}>{eventObject}</div>
            </div>
            <div style={style.flexRow}>
                <div style={style.label}>Service: </div>
                <div style={style.sentence}>{service}</div>
            </div>
            <div style={style.flexRow}>
                <div style={{margin: 10 }}>
                    <Button onClick={onClickEdit} type="primary">Edit</Button>
                </div>
                <div style={{margin: 10 }}>
                    <Button onClick={onClickDelete} type="danger">Delete</Button>
                </div>
            </div>
        </div>
    );
};

function itemGroupListView(boxRuleListMap: BoxRuleListMap, boxName: string) {
    let keyIndex = 0;
    const collectionListMap = boxRuleListMap[boxName];
    const collectionList: string[] = Object.keys(collectionListMap);
    const ItemGroup = collectionList.map((collectionName, collectionIndex) => {
        const rules = collectionListMap[collectionName];
        const ItemList = rules.map((rule, index) => {
            const _index = boxName + "." + collectionName + "." + index;
            const eventType = rule.EventType || (rule as any).Type;
            return <Menu.Item index={_index} key={keyIndex++}>{eventType}</Menu.Item>
        });
        return (
            <Menu.ItemGroup title={collectionName} key={collectionIndex}>
                {ItemList}
            </Menu.ItemGroup>
        );
    });
    return ItemGroup;
}

function menuGroupView(boxNameList: string[], boxRuleListMap: BoxRuleListMap) {
    const MenuGroup = boxNameList.map((boxName, groupIndex) => {
        return (
            <Menu.SubMenu index={groupIndex.toString()} title={boxName} key={groupIndex}>
                {itemGroupListView(boxRuleListMap, boxName)}
            </Menu.SubMenu>
        );
    });
    return MenuGroup;
}

const style: any = {
    header: { 
        margin: 30,
        color: "#6594e0",
        borderBottom: "solid 2px #6594e0",
    },
    card: { width: 600, margin: 30 },
    label: { width: 100 },
    sentence: { width: 400 },
    flexColumn: { display: "flex", flexDirection: "column" },
    flexRow: { display: "flex", flexDirection: "row" },
};

