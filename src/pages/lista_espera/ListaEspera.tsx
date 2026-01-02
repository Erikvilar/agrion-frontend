import { Search } from "@mui/icons-material";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { CadastroForm } from "../../components/cadastroForm/CadastroForm";
import type { LoadingIndicatorRef } from "../../components/loading-indicator/Component";
import LoadingIndicator from "../../components/loading-indicator/Component";
import { OffCanvasDrawer, type OffcanvasRef } from "../../components/offCanvasDrawer/OffCanvasDrawer";
import { CenteredModal, type ModalRef } from "../../components/vertical_central_modal/CenteredModal";
import { useIsMobile } from "../../hooks/useIsMobile";
import type CadastroDTO from "../../model/CadastroDTO";
import type StatusDTO from "../../model/StatusDTO";
import ApiServices from "../../services/api-service";
import { enviarNotificacao } from "../../utils/enviarNotificacao";
import { APP_THEME, type ThemeMode } from "../../styles/themeConstans"; // Seu arquivo de constantes
import Tabela from "./Tabela";


function createData(
    codigoCadastro: number, nomeMotorista: string, telefone: number | null, cpf: string,
    corVeiculo: string, placa: string, marca: string, modelo: string, tipoProduto: string,
    produto: string, operacao: string, pesoVazio: number, pesoCarregado: number | undefined,
    vigia: string, numeroOrdem: number, status: string, dataCriacao?: string | Date
) {
    return {
        codigoCadastro, nomeMotorista, telefone, cpf, corVeiculo, placa, marca, modelo,
        tipoProduto, produto, operacao, pesoVazio, pesoCarregado, vigia, numeroOrdem, status, dataCriacao
    };
}

export type ChangeEventTarget = {
    name?: string;
    value: string;
};

interface ListaEsperaProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

