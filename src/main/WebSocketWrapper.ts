export class WebSocketWrapperManager {
    public static getInstance(host?: string) {
        if (WebSocketWrapperManager._instance === null) {
            WebSocketWrapperManager._instance = new WebSocketWrapperManager(host);
        }
        return WebSocketWrapperManager._instance;
    }
    private static _instance: WebSocketWrapperManager = null;
    private static host: string = null;
    private wslist: {[cellName: string]: WebSocketWrapper} = {};

    constructor(host: string) {
        if (WebSocketWrapperManager._instance) {
            throw new Error("Dispatcher instance is singleton.");
        }
        WebSocketWrapperManager.host = host;
        WebSocketWrapperManager._instance = this;
    }

    create(cell: string, token: string, onConnect: () => void, onData: (message: any) => void, onDisconnect: () => void) {
        if(WebSocketWrapperManager.host) {
            const ws: WebSocketWrapper = new WebSocketWrapper(WebSocketWrapperManager.host, token);
            ws.enter(cell, onConnect, onData, onDisconnect);
            this.wslist[cell] = ws;
        }
    }

    dispose(cell?: string, disconnected?: (cell: string)=>void) {
        // console.log("dispose");
        if(cell && this.wslist[cell]){
            this.wslist[cell].exit();
            disconnected(cell);
        }else {
            Object.keys(this.wslist).forEach((cellName) => {
                if(this.wslist[cell]) {
                    disconnected(cellName);
                    this.wslist[cellName].exit();
                }
            });
        }
    }

    subscribe(type: string, object: string, cell?: string) {
        // console.log("subscribe: ", {type, object, cell});
        if(cell && this.wslist[cell]){
            this.wslist[cell].subscribe(type, object);
        }else {
            Object.keys(this.wslist).forEach((cellName) => {
                if(this.wslist[cellName]) {
                    this.wslist[cellName].subscribe(type, object);
                }
            });
        }
    }

    unsubscribe(type: string, object: string, cell?: string) {
        if(cell && this.wslist[cell]){
            this.wslist[cell].unsubscribe(type, object);
        }else {
            Object.keys(this.wslist).forEach((cellName) => {
                if(this.wslist[cellName]) {
                    this.wslist[cellName].unsubscribe(type, object);
                }
            });
        }
    }

    checkState(cell?: string) {
        if(cell && this.wslist[cell]){
            this.wslist[cell].checkState();
        }else {
            Object.keys(this.wslist).forEach((cellName) => {
                if(this.wslist[cellName]) {
                    this.wslist[cellName].checkState();
                }
            });
        }
    }
    
    reconnect(cell?: string) {
        if(cell && this.wslist[cell]){
            this.wslist[cell].reconnect();
        }else {
            Object.keys(this.wslist).forEach((cell) => {
                if(this.wslist[cell]) {
                    this.wslist[cell].reconnect();
                }
            });
        }
    }

    exevent(cell?: string, event?: any) {
        if(cell && this.wslist[cell]){
            this.wslist[cell].exevent(event);
        }else {
            Object.keys(this.wslist).forEach((cell) => {
                if(this.wslist[cell]) {
                    this.wslist[cell].exevent(event);
                }
            });
        }
    }
    
}


class WebSocketWrapper {
    host: string = null;
    token: string = null;
    ws: WebSocket = null;
    cell: string = null;
    onConnect: ()=>void = null;
    onData: (message: any)=>void = null;
    onDisconnect: ()=>void = null;

    constructor(host: string, token: string) {
        this.host = host;
        this.token = token;
    }
    enter(cell: string, onConnect: () => void, onData: (message: any) => void, onDisconnect: () => void) {
        this.cell = cell;
        const endpoint = "wss://"+this.host+"/"+cell+"/__event";
        this.onConnect = onConnect;
        this.onData = onData;
        this.onDisconnect = onDisconnect;
        console.log("connect WebSocket: ", {endpoint, token: this.token} );
        this.ws = new WebSocket(endpoint);
        this.ws.onopen = () => {
            const tokenInfo = { access_token: this.token };
            this.ws.send(JSON.stringify(tokenInfo));
            this.onConnect();
        }
        this.ws.onmessage = (message) => {
            this.onData(message);
        }
        this.ws.onerror = (e) => {
            console.error("Error ", e);
        }
        this.ws.onclose = () => {
            this.onDisconnect();
        }
    }

    checkState() {
        const state = {state: "all"};
        this.ws.send(JSON.stringify(state));
    }

    subscribe(type: string, path: string) {
        const subscribeInfo = { subscribe: { Type: type, Object: path } };
        this.ws.send(JSON.stringify(subscribeInfo));
    }

    unsubscribe(type: string, path: string) {
        const unsubscribeInfo = { unsubscribe: { Type: type, Object: path } };
        this.ws.send(JSON.stringify(unsubscribeInfo));
    }

    reconnect() {
        this.ws.close();
        setTimeout(()=>{
            this.enter(this.cell, this.onConnect.bind(this), this.onData.bind(this), this.onDisconnect.bind(this));
        }, 0);
    }

    exevent(event?: any) {
        let jsonevent = {}
        if(event) {
            jsonevent = {event: {
                Type: event.type,
                Info: event.info,
                Object: event.object,
                Subject: event.subject,
            }};
        }else {
            jsonevent = {event: {
                Type: "type",
                Info: "info",
                Object: "object",
                Subject: "subject",
            }};
        }
        this.ws.send(JSON.stringify(jsonevent));
    }

    exit() {
        this.ws.close();
        this.cell = null;
        this.onConnect = null;
        this.onData = null;
        this.onDisconnect = null;
    }

    send(packet: any) {
        this.ws.send(packet);
    }
}
