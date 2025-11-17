import { useState, useCallback } from "react";
import Notification from "./Notification";
import type { ActionType } from "../components/modal-informativo/Component";

export const useNotification = () => {
  const [notification, setNotification] = useState<{
    type?: typeof ActionType[keyof typeof ActionType];
    title: string;
    message: string | React.ReactNode;
    open: boolean;
    onConfirm?: () => void; 
  }>({
    type: undefined,
    title: "",
    message: "",
    open: false,
  });

  const showNotification = useCallback(
    (
      type: typeof ActionType[keyof typeof ActionType],
      title: string,
      message: string | React.ReactNode,
      onConfirm?: () => void 
    ) => {
      setNotification({ type, title, message, open: true, onConfirm });
    },
    []
  );
  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);


  const handleConfirm = useCallback(() => {
    if (notification.onConfirm) {
      notification.onConfirm(); 
    }
    closeNotification(); 
  }, [notification.onConfirm, closeNotification]);


  const NotificationModal = (
    <Notification
      type={notification.type}
      title={notification.title}
      message={notification.message}
      isOpen={notification.open}
      onClose={closeNotification}
      onConfirm={handleConfirm} 
    />
  );

  return { showNotification, NotificationModal };
};
