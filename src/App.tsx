
import RouterSwitch from "./router/RouterSwitch";
import './index.module.css';
import {useNotification} from "@/hooks/useNotification";
import {ActionType} from "@/components/modal-help/ModalHelper";
import {useEffect} from "react";

function App() {
  const {NotificationModal,showNotification} = useNotification();

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


  return (
<div >
  {NotificationModal}
    <RouterSwitch />
</div>
  )
}
export default App
