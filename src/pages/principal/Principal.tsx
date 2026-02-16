import { Search } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CachedIcon from "@mui/icons-material/Cached";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LightModeIcon from '@mui/icons-material/LightMode';
import {
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Close as CloseIcon,
    Message as MessageIcon
} from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    Drawer,
    Badge,
    Divider,
    type SelectChangeEvent
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { CadastroForm } from "@/components/cadastroForm/CadastroForm";
import type { LoadingIndicatorRef } from "@/components/loading-indicator/Component";
import LoadingIndicator from "../../components/loading-indicator/Component";
import { OffCanvasDrawer, type OffcanvasRef } from "@/components/offCanvasDrawer/OffCanvasDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import CadastroDTO from "../../model/dto/registro/RegistroCadastroDTO";
import type StatusDTO from "../../model/dto/StatusDTO.ts";
import ApiServices from "../../services/api-service";
import { APP_THEME, type ThemeMode } from "@/styles/themeConstants";
import Listagem from "@/pages/principal/listagem/Listagem";
import RegistroCadastroDTO from "../../model/dto/registro/RegistroCadastroDTO";
import { ViewTabelaDTO, ViewTabelaPreCadastroDTO } from "@/model/dto/visualizacao/Tabela";
import eventBus, {WSMessage} from "@/services/websocket/eventBus";
import {toast} from "react-hot-toast";


export type CadastroRow = ViewTabelaPreCadastroDTO | ViewTabelaDTO;
interface ListaEsperaProps { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }

export const colunaPreCadastro = ["Motorista", "Contato", "Placa", "CPF", "Tipo", "Produto", "Nº Ordem", "Peso (Kg)", "Prev. Chegada", "Operação", "Status"]
export const colunaCadastro = ["Motorista", "Telefone", "Placa", "CPF", "Tipo produto", "Produto", "Peso inicial", "Peso final", "Data chegada", "Operação", "status"]

