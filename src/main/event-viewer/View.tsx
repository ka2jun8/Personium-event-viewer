import * as React from "react";
import { Card, Input, Button } from "element-react";
import * as _ from "underscore";
import {PersoniumAccessToken} from "personium-client";
import {EventViewerState, } from "./reducer";
import {EventViewerActionDispatcher} from "./Container";
import { JSONEvent } from "../View";

interface Props {
    eventState: EventViewerState,
    actions: EventViewerActionDispatcher,
}

export class EventViewer extends React.Component<Props, {}> {
    render() {
        const event: JSONEvent = this.props.eventState.event;
        const jsonText = event && JSON.stringify(event, null, "    ")

        return (
            <div style={style.main}>
            <Card
                className="box-card"
                header={
                    <div className="clearfix">
                    <span style={{ "lineHeight": "36px" }}>Event</span>
                    <span style={{ "float": "right" }}>
                        <Button type="primary">Detail</Button>
                    </span>
                    </div>
                }
                >
                <Input
                    style={style.code}
                    type="textarea"
                    value={jsonText}
                    rows={20}
                />
            </Card>
            </div>
        );
    }
}

const style: any = {
    main: {
        width: 400,
        margin: 30,
    },
    code: { 
        // height: 500,
        // wordBreak: "break-all",
    }
};

