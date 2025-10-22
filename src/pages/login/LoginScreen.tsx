
import { Box, Button, FormControl, FormGroup, TextField } from "@mui/material"
import styles from "./styles.module.css"
import Container from "../../components/container-component/Component"
import { green } from "@mui/material/colors"
import type { LoadingIndicatorRef } from "../../components/loading-indicator/Component"
import LoadingIndicator from "../../components/loading-indicator/Component"
import { useRef, useState } from "react"
import { useIsMobile } from "../../hooks/useIsMobile"
import { useNavigate } from "react-router"
import type UserDTO from "../../model/UserDTO"
import ApiServices from "../../services/api-service"
import { InfoModal } from "../../components/modal-informativo/Component"
import { ActionType } from "../../components/modal-informativo/Component"
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

export type InfoState = {
    type?: "info" | "success" | "warning" | "error";
    title: string;
    icon: React.ReactElement,
    message: string;
};

export const LoginScreen = () => {
    const [open, setOpen] = useState(false);

    const [info, setInfo] = useState<InfoState>({
        type: undefined, title: "", message: "", icon: <></>

    });

    const navigation = useNavigate()

    const isMobile = useIsMobile();

    const loaderRef = useRef<LoadingIndicatorRef>(null);

    const [user, setUser] = useState<UserDTO>({
        login: "",
        password: "",
        avatar: ""
    });

    const handleLogin = (e: any) => {

        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }))

    }
    const fieldStyle = {
        width: '100%',
        height: 48,
    };
    const isLoginValid = () => {
        if (user.login === "") {
            setOpen(true);
            setInfo({
                type: ActionType.Warning,
                icon: <WarningAmberRoundedIcon sx={{ fontSize: 48, color: '#f9a825', mb: 2 }} />,
                title: "Login não informado",
                message: "Por favor, preencha o campo de login para continuar."
            });
            return false;
        }

        if (user.password === "") {
            setOpen(true);
            setInfo({
                type: ActionType.Warning,
                title: "Senha não informada",
                icon: <></>,
                message: "É necessário informar sua senha para prosseguir com o acesso."
            });
            return false;
        }
        return true;
    }


    const submitLogin = async () => {

        if (isLoginValid()) {
            loaderRef.current?.start();
            try {
                const { status, success, data, message } = await ApiServices.login(user)
                console.log(status, success, data)
                if (success) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("avatar", data.avatar);
                    navigation("/lista_espera")
                }
                setOpen(true)
                setInfo({ type: ActionType.Warning, icon: <></>, title: `${message}`, message: `${message}` })
            } catch (error) {
                console.log(error)
                setOpen(true)
                setInfo({ type: ActionType.Info, icon: <></>, title: "", message: "Não e permitido login nulo" })
                loaderRef.current?.done()
            } finally {
                loaderRef.current?.done()
            }
        }

    }

    const focused = {

        "& input::placeholder": {
            color: "#999999",
            opacity: 1,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "0.9rem",
        },
        "& .MuiOutlinedInput-root": {
            height: isMobile ? 40 : 60,
            width: isMobile ? '100%' : 400,
            maxWidth: '100%',
            "&.Mui-focused fieldset": {
                borderColor: green[500],
                borderWidth: 2,
            },
        },
        "& label.Mui-focused": {
            color: green[500],
        },
        "& input": {
            fontSize: 18,
            textShadow: `0 0 1px rgba(0,0,0,0.1),0 0 2px rgba(0,0,0,0.1)`,
        }

    };


    return (

        <Box
            sx={{
              
                width: {
                    xs: '100%',    // telas pequenas (mobile) o Box usa 100% da largura do container
                    sm: 'auto',    // telas maiores o width é automático (não fixo)
                },
                maxWidth: {
                    xs: 500,       // no mobile, máximo 500px
                    sm: '80%',     // no desktop pode ocupar até 80% da largura do pai (ou outro valor que desejar)
                    md: 500,       // em telas maiores, limite máximo de 800px
                },
                height:{
                    xs: 500,       // no mobile, máximo 500px
                    sm: '80%',     // no desktop pode ocupar até 80% da largura do pai (ou outro valor que desejar)
                    md: 800, 
                },
               
                mx: 'auto',     // centraliza horizontalmente
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center"
            }}
        >
            <InfoModal
                isOpen={open}
                onClose={() => setOpen(false)}
                type={info.type}
                title={info.title}
                icon={info.icon}
                message={info.message}
            />


            <LoadingIndicator
                ref={loaderRef}
                image="https://www.datagroconferences.com/wp-content/uploads/2021/06/Agrionfertilizantes_site-1.png"

            />
            <img src="https://d1xeoqaoqyzc9p.cloudfront.net/app/uploads/2024/08/Agrionfertilizantes_logo.png" alt="" width={300} />
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
            <Container isElement={false}>
                <FormGroup
                    sx={{
                        width: '100%',
                        maxWidth: isMobile ? 260 : 450, // controle da largura no container
                        mx: 'auto',                     // centraliza horizontalmente
                        mt: 2,
                    }}
                >
                    <FormControl sx={{ mb: 2 }}>
                        <TextField
                            id="my-input"
                            placeholder="LOGIN"
                            name="login"
                            onChange={handleLogin}
                            sx={{ ...fieldStyle, ...focused }}
                            variant="outlined"
                        />
                    </FormControl>

                    <FormControl sx={{ mb: 2 }}>
                        <TextField
                            id="my-password"
                            placeholder="SENHA"
                            name="password"
                            onChange={handleLogin}
                            type="password"
                            sx={{ ...fieldStyle, ...focused }}
                            variant="outlined"
                        />
                    </FormControl>
                </FormGroup>
            </Container>

                <Button sx={{
                    width: isMobile ? 180 : 400, height: 48,
                    "&:hover": {
                        backgroundColor: "black",
                        fontWeight: 200,
                        filter: "brightness(0.9)",
                    },
                    fontWeight: 200,
                    backgroundColor: green[500], 
                    marginBottom: 2
                }}
                    variant="contained"
                    onClick={submitLogin}>Fazer Login</Button>
      

            </div>
        </Box>
    )
}