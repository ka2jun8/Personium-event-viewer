export class WebSocketWrapper {
    endpoint: string = null;
    token: string = null;
    ws: WebSocket = null;

    constructor(endpoint: string, token: string) {
        this.endpoint = endpoint;
        this.token = token;
    }
    enter(onConnect: ()=>void, onData: (message: any)=>void, onDisconnect: ()=>void) {
        this.ws = new WebSocket(this.endpoint);
        this.ws.onopen = () => {
            const tokenInfo = {access_token: this.token};
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
        const subscribeInfo = {subscribe: {Type: type, Object: path}};
        this.ws.send(JSON.stringify(subscribeInfo));
    }

    unsubscribe(type: string, path: string) {
        const subscribeInfo = {unsubscribe: {Type: type, Object: path}};
        this.ws.send(JSON.stringify(subscribeInfo));
    }

    exit() {
        this.ws.close();
    }

    send(packet: any) {
        this.ws.send(packet);
    }
}
