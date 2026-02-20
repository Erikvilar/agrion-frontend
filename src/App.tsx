import RouterSwitch from "./router/RouterSwitch";
import './index.css';
import { useNotification } from "@/hooks/useNotification";
import { ActionType } from "@/components/modal-help/ModalHelper";
import { useEffect } from "react";
import { disconnectWebSocket, initializeWebSocket } from "@/services/websocket/InitializeWebSocket";



function App() {
  const { NotificationModal, showNotification } = useNotification();

  useEffect(() => {
    const handleGlobalError = (event: any) => {
      const { title, message } = event.detail;
      showNotification(ActionType.Warning, title, message);
    };
    window.addEventListener('APP_API_ERROR', handleGlobalError);
    return () => {
      window.removeEventListener('APP_API_ERROR', handleGlobalError);
    };
  }, [showNotification]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roles = ["ROLE_LOGISTICA","ROLE_PORTARIA","ROLE_GERENCIAL","ROLE_ADMIN"];

    if (token) {
      initializeWebSocket(roles, token);
    }

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (

        <div>
          {NotificationModal}
          <RouterSwitch />
        </div>

  )
}

export default App;