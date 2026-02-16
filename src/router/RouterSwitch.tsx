import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/login/Login";
import Principal from "@/pages/principal/Principal";
import { useState } from "react";
import { useNotification } from "../hooks/useNotification";
import Suporte from "@/pages/suporte/suporte";
import Controle from "@/pages/controle/Controle";
import Historico from "../pages/historico/Historico";
import {Box} from "@mui/material";


const RouterSwitch = () => {


    const {  NotificationModal } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false)



    const routesPath =[
        {
            path: "/agrion/",
            component:<Login/>
        },
        {
            path: "/agrion/historico",
            component:<Historico/>

        },
        {
            path: "/agrion/suporte",
            component:<Suporte/>

        },
        {
            path:"/agrion/principal",
            component:<Principal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
        },
        {
            path:"/agrion/controle",
            component:<Controle/>
        }



    ]

    const RoutesCreate =()=>{
        return (
            <Box>
                {NotificationModal}
                <Routes>
                    {routesPath.map((value,)=> <Route path={value.path} element={value.component}/>)}
                </Routes>
            </Box>
            )

    }


    return <RoutesCreate/>




}
export default RouterSwitch;