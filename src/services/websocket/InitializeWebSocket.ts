import { Client, IFrame, IMessage } from "@stomp/stompjs";
import EventEmitter from "eventemitter3";

export interface WSMessage {
    message: string;
    [key: string]: any;
}

export const eventEmitter = new EventEmitter<{
    messageReceived: (data: WSMessage) => void;
}>();

let client: Client | null = null;

export const initializeWebSocket = (roles: string[] = [], token: string): void => {
    if (!token || (client && client.active)) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = "192.168.100.105:8081";
    const contextPath = "/v1/agrion";

    client = new Client({
        brokerURL: `${protocol}//${host}${contextPath}/ws/websocket`,
        connectHeaders: {
            Authorization: `Bearer ${token}`
        },
        debug: (str) => console.log("STOMP Debug:", str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    // Atribuindo os callbacks fora do construtor para evitar o aviso de "não usado"
    client.onConnect = (frame: IFrame) => {
        console.log("WebSocket Nativo Conectado! Frame:", frame);

        // Inscrição Individual
        client?.subscribe('/user/queue/notifications', (msg: IMessage) => {
            try {
                const data = JSON.parse(msg.body);
                eventEmitter.emit("messageReceived", data);
            } catch (e) {
                // Se o Java enviar String pura, encapsulamos num objeto
                eventEmitter.emit("messageReceived", { message: msg.body });
            }
        });

        // Inscrição por Roles
        roles.forEach((role: string) => {
            client?.subscribe(`/topic/role/${role}`, (msg: IMessage) => {
                try {
                    const data = JSON.parse(msg.body);
                    eventEmitter.emit("messageReceived", data);
                } catch (e) {
                    eventEmitter.emit("messageReceived", { message: msg.body });
                }
            });
        });
    };

    client.onStompError = (frame: IFrame) => {
        console.error("Erro STOMP detalhado:", frame.headers['message']);
        console.error("Corpo do erro:", frame.body);
    };

    client.activate();
};

export const disconnectWebSocket = (): void => {
    if (client) {
        client.deactivate();
        client = null;
        console.log("WebSocket desconectado.");
    }
};