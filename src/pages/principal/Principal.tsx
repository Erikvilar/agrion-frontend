import {Search} from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CachedIcon from "@mui/icons-material/Cached";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LightModeIcon from '@mui/icons-material/LightMode';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
    type SelectChangeEvent
} from "@mui/material";
import {useCallback, useEffect, useRef, useState} from "react";
import {CadastroForm} from "@/components/cadastroForm/CadastroForm";
import type {LoadingIndicatorRef} from "@/components/loading-indicator/Component";
import LoadingIndicator from "../../components/loading-indicator/Component";
import {OffCanvasDrawer, type OffcanvasRef} from "@/components/offCanvasDrawer/OffCanvasDrawer";
import {CenteredModal, type ModalRef} from "@/components/vertical_central_modal/CenteredModal";
import {useIsMobile} from "@/hooks/useIsMobile";
import CadastroDTO from "../../model/dto/registro/RegistroCadastroDTO";
import type StatusDTO from "../../model/dto/StatusDTO.ts";
import ApiServices from "../../services/api-service";
import {APP_THEME, type ThemeMode} from "@/styles/themeConstants";
import Listagem from "@/pages/principal/listagem/Listagem";
import RegistroCadastroDTO from "../../model/dto/registro/RegistroCadastroDTO";
import {ViewTabelaDTO, ViewTabelaPreCadastroDTO} from "@/model/dto/visualizacao/Tabela";


export type CadastroRow = ViewTabelaPreCadastroDTO | ViewTabelaDTO;

interface ListaEsperaProps {isModalOpen: boolean; setIsModalOpen: (open: boolean) => void;}

export const colunaPreCadastro = ["Motorista", "Contato", "Placa", "CPF", "Tipo", "Produto", "Nº Ordem", "Peso (Kg)", "Prev. Chegada", "Operação", "Status"]

export const colunaCadastro = ["Motorista", "Telefone", "Placa", "CPF","Tipo produto","Produto", "Peso inicial", "Peso final", "Data chegada","Operação", "status"]

