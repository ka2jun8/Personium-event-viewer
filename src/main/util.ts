export function toJSON(packet: any) {
    let json: any = null;
    const text = packet && packet.data;
    if(text) {
        try {
            json = JSON.parse(text);
        }catch(e){
            //
        }
    }
    return json;
}
