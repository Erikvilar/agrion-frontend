import { Route, Routes, useNavigate} from "react-router-dom";
// import { useIsMobile } from "../hooks/useIsMobile";
// import Adaptive from "../components/adaptive-component/Component";
// import MenuLeft from "../components/menu/Component";

import { LoginScreen } from "../pages/login/LoginScreen";
import Principal from "@/pages/principal/Principal";

import { useEffect, useState } from "react";

import { useNotification } from "../hooks/useNotification";

import Suporte from "@/pages/suporte/suporte";
import Controle from "@/pages/controle/Controle";
import Historico from "../pages/historico/Historico";
import {Box} from "@mui/material";

const RouterSwitch = () => {

    // const isMobile = useIsMobile();
    // const location = useLocation();
    const navigation = useNavigate()
    const {  NotificationModal } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false)
    // const pathAtual = location.pathname;
    // const avatarDefault ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQacUh90SamEZDJyLexiUhv232yT4JkGgedIQ&s";
    //
    // const [icon, setIcon] = useState<string>(avatarDefault);

    useEffect(() => {
        // const avatar = localStorage.getItem("avatar");

        // const iconAvatar = avatar?.trim()
        //     ? avatar
        //     : avatarDefault;
        //
        // setIcon(iconAvatar);
    }, [navigation]);



    // const handleLogout = async () => {
    //     const user = localStorage.getItem("login")
    //     const logoutUser: string = user?.trim() ? user : "";
    //     const logoutPlain: UserDTO = {
    //         login: logoutUser,
    //         password: ""
    //     }
    //     console.log(logoutPlain)
    //     const { status, success, data, } = await ApiServices.logout(logoutPlain)
    //     console.log(status, success, data)
    //     if (success) {
    //         localStorage.setItem("token", "");
    //         localStorage.setItem("user", "")
    //         localStorage.setItem("avatar", "");
    //         showNotification(ActionType.Success, "Usuario deslogado", "O usuário foi deslogado com sucesso")
    //         navigation("/")
    //     }
    //     if (status == 500) {
    //         showNotification(ActionType.Warning, "Ocorreu um erro ao fazer logout", "")
    //     }
    //
    //
    // }


    // const isPageLogin = pathAtual == "/";
    return (

      <Box>
            {NotificationModal}
            <Routes>
                <Route path="/agrion" element={<LoginScreen />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/suporte" element={< Suporte/>} />
                <Route path="/principal" element={<Principal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />} />
                <Route path="/controle" element={<Controle/>}/>
            </Routes>

      </Box>

    )


}
export default RouterSwitch;