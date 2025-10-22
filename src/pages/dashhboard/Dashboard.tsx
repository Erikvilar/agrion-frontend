import { Box } from "@mui/material";

import style from "./styles.module.css"
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNavigate } from "react-router";




const Dashboard = () => {
    const isMobile = useIsMobile();
    const navigation = useNavigate()

    const routes = [
        { id: "1", pathname: "/lista_espera", title: "Lista de espera", icon: "" },
        { id: "2", pathname: "/cadastro", title: "Cadastrar veiculos", icon: "" },
        { id: "3", pathname: "Lista de veiculos", title: "", icon: "" },
        { id: "4", pathname: "Lista de veiculos", title: "", icon: "" },
    ]
    return (
        <Box sx={{ height: isMobile ? 500 : "80vh", display: "flex", alignItems: "center", flexDirection: "column", padding: isMobile ? 1 : 10 }}>
            <img src="https://www.datagroconferences.com/wp-content/uploads/2021/06/Agrionfertilizantes_site-1.png" width={isMobile ? "70%" : "20%"} />
            <span className={style.title}>Dashboard organizacional</span>
            <div className={isMobile ? style.containerMobile : style.containerDesktop}>
                {routes.map((value) => (
                    <button onClick={() => navigation(value.pathname)} style={{ border: "none", outline: " none", backgroundColor: "transparent" }}>
                        <div className={isMobile ? style.isMobile : style.isDesktop}>
                            <span id={value.id}>{value.title}</span>
                        </div>
                    </button>
                ))}
            </div>
        </Box>
    );


}


export default Dashboard;