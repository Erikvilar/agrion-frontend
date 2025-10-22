import { Box, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import OutboxIcon from '@mui/icons-material/Outbox';
import Tabela from "./Tabela";
import style from "./style.module.css"
import { useIsMobile } from "../../hooks/useIsMobile";
import Constants from "../../constants/Constants";
import { Search } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import type CadastroDTO from "../../model/CadastroDTO";
import ApiServices from "../../services/api-service";
import { green } from "@mui/material/colors";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

interface TabelaProps {
  rows: CadastroDTO[];
}
function createData(
    codigoCadastro: number | undefined,
    nomeMotorista: string,
    telefone: number,
    cpf: string,
    corVeiculo: string,
    placa: string,
    marca: string,
    modelo: string,
    pesoVazio: number,
    pesoCarregado: number | undefined,
    vigia: string,
    numeroOrdem: number,
    status: string,
    dataCriacao?: string | Date

) {
    return {
        codigoCadastro, nomeMotorista, telefone, cpf, corVeiculo, placa, marca, modelo, pesoVazio, pesoCarregado, vigia, numeroOrdem, status, dataCriacao
    };
}

const ListaEspera = () => {

    const isMobile = useIsMobile();

    const [busca, setBusca] = useState("");

    const [rows, setRows] = useState<CadastroDTO[]>([])

    const [isRefreshing, setIsRefreshing] = useState(false);

    const [activeFilter, setActiveFilter] = useState<{ type: 'all' | 'status' | 'search', value: any }>({ type: 'all', value: null });

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
                createData(item.codigoCadastro, item.nomeMotorista, item.telefone, item.cpf, item.corVeiculo, item.placa, item.marca, item.modelo, item.pesoVazio, item.pesoCarregado, item.vigia, item.numeroOrdem, item.status, item.dataCriacao)
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
                createData(item.codigoCadastro, item.nomeMotorista, item.telefone, item.cpf, item.corVeiculo, item.placa, item.marca, item.modelo, item.pesoVazio, item.pesoCarregado, item.vigia, item.numeroOrdem, item.status, item.dataCriacao)
            );
            setRows(novaRows);


        } else {
            setRows([]);
            console.error("Erro ao buscar todos:", response.message);
        }
        if (isBackgroundFetch) setIsRefreshing(false);
    }, []);




    useEffect(() => {
        const refreshCurrentView = () => {
            switch (activeFilter.type) {
                case 'status':
                    buscarPorStatus(activeFilter.value, true);
                    break;
                default:
                    fetchTodos(true)
                    break;
            }
        }
        console.log("executando refresh...")

        fetchTodos();

        const intervalId = setInterval(refreshCurrentView, 60000);


        return () => clearInterval(intervalId);

    }, [activeFilter, fetchTodos, buscarPorStatus]);


    const buttonstatus = [
        {
            id: "1", title: "CADASTRO", codigo: null, background: Constants.SALVAR,
            acao: () => {
                adicionarLinhaEmBranco()
            }, 
            icon: isRefreshing ? <CircularProgress size={24} color="inherit"  style={{color:'white'}} /> : <CachedIcon style={{color:'white'}} />
        },
        {
            id: "2", title: "ATUALIZAR", codigo: null, background: Constants.ATUALIZAR,
            acao: () => {
                setActiveFilter({ type: 'all', value: null });
                fetchTodos(false);
            }, icon: isRefreshing ? <CircularProgress size={24} color="inherit"  style={{color:'white'}} /> : <CachedIcon style={{color:'white'}} />
        },
        {
            id: "3", title: "RECEBIDO", codigo: 1, background: Constants.RECEBIDO, acao: () =>
                buscarPorStatus(1),
            icon: <AssignmentTurnedInIcon color="success" />
        },
        {
            id: "4", title: "AGUARDANDO", codigo: 2, background: Constants.AGUARDANDO, acao: () =>
                buscarPorStatus(2),
            icon: <HourglassEmptyIcon style={{color:'white'}}/>
        },
        {
            id: "5", title: "CARREGAMENTO", codigo: 3, background: Constants.CARREGAMENTO, acao: () =>
                buscarPorStatus(3),
            icon: <LocalShippingIcon />
        },
        {
            id: "6", title: "DESPACHE", codigo: 4, background: Constants.DESPACHE, acao: () =>
                buscarPorStatus(4),
            icon: <OutboxIcon />
        },
        {
            id: "7", title: "INATIVO", codigo: 5, background: Constants.INATIVO, acao: () =>
                buscarPorStatus(5),
            icon: <></>
        },


    ]

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

const adicionarLinhaEmBranco = () => {
  const novaLinha: CadastroDTO = {
    codigoCadastro: Date.now(), // ID temporário
    nomeMotorista: "",
    telefone: 0,
    cpf: "",
    corVeiculo: "",
    placa: "",
    marca: "",
    modelo: "",
    pesoVazio: 0,
    pesoCarregado: undefined,
    vigia: "",
    numeroOrdem: 0,
    status: "SALVAR",
    dataCriacao: new Date(),
  };

  setRows((prevRows) => [novaLinha, ...prevRows]);
};

    return (
        <Box
            sx={{
                height: isMobile ? 650 : "100vh",
                display: "flex",
                flexDirection: "column",

                width: "100%",
                overflowY: "auto"
            }}
        >

            <div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: isMobile ? 0 : 100 }}>

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
                        sx={{ width: "50%", borderRadius: 3, ...focused }}
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
                    <div style={{ marginTop: 30, display: "flex",flexDirection:"row",padding:10}}>
                    
                        
   
                        {buttonstatus.map((value, index) => (
                            <button

                                key={index}
                                style={{ backgroundColor: value.background, cursor: "pointer", maxHeight: 50, height: 35,display: "flex", alignItems: "center",}}
                                onClick={value.acao}
                                className={style.isDesktop}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "60%" }}>
                                    {value.icon}
                                    <span style={{ fontWeight: 600,color:"white",fontSize:12 }}>{value.title}</span>
                                </div>

                            </button>
                        ))}
                   
                    </div>
                }


                <Tabela rows={rows} />
            </div>
        </Box>
    )
}
export default ListaEspera;


