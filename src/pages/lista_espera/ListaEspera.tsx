
import {

  Box, CircularProgress, IconButton, InputAdornment, TextField,Collapse,
  type SelectChangeEvent
} from "@mui/material";

import CachedIcon from "@mui/icons-material/Cached";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CampaignIcon from "@mui/icons-material/Campaign";
import SyncIcon from "@mui/icons-material/Sync";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import FilterListIcon from "@mui/icons-material/FilterList";
import Tabela from "./Tabela";

import style from "./style.module.css"

import { useIsMobile } from "../../hooks/useIsMobile";

import Constants from "../../constants/Constants";

import { ArrowRight, Search } from "@mui/icons-material";

import { useCallback, useEffect, useRef, useState } from "react";

import type CadastroDTO from "../../model/CadastroDTO";

import ApiServices from "../../services/api-service";

import { green } from "@mui/material/colors";

import { LeftModal } from "../../components/left-modal-component/LeftModal";



import { enviarNotificacao } from "../../utils/enviarNotificacao";





import ModalHelper from "../../components/modal-help/ModalHelper";



function createData(
    codigoCadastro: number,
    nomeMotorista: string,
    telefone: number | null,
    cpf: string,
    corVeiculo: string,
    placa: string,
    marca: string,
    modelo: string,
    tipoProduto:string,
    produto:string,
    operacao:string,
    pesoVazio: number,
    pesoCarregado: number | undefined,
    vigia: string,
    
    numeroOrdem: number,
    status: string,
    dataCriacao?: string | Date

) {
    return {
        codigoCadastro, nomeMotorista, telefone, cpf, corVeiculo, placa, marca, modelo, tipoProduto,produto,operacao,pesoVazio, pesoCarregado, vigia, numeroOrdem, status, dataCriacao
    };
}

interface ListaEsperaProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}



