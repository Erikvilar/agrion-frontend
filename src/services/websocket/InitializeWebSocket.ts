import { Client, IMessage } from "@stomp/stompjs";
import eventBus, { WSMessage } from "./eventBus"
import apiConfig from "@/api/api.config";

let client: Client | null = null;

export const initializeWebSocket = (roles: string[] = [], token: string): void => {
    if (!token) return;
    if (client?.active) {
        return;
    }

    if (client) {
        client.deactivate();
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    const host =  apiConfig.URL;


    client = new Client({
        brokerURL: `${protocol}//${host}/ws/websocket`,
        connectHeaders: {
            Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: (str) => {
            if (process.env.NODE_ENV === 'development' || 'local') {
                if (str.includes("Web Socket Opened") || str.includes("DISCONNECT")) {

                }
            }
        },
    });

    client.onConnect = () => {

        client?.subscribe('/user/queue/notifications', (msg: IMessage) => {
            processMessage(msg);
        });

        roles.forEach((role) => {

            if (role.startsWith("ROLE_")) {
                client?.subscribe(`/topic/role/${role}`, (msg: IMessage) => {
                    processMessage(msg);
                });
            }
        });
    };

    const processMessage = (msg: IMessage) => {
        try {
            const data: WSMessage = JSON.parse(msg.body);
            eventBus.emit("messageReceived", data);
        } catch (e) {
            eventBus.emit("messageReceived", { message: msg.body });
        }
    };

    client.onStompError = () => {

        console.error("Erro de comunicação segura.");
    };

    client.activate();
};

export const disconnectWebSocket = (): void => {
    if (client) {
        client.deactivate();
        client = null;
    }
};