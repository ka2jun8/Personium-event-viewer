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
}


class WebSocketWrapper {
    host: string = null;
    token: string = null;
    ws: WebSocket = null;

    constructor(host: string, token: string) {
        this.host = host;
        this.token = token;
    }
    enter(cell: string, onConnect: () => void, onData: (message: any) => void, onDisconnect: () => void) {
        const endpoint = "wss://"+this.host+"/"+cell+"/__event";
        // console.log("connect WebSocket: ", endpoint );
        this.ws = new WebSocket(endpoint);
        this.ws.onopen = () => {
            const tokenInfo = { access_token: this.token };
            this.ws.send(JSON.stringify(tokenInfo));
            onConnect();
        }
        this.ws.onmessage = (message) => {
            onData(message);
        }
        this.ws.onerror = (e) => {
            console.error("Error ", e);
        }
        this.ws.onclose = () => {
            onDisconnect();
        }
    }

    subscribe(type: string, path: string) {
        const subscribeInfo = { subscribe: { Type: type, Object: path } };
        this.ws.send(JSON.stringify(subscribeInfo));
    }

    unsubscribe(type: string, path: string) {
        const unsubscribeInfo = { unsubscribe: { Type: type, Object: path } };
        this.ws.send(JSON.stringify(unsubscribeInfo));
    }

    exit() {
        this.ws.close();
    }

    send(packet: any) {
        this.ws.send(packet);
    }
}