const ListaEspera = ({ isModalOpen, setIsModalOpen }: ListaEsperaProps) => {

    const isMobile = useIsMobile();
    const [openFiltro, setOpenFiltro] = useState(false);

    const [isCadastrando, setIsCadastrando] = useState(false)

  




    const open = isModalOpen;

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const [busca, setBusca] = useState("");

    const [rows, setRows] = useState<CadastroDTO[]>([])

    const [isRefreshing, setIsRefreshing] = useState(false);


    const newRowRef = useRef<HTMLTableRowElement | null>(null);
    const [cadastro, SetCadastro] = useState<CadastroDTO>({
        nomeMotorista: "",
        telefone: null,
        cpf: "",
        corVeiculo: "",
        placa: "",
        marca: "",
        pesoVazio: 0,
        modelo: "",
        vigia: "",
        tipoProduto:"",
        produto:"",
        operacao: "",
        numeroOrdem: 0,
        status: "",
    })

    const buscarPorDescricao = async () => {
        if (!busca) return;

        const resultado = await ApiServices.buscarPorDescricao(busca);

        if (resultado.success && resultado.data) {

            const novaRows = resultado.data.map((item: CadastroDTO) => ({
                ...item
            }));
            setRows(novaRows);
        } else {
            setRows([]);
            console.error("Erro ao buscar:", resultado.message);
        }
    };

    const fetchTodos = useCallback(async (isBackgroundFetching = false) => {

        if (isBackgroundFetching) setIsRefreshing(true)
        const { success, data } = await ApiServices.buscarTodos();
        if (success && data) {
            const novaRows = data.map((item: CadastroDTO) =>
                createData(item.codigoCadastro!, item.nomeMotorista, item.telefone, item.cpf, item.corVeiculo, item.placa, item.marca, item.modelo, item.tipoProduto, item.produto, item.operacao, item.pesoVazio, item.pesoCarregado, item.vigia, item.numeroOrdem, item.status, item.dataCriacao)
            );
            setRows(novaRows);
        } else {

            setRows([]);

        }
        if (isBackgroundFetching) setIsRefreshing(false)
    }, []);

    const buscarPorStatus = useCallback(async (codigo: number, isBackgroundFetch = false) => {

        if (isBackgroundFetch) setIsRefreshing(true);

        const response = await ApiServices.buscarPorStatus(codigo);

        if (response.success && response.data) {
            const novaRows = response.data.map((item: CadastroDTO) =>
  createData(item.codigoCadastro!, item.nomeMotorista, item.telefone, item.cpf, item.corVeiculo, item.placa, item.marca, item.modelo, item.tipoProduto, item.produto, item.operacao, item.pesoVazio, item.pesoCarregado, item.vigia, item.numeroOrdem, item.status, item.dataCriacao)
            );


            setRows(novaRows);

        } else {
            setRows([]);
            console.error("Erro ao buscar todos:", response.message);
        }
        if (isBackgroundFetch) setIsRefreshing(false);
    }, []);

    useEffect(() => {

        fetchTodos()
    }, [setIsModalOpen, isModalOpen])

    const buttonstatus = [


        {
            id: "3",
            title: "RECEBIDO",
            codigo: 1,
            background: Constants.RECEBIDO,
            acao: () => buscarPorStatus(1),
            icon: <Inventory2Icon style={{ color: "white" }} />
        },

        {
            id: "4",
            title: "AGUARDANDO",
            codigo: 2,
            background: Constants.AGUARDANDO,
            acao: () => buscarPorStatus(2),
            icon: <HourglassEmptyIcon style={{ color: "white" }} />
        },

        {
            id: "5",
            title: "CONVOCADO",
            codigo: 3,
            background: Constants.CONVOCADO,
            acao: () => buscarPorStatus(3),
            icon: <CampaignIcon style={{ color: "white" }} />
        },

        {
            id: "6",
            title: "OPERAÇÃO",
            codigo: 4,
            background: Constants.OPERACAO,
            acao: () => buscarPorStatus(4),
            icon: <SyncIcon style={{ color: "white" }} />  // simboliza processo
        },

        {
            id: "7",
            title: "DESPACHE",
            codigo: 5,
            background: Constants.DESPACHE,
            acao: () => buscarPorStatus(5),
            icon: <LocalShippingIcon style={{ color: "white" }} />  // saída/transporte
        },

        {
            id: "8",
            title: "CONCLUIDO",
            codigo: 6,
            background: Constants.CONCLUIDO,
            acao: () => buscarPorStatus(6),
            icon: <CheckCircleIcon style={{ color: "white" }} />  // finalizado
        },

        {
            id: "9",
            title: "INATIVO",
            codigo: 7,
            background: Constants.INATIVO,
            acao: () => buscarPorStatus(7),
            icon: <BlockIcon style={{ color: "white" }} />
        }
    ];

    const buttonActions = [
        {
            id: "1",
            title: "Atualizar",
            codigo: null,
            background: "#1976D2", // Azul padrão UX
            acao: () => {
                fetchTodos(false);

            },
            icon: isRefreshing
                ? (
                    <CircularProgress
                        size={22}
                        sx={{ color: "#FFFFFF", marginRight: 8 }}
                    />
                )
                : <CachedIcon sx={{ color: "#FFFFFF" }} />
        },

        {
            id: "2",
            title: "Cadastrar",
            codigo: null,
            background: "#2E7D32", // Verde positivo e consistente
            acao: () => {
                setIsCadastrando(true);
                adicionarLinhaEmBranco();
            },
            icon: <AddCircleIcon sx={{ color: "#FFFFFF" }} />
        },
        {
             id: "3",
            background: "#238681ff", 
            icon:   <ModalHelper />
        }
    ];

    const focused = {
        "& .MuiOutlinedInput-root": {
            height: 40,
            "&.Mui-focused fieldset": {
                borderColor: green[500],
            }
        },
        "& label.Mui-focused": {
            color: green[500],
        }
    }

    const handleClose = () => setIsModalOpen(false)

    const adicionarLinhaEmBranco = async () => {
        await fetchTodos()
        const user = localStorage.getItem("user")
        if (user) {
            const novaLinha: CadastroDTO = {
                codigoCadastro: 0,
                nomeMotorista: "",
                telefone: null,
                cpf: "",
                corVeiculo: "",
                placa: "",
                marca: "",
                modelo: "",
                pesoVazio: 0,
                pesoCarregado: undefined,
                vigia: user,
                numeroOrdem: 0,
                status: "SALVAR",
                dataCriacao: new Date(),
                operacao: "",
                tipoProduto: "",
                produto: ""
            };
            setRows((prevRows) => [novaLinha, ...prevRows]);
            setTimeout(() => {
                newRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        } else {
    
        }




    };


 const errors = {};

const handleCadastro = (
  e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent
) => {
  const { name, value } = e.target;

  SetCadastro((prev) => ({
    ...prev,
    [name]: value
  }));
};

    const submitCadastro = async () => {
        if (cadastro.telefone == null) {

      
        } else if (cadastro.cpf == null) {

        
        }

        else {
            const numeroTel = cadastro.telefone.toString().replace(/^\(\d{2}\)\s?|\-/g, "")
            console.log(numeroTel)
            enviarNotificacao("Olá seu veiculo foi inserido no na fila para descarga", `${cadastro.telefone.toString().replace(/^\(\d{2}\)\s?|\-/g, "")}`)
            cadastro.codigoCadastro = 0;
            console.log(cadastro)
            await ApiServices.cadastrar(cadastro);
            handleClose();

        }
    }

    return (
        <Box
            sx={{
                height: isMobile ? 500 : "100vh",
                display: "flex",
                flexDirection: "column",
                scrollbarWidth: 1,
                width: "100%",
            }}
        >

            <div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? 'center' : 'start', marginLeft: isMobile ? 0 : 20, paddingTop: isMobile ? 0 : 100, marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '50%' }}>
                        <h2 style={{ marginBottom: 10 }}>DASHBOARD GERENCIAL</h2>
                     
                    </div>


                    <TextField
                        type="search"
                        placeholder="Buscar..."
                        variant="outlined"
                        size="small"
                        label="Pesquisar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") buscarPorDescricao();
                        }}
                        sx={{ width: isMobile ? "100%" : "50%", borderRadius: 10, ...focused }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={buscarPorDescricao} aria-label="search">
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                </div>
                {isMobile ? <></> :
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "row", padding: 10 }}>


                        <Box sx={{ width: "100%" }}>

                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                                <button
                                    onClick={() => setOpenFiltro(!openFiltro)}

                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "8px 12px",
                                        backgroundColor: "#e0e0e0",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        border: "none",
                                        marginLeft: 3,
                                        marginBottom: 8,
                                    }}
                                >
                                    <FilterListIcon style={{ marginRight: 8 }} />
                                    <span style={{ fontWeight: 600 }}>Filtros</span>
                                    <ArrowRight
                                        style={{
                                            marginLeft: 8,
                                            transform: openFiltro ? "rotate(90deg)" : "rotate(0deg)",
                                            transition: "0.2s",
                                        }}
                                    />
                                </button>
                                {buttonActions.map((value) => (
                                    <button
                                        onClick={value.acao}
                                        key={value.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "8px 12px",
                                            backgroundColor: value.background,
                                            borderRadius: 6,
                                            cursor: "pointer",
                                            border: "none",
                                            marginLeft: 10,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {value.icon}
                                        <span style={{ fontWeight: 600, color: "white" }}>{value.title}</span>
                                        <ArrowRight
                                            style={{
                                                marginLeft: 8,
                                                transform: openFiltro ? "rotate(90deg)" : "rotate(0deg)",
                                                transition: "0.2s",
                                            }}
                                        />
                                    </button>
                                ))}
                            </Box>



                            <Collapse in={openFiltro} timeout="auto" unmountOnExit>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 1,
                                        width: "100%",
                                        flexWrap: "wrap",
                                        backgroundColor: "white",
                                        p: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    {buttonstatus.map((value, index) => (
                                        <button
                                            key={index}
                                            style={{
                                                backgroundColor: value.background,
                                                cursor: "pointer",
                                                maxHeight: 50,
                                                height: 35,
                                                display: "flex",
                                                alignItems: "center",
                                                borderRadius: 6,
                                                padding: "0 10px",
                                                border: "none",
                                                transition: "transform 0.2s",
                                            }}
                                            onClick={value.acao}
                                            className={style?.isDesktop}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    width: "60%",
                                                }}
                                            >
                                                {value.icon}
                                                <span
                                                    style={{
                                                        fontWeight: 600,
                                                        color: "white",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {value.title}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </Box>
                            </Collapse>
                        </Box>


                    </div>
                }
                <LeftModal
                    open={open}
                    onClose={handleCloseModal}
                    cadastro={cadastro}
                    handleCadastro={handleCadastro}
                    errors={errors}
                    submitCadastro={submitCadastro}
                />

                <Tabela rows={rows} fetchTodos={fetchTodos} newRowRef={newRowRef} isCadastrando={isCadastrando} />
            </div>
        </Box>
    )
}
export default ListaEspera;


