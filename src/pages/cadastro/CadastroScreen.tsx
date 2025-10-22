import { Box, Button, FormControl, FormGroup, TextField } from "@mui/material"
import Container from "../../components/container-component/Component"
import { useIsMobile } from "../../hooks/useIsMobile"
import { green } from "@mui/material/colors";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { useState } from "react";
import type CadastroDTO from "../../model/CadastroDTO";
import { validarCPF } from "../../utils/ValidarCPF";
import { enviarNotificacao } from "../../utils/enviarNotificacao";
import ApiServices from "../../services/api-service";


export const CadastroScreen = () => {

    const isMobile = useIsMobile();
    
    const navigation = useNavigate();

    const [cadastro, SetCadastro] = useState<CadastroDTO>({
        nomeMotorista: "",
        telefone: 0,
        cpf: "",
        corVeiculo: "",
        placa: "",
        marca: "",
        pesoVazio: 0,
        modelo: "",
        vigia: "jose",
        numeroOrdem: 0,
        status: "",

    })


    localStorage.setItem("tel_user", JSON.stringify(cadastro.telefone))

    const [errors, setErrors] = useState({
        cpf: false,
        pesoVazio: false
    });

    const handleCadastro = (e: any) => {

        const { name, value } = e.target;

        let newValue = value

   
        if (name == "nomeMotorista") {
            newValue = value.replace(/[^A-Za-zÀ-ú ]/g, "");
        }
        if (name == "corVeiculo") {
            newValue = value.replace(/[^A-Za-zÀ-ú ]/g, "");
        }

        if (name === "placa") {
            newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

            let letras = newValue.slice(0, 3).replace(/[^A-Z]/g, "");
            let resto = newValue.slice(3);
            newValue = /^\d+$/.test(resto) ? `${letras}-${resto}` : letras + resto;
            newValue = newValue.slice(0, 8);
        }
        if (name == "cpf") {
            setErrors({ ...errors, cpf: !validarCPF(value) });
        }

        if (name == "pesoVazio") {
            newValue = Number(value.replace(/[^0-9]/g, ""));
            if (!isNaN(newValue) && newValue > 500) {
                setErrors({ ...errors, pesoVazio: false });
            } else {
                setErrors({ ...errors, pesoVazio: true });
                console.log("Peso inválido, deve ser maior que 500 kg");
            }
        }
        SetCadastro((prev) => ({
            ...prev,
            [name]: newValue
        }))

    }
    console.log(cadastro)

    const focused = {
        "& .MuiOutlinedInput-root": {
            height: isMobile ? 40 : 50,
            "&.Mui-focused fieldset": {
                borderColor: green[500],
            }
        },
        "& label.Mui-focused": {
            color: green[500],
        }
    }

    const submitCadastro = async () => {
        const numeroTel = cadastro.telefone.toString().replace(/^\(\d{2}\)\s?|\-/g, "")
        console.log(numeroTel)
        enviarNotificacao("Olá seu veiculo foi inserido no na fila para descarga", `${cadastro.telefone.toString().replace(/^\(\d{2}\)\s?|\-/g, "")}`)
        navigation("/lista_espera")
         await ApiServices.cadastrar(cadastro);
    }

    return (
        <Box sx={{ marginBottom: 10, marginTop: 5, backgroundColor: "white" }}>
            <Container isElement={false}>
                <img src="https://www.datagroconferences.com/wp-content/uploads/2021/06/Agrionfertilizantes_site-1.png" width={isMobile ? "50%" : "20%"} />
            </Container>
            <Container isElement={false} >
                <span className={styles.textTitle}>Inclusão de veiculos</span>
            </Container>

            <Container isElement={false}>
                <FormGroup>
                    <FormControl sx={{ margin: "auto", width: isMobile ? 300 : 800, marginBottom: 2, ...focused }}>
                        <div className={styles.label}><b>Nome do motorista:</b></div>
                        <TextField
                            id="nome"
                            name="nomeMotorista"
                            placeholder="Nome do motorista"
                            value={cadastro.nomeMotorista}
                            onChange={handleCadastro}
                        />
                    </FormControl>
                    <FormControl sx={{ margin: "auto", width: isMobile ? 300 : 800, marginBottom: 2, ...focused }}>
                        <div className={styles.label}><b>Whatsapp/Telefone</b></div>
                        <TextField
                            id="telefone"
                            type="decimal"
                            name="telefone"
                            placeholder="Número de telefone valido"
                            value={cadastro.telefone}
                            onChange={handleCadastro}
                        />
                    </FormControl>

                    <FormControl sx={{ margin: "auto", width: isMobile ? 300 : 800, marginBottom: 2, ...focused }}>
                        <div className={styles.label}><b>CPF:</b></div>
                        <TextField
                            id="cpf"
                            name="cpf"
                            placeholder="000.000.000-00"
                            value={cadastro.cpf}
                            onChange={handleCadastro}
                            error={errors.cpf}
                            helperText={errors.cpf ? "CPF inválido" : ""}
                        />
                    </FormControl>

                    <FormControl sx={{ margin: "auto", width: isMobile ? 300 : 800, marginBottom: 2, ...focused }}>
                        <div className={styles.label}><b>Cor do veiculo:</b></div>
                        <TextField
                            id="cor"
                            name="corVeiculo"
                            placeholder="Cor do caminhão"
                            value={cadastro.corVeiculo}
                            onChange={handleCadastro}
                        />
                    </FormControl>

                    <FormControl sx={{ margin: "auto", width: isMobile ? 300 : 800, marginBottom: 2, ...focused }}>
                        <div className={styles.label}><b>Placa do caminhao:</b></div>
                        <TextField
                            id="placa"
                            name="placa"
                            placeholder="Nº Placa"
                            value={cadastro.placa}
                            onChange={handleCadastro}
                        />
                    </FormControl>

                    <FormControl sx={{ margin: "auto", width: isMobile ? 300 : 800, marginBottom: 2, ...focused }}>
                        <div className={styles.label}><b>Modelo</b></div>
                        <TextField
                            id="modelo"
                            name="modelo"
                            placeholder="Modelo do caminhão"
                            value={cadastro.modelo}
                            onChange={handleCadastro}
                        />
                    </FormControl>
                    <FormControl sx={{ margin: "auto", width: isMobile ? 300 : 800, marginBottom: 2, ...focused }}>
                        <div className={styles.label}><b>Peso vazio</b></div>
                        <TextField
                            id="pesoVazio"
                            inputMode="decimal"
                            name="pesoVazio"
                            error={errors.pesoVazio}
                            placeholder="Peso vazio em kg"
                            value={cadastro.pesoVazio}
                            onChange={handleCadastro}
                        />
                    </FormControl>


                    <FormControl sx={{ margin: "auto", width: isMobile ? 300 : 800, marginBottom: 2, ...focused }}>
                        <div className={styles.label}><b>Marca</b></div>
                        <TextField
                            id="marca"
                            name="marca"
                            placeholder="Marca do caminhão"
                            value={cadastro.marca}
                            onChange={handleCadastro}
                        />
                    </FormControl>
                </FormGroup>
            </Container>
            <Container isElement={false}>
                <Button onClick={submitCadastro} sx={{ width: isMobile ? 180 : 400, margin: "auto", backgroundColor: green[500], marginBottom: 2, ...focused }} variant="contained" >Incluir veiculo</Button>
            </Container>
        </Box>
    )
}