const Principal = ({ isModalOpen, setIsModalOpen }: ListaEsperaProps) => {

    const [mode, setMode] = useState<ThemeMode>('dark');
    const theme = APP_THEME[mode];
    const isMobile = useIsMobile();
    const [configOpen, setConfigOpen] = useState(false);
    const [notifications,setNotifications] = useState<any[]>([]);


    const loaderRef = useRef<LoadingIndicatorRef>(null);
    const offcanvasRef = useRef<OffcanvasRef>(null);

    const newRowRef = useRef<HTMLTableRowElement | null>(null);


    const [busca, setBusca] = useState("");
    const [rows, setRows] = useState<CadastroRow[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [coluna, setColuna] = useState(colunaCadastro);
    const [status, setStatus] = useState<StatusDTO[]>();
    const [filtroAtivo, setFiltroAtivo] = useState<number | null>(null);
    const [ordem, setOrdem] = useState<'asc' | 'desc'>('desc');
    const [modoOperacao, setModoOperacao] = useState<boolean>(true);

    const getPreCadastroVazio = (): RegistroCadastroDTO => ({
        identificador: 0, nomeMotorista: "", telefone: "", placa: "", cpf: "", tipo: "",
        produto: "", origem: "", peso: 0, corVeiculo: "", modelo: "", marca: "",
        prioridade: false, ordem: 0, previsaoChegada: undefined, operacao: "", confirmado: false
    });

    const [preCadastro, setPreCadastro] = useState<RegistroCadastroDTO>(getPreCadastroVazio);


    const toggleTheme = () => setMode((prev) => prev === 'dark' ? 'light' : 'dark');

    const handlePreCadastro = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const target = e.target as { name: string; value: any; type?: string };
        let { name, value, type } = target;
        if (!name) return;
        if (type === 'number' || name === 'peso' || name === 'ordem') {
            value = value === '' ? '' : Number(value);
        }
        setPreCadastro((prev) => ({ ...prev, [name]: value }));
    }, []);

    useEffect(() => {
        const onMessage = (data: WSMessage) => {

            setNotifications(prev => {
                const newList = [data, ...prev];
                return newList.slice(0, 120);
            });

            toast.success(data.message || "Nova atualização recebida!", {
                duration: 5000,
                icon: '🔔',
                style: {
                    borderRadius: '8px',
                    background: theme.background.paper,
                    color: theme.text.primary,
                    border: `1px solid ${theme.border.main}`
                },
            });
        };

        eventBus.on("messageReceived", onMessage);
        return () => {
            eventBus.off("messageReceived", onMessage);
        };
    }, [theme]);

    const submitPreCadastro = async () => {
        const {cpf,nomeMotorista,placa,modelo,marca,origem} = preCadastro;
        let messageDefault = `Novo agendamento para ${nomeMotorista} cujo CPF ${cpf}.\n Veiculo: ${marca}-${modelo}-${placa}, com origem de ${origem} `
        console.log("submit chamado")
        if (!preCadastro) return;
        try {
            loaderRef.current?.start();
            await ApiServices.cadastrar(preCadastro);
            await ApiServices.notifyGroup("ROLE_LOGISTICA", messageDefault);
            await buscarTodosPreCadastro();
            offcanvasRef.current?.close();
        } catch (err) { console.error(err); } finally { loaderRef.current?.done(); }
    };

    const handleClearForm = () => setPreCadastro(getPreCadastroVazio());

    const handleRowClick = (row: RegistroCadastroDTO) => {
        const modo = 'confirmado' in row;
        setPreCadastro(row);
        setModoOperacao(modo);
        offcanvasRef.current?.open();
    };

    const handleOrdenar = (tipo: 'asc' | 'desc') => {
        setOrdem(tipo);
        const sortedRows = [...rows].sort((a, b) => {
            const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
            const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
            return tipo === 'asc' ? dataA - dataB : dataB - dataA;
        });
        setRows(sortedRows);
    };

    const buscarPorDescricao = async () => {
        if (!busca) return;
        setFiltroAtivo(null);
        const resultado = await ApiServices.buscarPorDescricao(busca);
        if (resultado.success && resultado.data) {
            setRows(resultado.data.map((item: CadastroDTO) => ({ ...item })));
        } else { setRows([]); }
    };

    const buscarTodosStatus = async () => {
        const { data, success } = await ApiServices.buscarTodosStatus();
        if (success) setStatus(data);
    };

    const buscarTodosPreCadastro = async () => {
        try {
            setIsRefreshing(true);
            const { data, success } = await ApiServices.buscarTodosPreCadastro();
            if (success && data) {
                const sorted = data.sort((a: any, b: any) => {
                    const dA = a.previsaoChegada ? new Date(a.previsaoChegada).getTime() : 0;
                    const dB = b.previsaoChegada ? new Date(b.previsaoChegada).getTime() : 0;
                    return dB - dA;
                });
                setRows(sorted);
                setOrdem('desc');
            }
        } finally { setIsRefreshing(false); }
    };

    const buscarPorStatus = useCallback(async (codigo: number, indexStatus: number) => {
        try {
            loaderRef.current?.start();
            setFiltroAtivo(indexStatus);
            if (codigo === 1) {
                setColuna(colunaPreCadastro);
                await buscarTodosPreCadastro();
            } else {
                setColuna(colunaCadastro);
                const response = await ApiServices.buscarPorStatus(codigo);
                setRows(response.data.map((item: ViewTabelaDTO) => ({ ...item })));
            }
        } finally { loaderRef.current?.done(); }
    }, []);

    const fetchTodos = () => {
        setFiltroAtivo(null);
        buscarTodosPreCadastro();
    };

    useEffect(() => {
        buscarTodosStatus();
        buscarPorStatus(3, 2);
    }, [setIsModalOpen, isModalOpen]);

    const buttonActions = [
        { id: "1", title: "Atualizar", background: "#3b82f6", hover: "#2563eb", acao: buscarTodosPreCadastro, icon: isRefreshing ? <CircularProgress size={20} color="inherit" /> : <CachedIcon /> },
        { id: "2", title: "Cadastrar", background: "#10b981", hover: "#059669", acao: () => { handleClearForm(); offcanvasRef.current?.open(); }, icon: <AddCircleIcon /> },
        { id: "3", title: "Limpar", background: "#F16D34", hover: "#DE802B", acao: fetchTodos, icon: <CachedIcon /> },
        { id: "4", title: "Ajuda", background: mode === 'dark' ? "#374151" : "#D1D5DB", hover: mode === 'dark' ? "#4b5563" : "#9CA3AF", acao: () => { }, icon: <HelpOutlineIcon /> }
    ];

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.background.main, width: "100%", overflow: "hidden" }}>
            <LoadingIndicator ref={loaderRef} />


            <OffCanvasDrawer ref={offcanvasRef} title={preCadastro.ordem ? "Detalhe ordem serviço "+preCadastro.ordem:"Registro carga"} position="left" width={700} currentTheme={theme}>
                <CadastroForm cadastro={preCadastro} handleCadastro={handlePreCadastro} modoOperacao={modoOperacao} status={status!} submitCadastro={submitPreCadastro} clearForm={handleClearForm} />
            </OffCanvasDrawer>


            <Drawer
                anchor="right"
                open={configOpen}
                onClose={() => setConfigOpen(false)}
                PaperProps={{
                    sx: {
                        width: isMobile ? '100%' : 400,
                        backgroundColor: theme.background.paper,
                        borderLeft: `1px solid ${theme.border.main}`,
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        borderBottom: `1px solid ${theme.border.divider}`,
                        flexShrink: 0,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={800} color={theme.text.primary}>
                            Notificações
                        </Typography>
                        <IconButton onClick={() => setConfigOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        px: 3,
                        py: 2,

                        scrollbarWidth: 'thin',
                        scrollbarColor: 'transparent transparent',

                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: 8,
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: 'rgba(0,0,0,0.35)',
                        },
                    }}
                >
                    {notifications.length === 0 ? (
                        <Stack alignItems="center" sx={{ mt: 10, opacity: 0.3 }}>
                            <MessageIcon sx={{ fontSize: 48 }} />
                            <Typography>Nenhuma mensagem</Typography>
                        </Stack>
                    ) : (
                        <Stack spacing={2}>
                            {notifications.map((n, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        p: 2,
                                        bgcolor: 'orange',
                                        borderRadius: 2,
                                        color: 'black',
                                        border: `1px solid ${theme.border.divider}`,
                                    }}
                                >
                                    <Typography variant="body2">{n.message}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>

                <Divider />
            </Drawer>


            <Box sx={{ p: "20px 24px", bgcolor: theme.background.paper, borderBottom: `1px solid ${theme.border.divider}`, flexShrink: 0 }}>
                <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"} spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 58, height: 58,  borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                            <img src="https://github.com/Erikvilar/agrion-frontend/blob/develop/src/assets/logo/logoAgrion.jpg?raw=true" width={90} height={60} alt="logoAgrion" />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: theme.text.primary, letterSpacing: '-1px' }}>
                                AGRION <span style={{ color: theme.text.secondary, fontWeight: 400 }}>Gestão</span>
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.text.secondary, fontWeight: 700, textTransform: 'uppercase' }}>Logística e Operações</Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        {!isMobile && buttonActions.map((btn) => (
                            <Button key={btn.id} variant="contained" startIcon={btn.icon} onClick={btn.acao} sx={{ bgcolor: btn.background, borderRadius: '10px', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: btn.hover } }}>
                                {btn.title}
                            </Button>
                        ))}
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Badge badgeContent={notifications.length} color="error">

                            <IconButton onClick={() => setConfigOpen(true)} sx={{ border: `1px solid ${theme.border.main}`, color: theme.text.primary }}><NotificationsIcon /></IconButton>
                        </Badge>


                        <IconButton onClick={() => setConfigOpen(true)} sx={{ border: `1px solid ${theme.border.main}`, color: theme.text.primary }}><SettingsIcon /></IconButton>
                        <IconButton onClick={toggleTheme}>{mode === 'dark' ? <LightModeIcon  color="primary"/> : <DarkModeIcon color="primary" />}</IconButton>

                    </Stack>
                </Stack>
            </Box>


            <Box sx={{ p: "24px 24px 0 24px", flexShrink: 0 }}>
                <TextField
                    fullWidth
                    placeholder="Pesquisar por motorista, placa, CPF ou número da ordem..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") buscarPorDescricao(); }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: theme.background.paper,color:theme.text.secondary } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: theme.text.disabled }} /></InputAdornment> }}
                />

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3, mb: 1 }} flexWrap="wrap" gap={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.text.disabled, textTransform: 'uppercase' }}>Filtros:</Typography>
                        <Chip  onClick={fetchTodos} sx={{ height: 28, fontWeight: 700, bgcolor: filtroAtivo === null ? theme.action.inactiveFilterBg : "transparent" }} />
                        {status?.map((value, index) => value.id != 1 ? (
                            <Box key={index} onClick={() => buscarPorStatus(value.id, index)} sx={{ display: "flex", alignItems: "center", px: 1.5, py: 0.5, borderRadius: "99px", cursor: "pointer", border: "1px solid", borderColor: filtroAtivo === index ? value.corHexadecimal : theme.border.main, bgcolor: filtroAtivo === index ? `${value.corHexadecimal}15` : "transparent" }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: value.corHexadecimal, mr: 1, boxShadow: `0 0 8px ${value.corHexadecimal}` }} />
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem',color:theme.text.secondary }}>{value.descricao}</Typography>
                            </Box>
                        ):(
                            <Box key={index} onClick={() => buscarPorStatus(value.id, index)} sx={{
                                display: "flex",
                                alignItems: "center",
                                px: 2,
                                py: 0.5,
                                borderRadius: "99px",
                                cursor: "pointer",
                                border: "2px solid",
                                borderColor: filtroAtivo === index ? value.corHexadecimal : "transparent",
                                bgcolor: filtroAtivo === index ? value.corHexadecimal : "orange",
                                boxShadow: filtroAtivo === index ? `0 0 12px ${value.corHexadecimal}` : "none",
                                transition: "all 0.2s ease-in-out"
                            }}>
                                <Box sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: filtroAtivo === index ? "#fff" : value.corHexadecimal,
                                    mr: 1
                                }} />
                                <Typography variant="body2" sx={{
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    color: filtroAtivo === index ? "#fff" : theme.text.primary
                                }}>
                                    {value.descricao}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.text.disabled, mr: 1 }}>ORDEM:</Typography>
                        <Button size="small" variant={ordem === 'desc' ? "contained" : "outlined"} startIcon={<ArrowDownwardIcon />} onClick={() => handleOrdenar('desc')} sx={{ borderRadius: "20px", fontSize: "0.75rem" }}>Recentes</Button>
                        <Button size="small" variant={ordem === 'asc' ? "contained" : "outlined"} startIcon={<ArrowUpwardIcon />} onClick={() => handleOrdenar('asc')} sx={{ borderRadius: "20px", fontSize: "0.75rem" }}>Antigos</Button>
                    </Stack>
                </Stack>
            </Box>


            <Box sx={{ flex: 1, width: "100%", p: "0 24px 24px 24px", boxSizing: "border-box", overflow: "hidden" }}>
                <Listagem rows={rows} coluna={coluna} fetchTodos={fetchTodos} newRowRef={newRowRef} handleRowClick={handleRowClick} status={status!} currentTheme={theme} mode={mode} />
            </Box>
        </Box>
    );
}

export default Principal;