const ListaEspera = ({ isModalOpen, setIsModalOpen }: ListaEsperaProps) => {

    // --- LÓGICA DO TEMA ---
    const [mode, setMode] = useState<ThemeMode>('dark');
    const theme = APP_THEME[mode];

    const toggleTheme = () => {
        setMode((prev) => prev === 'dark' ? 'light' : 'dark');
    };


    const isMobile = useIsMobile();
    const loaderRef = useRef<LoadingIndicatorRef>(null);

    const [busca, setBusca] = useState("");
    const [rows, setRows] = useState<CadastroDTO[]>([])
    const [isRefreshing, setIsRefreshing] = useState(false);
    const newRowRef = useRef<HTMLTableRowElement | null>(null);
    const modalRef = useRef<ModalRef>(null);
    const offcanvasRef = useRef<OffcanvasRef>(null);

    const getCadastroVazio = (): CadastroDTO => {
        return {
            codigoCadastro: 0,
            nomeMotorista: '',
            telefone: null,
            cpf: '',
            corVeiculo: '',
            placa: '',
            marca: '',
            modelo: '',
            operacao: '',
            tipoProduto: '',
            produto: '',
            pesoVazio: 0,
            pesoCarregado: undefined,
            numeroOrdem: 0,
            status: 'Sem Ordem de Carregamento',
            vigia: '',
            dataCriacao: undefined
        };
    };

    const [cadastro, setCadastro] = useState<CadastroDTO | null>(getCadastroVazio());
    const [status, setStatus] = useState<StatusDTO[]>();
    const [filtroAtivo, setFiltroAtivo] = useState<number | null>(null);
    const [ordem, setOrdem] = useState<'asc' | 'desc'>('desc');
    const errors = {};


    const handleCadastro = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
            const target = e.target as ChangeEventTarget;
            const { name, value } = target;
            if (!name) return;
            setCadastro((prev) => {
                if (!prev) return null;
                return { ...prev, [name]: value };
            });
        }, []
    );


    const submitCadastro = async () => {
        if (!cadastro) return;
        if (!cadastro.telefone || !cadastro.cpf) {
            alert("Preencha Telefone e CPF");
            return;
        }
        try {
            loaderRef.current?.start();
            if (cadastro.codigoCadastro && cadastro.codigoCadastro > 0) {
                await ApiServices.cadastrar(cadastro);
            } else {

                try {
                    enviarNotificacao("Notificação enviada", `${cadastro.telefone}`);
                } catch (e) { console.warn("Erro ao notificar", e); }

                const novoCadastro = { ...cadastro, codigoCadastro: 0 };
                await ApiServices.cadastrar(novoCadastro);
            }
            await fetchTodos(true);
            offcanvasRef.current?.close();
        } catch (error) {
            console.error("Erro ao salvar", error);
        } finally {
            loaderRef.current?.done();
        }
    };

    const handleClearForm = () => {
        setCadastro(getCadastroVazio());
    };

    const handleRowClick = (row: CadastroDTO) => {
        setCadastro(row);
        offcanvasRef.current?.open();
    };

    // --- Buscas e Filtros ---
    const handleOrdenar = (tipo: 'asc' | 'desc') => {
        setOrdem(tipo);
        const sortedRows = [...rows].sort((a, b) => {
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
            const novaRows = resultado.data.map((item: CadastroDTO) => ({ ...item }));
            setRows(novaRows);
        } else {
            setRows([]);
        }
    };

    const buscarTodosStatus = async () => {
        const { data, success } = await ApiServices.buscarTodosStatus();
        if (success) {
            setStatus(data);
        }
    }

    const fetchTodos = useCallback(async (isBackgroundFetching = false) => {
try{

    if (isBackgroundFetching) setIsRefreshing(true)
    setFiltroAtivo(null);
    loaderRef.current?.start();
    const { success, data } = await ApiServices.buscarTodos();
    if (success && data) {
        const novaRows = data.map((item: CadastroDTO) =>
            createData(item.codigoCadastro!, item.nomeMotorista, item.telefone, item.cpf, item.corVeiculo, item.placa, item.marca, item.modelo, item.tipoProduto, item.produto, item.operacao, item.pesoVazio, item.pesoCarregado, item.vigia, item.numeroOrdem, item.status, item.dataCriacao)
        );
        const sorted = novaRows.sort((a: any, b: any) => {
            const dA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
            const dB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
            return dB - dA;
        });
        setRows(sorted);
        setOrdem('desc');
    } else {
        setRows([]);
    }
    if (isBackgroundFetching) setIsRefreshing(false)

}catch (error){

}finally {
    loaderRef.current?.done();
}

    }, []);

    const buscarPorStatus = useCallback(async (codigo: number, indexStatus: number, isBackgroundFetch = false) => {
        try{
            loaderRef.current?.start();
            if (isBackgroundFetch) setIsRefreshing(true);
            setFiltroAtivo(indexStatus);
            const response = await ApiServices.buscarPorStatus(codigo);
            if (response.success && response.data) {
                const novaRows = response.data.map((item: CadastroDTO) =>
                    createData(item.codigoCadastro!, item.nomeMotorista, item.telefone, item.cpf, item.corVeiculo, item.placa, item.marca, item.modelo, item.tipoProduto, item.produto, item.operacao, item.pesoVazio, item.pesoCarregado, item.vigia, item.numeroOrdem, item.status, item.dataCriacao)
                );
                setRows(novaRows);
            } else {
                setRows([]);
            }
            if (isBackgroundFetch) setIsRefreshing(false);
        }catch (error){

        }finally {
            loaderRef.current?.done();
        }
    }, []);

    useEffect(() => {
        loaderRef.current?.start()
        fetchTodos()
        buscarTodosStatus()
        loaderRef.current?.done()
    }, [setIsModalOpen, isModalOpen])

    const buttonActions = [
        {
            id: "1",
            title: "Atualizar",
            background: "#3b82f6",
            hover: "#2563eb",
            acao: () => { fetchTodos(false); },
            icon: isRefreshing
                ? (<CircularProgress size={20} sx={{ color: "#FFFFFF" }} />)
                : <CachedIcon sx={{ color: "#FFFFFF" }} />
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
            icon: <AddCircleIcon sx={{ color: "#FFFFFF" }} />
        },
        {
            id: "3",
            title: "Limpar filtro",
            background: "#F16D34",
            hover: "#DE802B",
            acao: () => { fetchTodos(false); },
            icon: isRefreshing
                ? (<CircularProgress size={20} sx={{ color: "#FFFFFF" }} />)
                : <CachedIcon sx={{ color: "#FFFFFF" }} />
        },
        {
            id: "4",
            title: "Ajuda",
            background: mode === 'dark' ? "#374151" : "#D1D5DB",
            hover: mode === 'dark' ? "#4b5563" : "#9CA3AF",
            acao: () => { offcanvasRef.current?.open() },
            icon: <HelpOutlineIcon sx={{ color: mode === 'dark' ? "#FFFFFF" : theme.text.primary }} />
        }
    ];

    return (
        <Box sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.background.main, // TEMA APLICADO
            width: "100%",
            overflow: "hidden",
            transition: "background-color 0.3s ease"
        }}>
            <LoadingIndicator ref={loaderRef} />

            <OffCanvasDrawer
                ref={offcanvasRef}
                title=""
                position="left"
                width={700}
                currentTheme={theme}  // <--- ADICIONE ESTA LINHA
            >
                {/* O FORMULÁRIO AGORA TEM A LÓGICA RESTAURADA */}
                <CadastroForm
                    cadastro={cadastro}
                    handleCadastro={handleCadastro}
                    errors={errors}
                    status={status!}
                    submitCadastro={submitCadastro}
                    clearForm={handleClearForm}
                />
            </OffCanvasDrawer>

            <CenteredModal
                ref={modalRef}
                title="Formulário Encapsulado"
                maxWidth="md" children={undefined}
            />

            {/* HEADER + FILTROS (Área Fixa) */}
            <Box sx={{
                padding: "24px 24px 0 24px",
                width: "100%",
                boxSizing: "border-box",
                flexShrink: 0
            }}>
                {/* --- TITULO E BOTÕES --- */}
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
                            Painel Principal
                        </Typography>
                        <Typography variant="body1" sx={{ color: theme.text.secondary, mt: 0.5 }}>
                            Gerenciador de cargas e operações.
                        </Typography>
                    </Box>

                    <Stack direction={isMobile ? "column" : "row"} spacing={1.5} alignItems="center" sx={{ mt: isMobile ? 2 : 0 }}>

                        {/* SWITCH DE TEMA */}
                        <Tooltip title={mode === 'dark' ? "Modo Claro" : "Modo Escuro"}>
                            <IconButton onClick={toggleTheme} sx={{ color: theme.text.primary, border: `1px solid ${theme.border.main}` }}>
                                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
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

                {/* --- BARRA DE BUSCA --- */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Pesquisar por motorista, placa, CPF ou número da ordem..."
                        variant="outlined"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") buscarPorDescricao(); }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                backgroundColor: theme.background.paper, // Tema
                                color: theme.text.primary,
                                transition: "all 0.2s",
                                "& fieldset": { borderColor: theme.border.main },
                                "&:hover fieldset": { borderColor: theme.text.disabled },
                                "&.Mui-focused fieldset": { borderColor: theme.border.focus },
                                "& input::placeholder": { color: theme.text.disabled }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: theme.text.disabled }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* --- FILTROS RÁPIDOS E ORDENAÇÃO --- */}
                {!isMobile && (
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        mb: 2,
                        gap: 2
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
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
                                onClick={() => fetchTodos(false)}
                                sx={{
                                    height: 28,
                                    backgroundColor: filtroAtivo === null ? theme.action.inactiveFilterBg : "transparent",
                                    color: filtroAtivo === null ? theme.text.primary : theme.text.secondary,
                                    fontWeight: 700,
                                    border: filtroAtivo === null ? "none" : `1px solid ${theme.border.main}`,
                                    "&:hover": { backgroundColor: theme.background.hover }
                                }}
                            />

                            {status?.map((value, index) => (
                                <Box
                                    key={index}
                                    onClick={() => buscarPorStatus(value.id, index)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
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
                                    }} />
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

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.text.disabled, textTransform: 'uppercase' }}>
                                Ordenar Por:
                            </Typography>

                            <Button
                                size="small"
                                variant={ordem === 'desc' ? "contained" : "outlined"}
                                startIcon={<ArrowDownwardIcon />}
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
                                startIcon={<ArrowUpwardIcon />}
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
                    </Box>
                )}
            </Box>

            {/* --- ÁREA DA TABELA (Preenche o resto da tela) --- */}
            <Box sx={{
                flex: 1,
                width: "100%",
                padding: "0 24px 24px 24px",
                boxSizing: "border-box",
                overflow: "hidden"
            }}>
                <Tabela
                    rows={rows}
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
export default ListaEspera;