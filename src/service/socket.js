import io from "socket.io-client";
let socket = null;
export function socketConnect(cb){
    if(!socket){
        socket = io('https://ptchatindia.herokuapp.com/', { transports: ['websocket'] });
    }
}
export function getSocket(){
    socketConnect();
    return socket;
}