const Principal = ({isModalOpen, setIsModalOpen}: ListaEsperaProps) => {


    const [mode, setMode] = useState<ThemeMode>('dark');
    const theme = APP_THEME[mode];

    const toggleTheme = () => {
        setMode((prev) => prev === 'dark' ? 'light' : 'dark');
    };


    const isMobile = useIsMobile();
    const loaderRef = useRef<LoadingIndicatorRef>(null);

    const [busca, setBusca] = useState("");

    const [rows, setRows] = useState<CadastroRow[]>([])

    const [isRefreshing, setIsRefreshing] = useState(false);

    const newRowRef = useRef<HTMLTableRowElement | null>(null);
    const modalRef = useRef<ModalRef>(null);
    const offcanvasRef = useRef<OffcanvasRef>(null);
    const [coluna, setColuna] = useState(colunaCadastro);

    const [status, setStatus] = useState<StatusDTO[]>();

    const [filtroAtivo, setFiltroAtivo] = useState<number | null>(null);

    const [ordem, setOrdem] = useState<'asc' | 'desc'>('desc');

    const getPreCadastroVazio = (): RegistroCadastroDTO => {
        return {
            identificador: 0,
            nomeMotorista: "",
            telefone: "",
            placa: "",
            cpf: "",
            tipo: "",
            produto: "",
            origem: "",
            peso: 0,
            corVeiculo: "",
            modelo: "",
            marca: "",
            prioridade: false,
            ordem: 0,
            previsaoChegada: undefined,
            operacao: "",
            confirmado: false
        };
    };

    const [preCadastro, setPreCadastro] = useState<RegistroCadastroDTO>(getPreCadastroVazio);

    const errors = {};


    const handlePreCadastro = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {

        const target = e.target as { name: string; value: any; type?: string };
        let {name, value, type} = target;

        if (!name) return;
        if (type === 'number' || name === 'peso' || name === 'ordem') {
            value = value === '' ? '' : Number(value);
        }

        setPreCadastro((prev) => {
            const estadoAtual = prev || getPreCadastroVazio();
            return {...estadoAtual, [name]: value};
        });
    }, []);

    const submitPreCadastro = async () => {
        if (!preCadastro) return;

        try {
            loaderRef.current?.start();

            await ApiServices.cadastrar(preCadastro);

            await buscarTodosPreCadastro();
            offcanvasRef.current?.close();
        } catch (err:any) {

        } finally {
            loaderRef.current?.done()
        }
    };

    const handleClearForm = () => {
        setPreCadastro(getPreCadastroVazio());
    };

    const handleRowClick = (row: RegistroCadastroDTO) => {
        setPreCadastro(row);
        offcanvasRef.current?.open();
    };

    const handleOrdenar = (tipo: 'asc' | 'desc') => {
        setOrdem(tipo);
        const sortedRows = [...rows].sort((a, b) => {
            console.log(a.dataCriacao)
            const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
            const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
            if (tipo === 'asc') return dataA - dataB;
            else return dataB - dataA;
        });
        setRows(sortedRows);
    };

    const buscarPorDescricao = async () => {
        if (!busca) return;
        setFiltroAtivo(null);
        const resultado = await ApiServices.buscarPorDescricao(busca);
        if (resultado.success && resultado.data) {
            const novaRows = resultado.data.map((item: CadastroDTO) => ({...item}));
            setRows(novaRows);
        } else {
            setRows([]);
        }
    };

    const buscarTodosStatus = async () => {
        const {data, success} = await ApiServices.buscarTodosStatus();
        if (success) {
            setStatus(data);
        }

    }

    const buscarTodosPreCadastro = async () => {
        try {
            loaderRef.current?.start();
            const {data, success} = await ApiServices.buscarTodosPreCadastro();

            if (success && data) {
                const novaRows = data.map((item: ViewTabelaPreCadastroDTO) => {
                    return {...item}
                })


                const sorted = novaRows.sort((a: any, b: any) => {
                    const dA = a.previsaoChegada ? new Date(a.previsaoChegada).getTime() : 0;
                    const dB = b.previsaoChegada ? new Date(b.previsaoChegada).getTime() : 0;
                    return dB - dA;
                });

                setRows(sorted);
                setOrdem('desc');
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            loaderRef.current?.done();
        }
    }

    const buscarPorStatus = useCallback(async (codigo: number, indexStatus: number, isBackgroundFetch = false) => {
        try {
            loaderRef.current?.start();
            if (isBackgroundFetch) setIsRefreshing(true);
            setFiltroAtivo(indexStatus);
            console.log(indexStatus)
            if (codigo === 1) {
                setRows([])
                setColuna(colunaPreCadastro)
                await buscarTodosPreCadastro();
            } else {
                setColuna(colunaCadastro)
                setRows([])
                const response = await ApiServices.buscarPorStatus(codigo);
                const novaRows = response.data.map((item: ViewTabelaDTO) => ({...item}));
                setRows(novaRows);
            }

        } catch (error) {
            console.log(error)
        } finally {
            loaderRef.current?.done();
        }
    }, []);

    const fetchTodos = async () => {
    }

    useEffect(() => {

        try {

            buscarTodosStatus()
            buscarPorStatus(3,2);

        } catch (e) {
            console.log(e)
        } finally {
            loaderRef.current?.done()
        }


    }, [setIsModalOpen, isModalOpen])

    const buttonActions = [
        {
            id: "1",
            title: "Atualizar",
            background: "#3b82f6",
            hover: "#2563eb",
            acao: () => {
                buscarTodosPreCadastro()
            },
            icon: isRefreshing
                ? (<CircularProgress size={20} sx={{color: "#FFFFFF"}}/>)
                : <CachedIcon sx={{color: "#FFFFFF"}}/>
        },
        {
            id: "2",
            title: "Cadastrar",
            background: "#10b981",
            hover: "#059669",
            acao: () => {
                handleClearForm();
                offcanvasRef.current?.open();
            },
            icon: <AddCircleIcon sx={{color: "#FFFFFF"}}/>
        },
        {
            id: "3",
            title: "Limpar filtro",
            background: "#F16D34",
            hover: "#DE802B",
            acao: () => {
                fetchTodos();
            },
            icon: isRefreshing
                ? (<CircularProgress size={20} sx={{color: "#FFFFFF"}}/>)
                : <CachedIcon sx={{color: "#FFFFFF"}}/>
        },
        {
            id: "4",
            title: "Ajuda",
            background: mode === 'dark' ? "#374151" : "#D1D5DB",
            hover: mode === 'dark' ? "#4b5563" : "#9CA3AF",
            acao: () => {
                offcanvasRef.current?.open()
            },
            icon: <HelpOutlineIcon sx={{color: mode === 'dark' ? "#FFFFFF" : theme.text.primary}}/>
        }
    ];

    return (
        <Box sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.background.main,
            width: "100%",
            overflow: "hidden",
            transition: "background-color 0.3s ease"
        }}>
            <LoadingIndicator ref={loaderRef}/>


            <OffCanvasDrawer
                ref={offcanvasRef}
                title=""
                position="left"
                width={700}
                currentTheme={theme}
            >

                <CadastroForm
                    cadastro={preCadastro}
                    handleCadastro={handlePreCadastro}
                    errors={errors}
                    status={status!}
                    submitCadastro={submitPreCadastro}
                    clearForm={handleClearForm}
                />
            </OffCanvasDrawer>

            <CenteredModal
                ref={modalRef}
                title="Formulário Encapsulado"
                maxWidth="md" children={undefined}
            />

            <Box sx={{
                padding: "24px 24px 0 24px",
                width: "100%",
                boxSizing: "border-box",
                flexShrink: 0
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    mb: 3
                }}>
                    <Box>
                        <Typography variant="h4" sx={{
                            fontWeight: 800,
                            color: theme.text.primary,
                            fontSize: isMobile ? '1.5rem' : '2rem',
                            letterSpacing: '-0.5px'
                        }}>
                           AGRION - Gestão de cargas
                        </Typography>
                        <Typography variant="body1" sx={{color: theme.text.secondary, mt: 0.5}}>
                            Gerenciador de cargas e operações.
                        </Typography>
                    </Box>

                    <Stack direction={isMobile ? "column" : "row"} spacing={1.5} alignItems="center"
                           sx={{mt: isMobile ? 2 : 0}}>

                        <Tooltip title={mode === 'dark' ? "Modo Claro" : "Modo Escuro"}>
                            <IconButton onClick={toggleTheme}
                                        sx={{color: theme.text.primary, border: `1px solid ${theme.border.main}`}}>
                                {mode === 'dark' ? <LightModeIcon/> : <DarkModeIcon/>}
                            </IconButton>
                        </Tooltip>
                        {buttonActions.map((btn) => (
                            <Button
                                key={btn.id}
                                variant="contained"
                                startIcon={btn.icon}
                                onClick={btn.acao}
                                sx={{
                                    backgroundColor: btn.background,
                                    color: btn.id === '4' && mode === 'light' ? theme.text.primary : "#FFF",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: "8px",
                                    padding: "6px 16px",
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: btn.hover,
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)"
                                    }
                                }}
                            >
                                {btn.title}
                            </Button>
                        ))}

                    </Stack>
                </Box>


                <Box sx={{mb: 3}}>
                    <TextField
                        fullWidth
                        placeholder="Pesquisar por motorista, placa, CPF ou número da ordem..."
                        variant="outlined"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") buscarPorDescricao();
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                backgroundColor: theme.background.paper, // Tema
                                color: theme.text.primary,
                                transition: "all 0.2s",
                                "& fieldset": {borderColor: theme.border.main},
                                "&:hover fieldset": {borderColor: theme.text.disabled},
                                "&.Mui-focused fieldset": {borderColor: theme.border.focus},
                                "& input::placeholder": {color: theme.text.disabled}
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{color: theme.text.disabled}}/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>


                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    mb: 2,
                    gap: 2,
                    width: "100%"
                }}>
                    {/* --- ESQUERDA: FILTROS DE STATUS --- */}
                    <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                        <Typography variant="caption" sx={{
                            fontWeight: 700,
                            color: theme.text.disabled,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Filtros Rápidos:
                        </Typography>

                        <Chip
                            label="Todos"
                            onClick={() => fetchTodos()}
                            sx={{
                                height: 28,
                                backgroundColor: filtroAtivo === null ? theme.action.inactiveFilterBg : "transparent",
                                color: filtroAtivo === null ? theme.text.primary : theme.text.secondary,
                                fontWeight: 700,
                                border: filtroAtivo === null ? "none" : `1px solid ${theme.border.main}`,
                                "&:hover": {backgroundColor: theme.background.hover}
                            }}
                        />

                        {status?.map((value, index) => (
                            <Box
                                key={index}
                                onClick={() => buscarPorStatus(value.id, index)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    padding: "4px 12px",
                                    borderRadius: "99px",
                                    cursor: "pointer",
                                    border: "1px solid",
                                    borderColor: filtroAtivo === index ? value.corHexadecimal : theme.border.main,
                                    backgroundColor: filtroAtivo === index ? `${value.corHexadecimal}15` : "transparent",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        borderColor: value.corHexadecimal,
                                        backgroundColor: `${value.corHexadecimal}10`
                                    }
                                }}
                            >
                                <Box sx={{
                                    width: 6, height: 6, borderRadius: "50%",
                                    backgroundColor: value.corHexadecimal, mr: 1,
                                    boxShadow: `0 0 8px ${value.corHexadecimal}`
                                }}/>
                                <Typography variant="body2" sx={{
                                    fontWeight: 500,
                                    color: filtroAtivo === index ? theme.text.primary : theme.text.secondary,
                                    fontSize: '0.75rem'
                                }}>
                                    {value.descricao}
                                </Typography>
                            </Box>
                        ))}
                    </Box>


                    <Box sx={{display: "flex", alignItems: "center", gap: 3}}>


                        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                            <Typography variant="caption"
                                        sx={{
                                            fontWeight: 700,
                                            color: theme.text.disabled,
                                            textTransform: 'uppercase',
                                            mr: 1
                                        }}>
                                Ordenar Por:
                            </Typography>

                            <Button
                                size="small"
                                variant={ordem === 'desc' ? "contained" : "outlined"}
                                startIcon={<ArrowDownwardIcon/>}
                                onClick={() => handleOrdenar('desc')}
                                sx={{
                                    borderRadius: "20px",
                                    textTransform: "none",
                                    fontSize: "0.75rem",
                                    padding: "2px 12px",
                                    backgroundColor: ordem === 'desc' ? "#3b82f6" : "transparent",
                                    borderColor: ordem === 'desc' ? "transparent" : theme.border.main,
                                    color: ordem === 'desc' ? "#fff" : theme.text.secondary,
                                    "&:hover": {
                                        backgroundColor: ordem === 'desc' ? "#2563eb" : theme.background.hover,
                                        borderColor: ordem === 'desc' ? "transparent" : theme.text.disabled,
                                    }
                                }}
                            >
                                Mais recentes
                            </Button>

                            <Button
                                size="small"
                                variant={ordem === 'asc' ? "contained" : "outlined"}
                                startIcon={<ArrowUpwardIcon/>}
                                onClick={() => handleOrdenar('asc')}
                                sx={{
                                    borderRadius: "20px",
                                    textTransform: "none",
                                    fontSize: "0.75rem",
                                    padding: "2px 12px",
                                    backgroundColor: ordem === 'asc' ? "#3b82f6" : "transparent",
                                    borderColor: ordem === 'asc' ? "transparent" : theme.border.main,
                                    color: ordem === 'asc' ? "#fff" : theme.text.secondary,
                                    "&:hover": {
                                        backgroundColor: ordem === 'asc' ? "#2563eb" : theme.background.hover,
                                        borderColor: ordem === 'asc' ? "transparent" : theme.text.disabled,
                                    }
                                }}
                            >
                                Mais antigos
                            </Button>
                        </Box>

                        <Box sx={{width: "1px", height: "24px", backgroundColor: theme.border.divider}}/>


                    </Box>
                </Box>
            </Box>


            <Box sx={{
                flex: 1,
                width: "100%",
                padding: "0 24px 24px 24px",
                boxSizing: "border-box",
                overflow: "hidden"
            }}>
                <Listagem
                    rows={rows}
                    coluna={coluna}
                    fetchTodos={fetchTodos}
                    newRowRef={newRowRef}
                    handleRowClick={handleRowClick}
                    status={status!}
                    currentTheme={theme}
                />
            </Box>
        </Box>
    )
}

export default Principal;