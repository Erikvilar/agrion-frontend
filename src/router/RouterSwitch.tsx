import { Route, Routes, useLocation, useNavigate, type To } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import Adaptive from "../components/adaptive-component/Component";
import MenuLeft from "../components/menu/Component";
import styles from "./route.module.css"
import { LoginScreen } from "../pages/login/LoginScreen";
import ListaEspera from "../pages/lista_espera/ListaEspera";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useState } from "react";
import Historico from "../pages/historico/Historico";
const RouterSwitch = () => {
   
    const isMobile = useIsMobile();
    const location = useLocation();
    const avatar = localStorage.getItem("avatar");
    const [isModalOpen, setIsModalOpen] = useState(false)
    const pathAtual = location.pathname;

    const ButtonDefault =  ({className, route, children }:
        {className: string;
         route: To | number;
         children: React.ReactNode;
        }) =>{
             const navigation = useNavigate()
        return (
            <button className={className} 
            onClick={() => typeof route === "number"?  
                navigation(route) : 
                navigation(route)}>{children}</button>
        )
    }
    const condicionalRender = (path:string) =>{
        switch(path){
            case "/lista_espera":
                return <ButtonDefault className={styles.buttonDefault} route={-1} children={(<li><ArrowBackIosNewIcon sx={{fontSize:18,marginRight:1}} /> Voltar</li>)}/> 
            case "/":
                return (
                <>
                <ButtonDefault className={styles.buttonDefault} route="/lista_espera" children={(<li>Lista de espera</li>)}/>
                <ButtonDefault className={styles.buttonDefault} route="/historico" children={(<li>Histórico</li>)}/>
                </>
                     )
            default:
                return <ButtonDefault className={styles.buttonDefault} route={-1} children={(<li><ArrowBackIosNewIcon sx={{fontSize:18,marginRight:1}} /> Voltar</li>)}/>
        }       
    }

    const avatarDefault = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
    const iconAvatar:string | null = avatar != null ? avatar : avatarDefault
    const isPageLogin = pathAtual == "/" ? true :false;
    return (
        <Adaptive>
            {isMobile ?<MenuLeft avatar={iconAvatar} isPageLogin={isPageLogin} setIsOpen={setIsModalOpen}/> :
                <nav className={styles.navbar}>
                    <ul>
                        {condicionalRender(pathAtual)}
                    </ul>
                        <img src={iconAvatar} style={{ marginRight: 80, borderRadius: 360 }} width={40} height={40} />
                </nav>}



            <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/lista_espera" element={<ListaEspera  setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}/>} />
            </Routes>

    
        </Adaptive>

    )


}
export default RouterSwitch;