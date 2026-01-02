import { Route, Routes, useLocation, useNavigate} from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import Adaptive from "../components/adaptive-component/Component";
import MenuLeft from "../components/menu/Component";

import { LoginScreen } from "../pages/login/LoginScreen";
import ListaEspera from "../pages/lista_espera/ListaEspera";

import { useEffect, useState } from "react";
import Historico from "../pages/historico/Historico";
import ApiServices from "../services/api-service";
import type UserDTO from "../model/UserDTO";
import { useNotification } from "../hooks/useNotification";
import { ActionType } from "../components/modal-informativo/Component";
import SuportePage from "../pages/contato_suporte/SuportePage";


const RouterSwitch = () => {

    const isMobile = useIsMobile();
    const location = useLocation();
    const navigation = useNavigate()
    const { showNotification, NotificationModal } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const pathAtual = location.pathname;
    const avatarDefault ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQacUh90SamEZDJyLexiUhv232yT4JkGgedIQ&s";

    const [icon, setIcon] = useState<string>(avatarDefault);

    useEffect(() => {
        const avatar = localStorage.getItem("avatar");

        const iconAvatar = avatar?.trim()
            ? avatar
            : avatarDefault;

        setIcon(iconAvatar);
    }, [navigation]);



    const handleLogout = async () => {
        const user = localStorage.getItem("login")
        const logoutUser: string = user?.trim() ? user : "";
        const logoutPlain: UserDTO = {
            login: logoutUser,
            password: ""
        }
        console.log(logoutPlain)
        const { status, success, data, } = await ApiServices.logout(logoutPlain)
        console.log(status, success, data)
        if (success) {
            localStorage.setItem("token", "");
            localStorage.setItem("user", "")
            localStorage.setItem("avatar", "");
            showNotification(ActionType.Success, "Usuario deslogado", "O usuário foi deslogado com sucesso")
            navigation("/")
        }
        if (status == 500) {
            showNotification(ActionType.Warning, "Ocorreu um erro ao fazer logout", "")
        }


    }


    const isPageLogin = pathAtual == "/";
    return (

        <Adaptive>
            {isMobile ?? ( <MenuLeft avatar={icon} isPageLogin={isPageLogin} setIsOpen={setIsModalOpen} handleLogout={handleLogout}/> )}

            {NotificationModal}

            <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/suporte" element={< SuportePage/>} />
                <Route path="/lista_espera" element={<ListaEspera setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />} />
            </Routes>


        </Adaptive>

    )


}
export default RouterSwitch;