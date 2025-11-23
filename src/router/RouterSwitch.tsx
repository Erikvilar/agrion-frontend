import { Route, Routes, useLocation, useNavigate, type To } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import Adaptive from "../components/adaptive-component/Component";
import MenuLeft from "../components/menu/Component";
import styles from "./route.module.css"
import { LoginScreen } from "../pages/login/LoginScreen";
import ListaEspera from "../pages/lista_espera/ListaEspera";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
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
    const token = localStorage.getItem("token");
    const navigation = useNavigate()
    const { showNotification, NotificationModal } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const pathAtual = location.pathname;
    const avatarDefault =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQacUh90SamEZDJyLexiUhv232yT4JkGgedIQ&s";

    const [icon, setIcon] = useState<string>(avatarDefault);

    useEffect(() => {
        const avatar = localStorage.getItem("avatar");

        const iconAvatar = avatar?.trim()
            ? avatar
            : avatarDefault;

        setIcon(iconAvatar);
    }, [navigation]);

    const ButtonDefault = ({ className, route, children }:
        {
            className: string;
            route: To | number;
            children: React.ReactNode;
        }) => {

        return (
            <button className={className}
                onClick={() => typeof route === "number" ?
                    navigation(route) :
                    navigation(route)}>{children}</button>
        )
    }
    const condicionalRender = (path: string) => {
        switch (path) {
            case "/lista_espera":
                return <ButtonDefault className={styles.buttonDefault} route={-1} children={(<li><ArrowBackIosNewIcon sx={{ fontSize: 18, marginRight: 1 }} /> Voltar</li>)} />
            case "/":
                return (
                    <>
                        <ButtonDefault className={styles.buttonDefault} route="/lista_espera" children={(<li>Lista de espera</li>)} />
                        <ButtonDefault className={styles.buttonDefault} route="/historico" children={(<li>Histórico</li>)} />
                    </>
                )
            default:
                return <ButtonDefault className={styles.buttonDefault} route={-1} children={(<li><ArrowBackIosNewIcon sx={{ fontSize: 18, marginRight: 1 }} /> Voltar</li>)} />
        }
    }

    const handleLogout = async () => {
        const user = localStorage.getItem("login")
        const logoutUser: string = user?.trim() ? user : "";
        const logoutPlain: UserDTO = {
            login: logoutUser

        }
        console.log(logoutPlain)
        const { status, success, data, message } = await ApiServices.logout(logoutPlain)
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


    const isPageLogin = pathAtual == "/" ? true : false;
    return (

        <Adaptive>
            {isMobile ? <MenuLeft avatar={icon} isPageLogin={isPageLogin} setIsOpen={setIsModalOpen} handleLogout={handleLogout}/> :
                <nav className={styles.navbar}>
                    <ul>
                        {condicionalRender(pathAtual)}
                    </ul>
                    <div style={{ display: "flex", alignItems: "center" }}>

                        <img src={icon} style={{ marginRight: 20, borderRadius: 360, border: "2px solid green" }} width={40} height={40} />

                        {token != "" ? <button onClick={handleLogout} className={styles.buttonLogout} >

                            <span style={{ color: "white", fontSize: 15, fontWeight: 500 }}>
                                Fazer logout
                            </span>
                        </button> : <></>
                        }


                    </div>

                </nav>}

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