import EventEmitter from "eventemitter3";

export interface WSMessage {
    message: string;
    [key: string]: any;
}

const eventBus = new EventEmitter<{
    messageReceived: (data: WSMessage) => void;
}>();

export default eventBus;