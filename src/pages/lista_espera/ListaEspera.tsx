import { Search } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CachedIcon from "@mui/icons-material/Cached";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SortIcon from '@mui/icons-material/Sort';
import {
    Box,
    Button,
    Chip,
    CircularProgress, Divider, InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
    type SelectChangeEvent
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { CadastroForm } from "../../components/cadastroForm/CadastroForm";
import { LeftModal } from "../../components/left-modal-component/LeftModal";
import type { LoadingIndicatorRef } from "../../components/loading-indicator/Component";
import LoadingIndicator from "../../components/loading-indicator/Component";
import { OffCanvasDrawer, type OffcanvasRef } from "../../components/offCanvasDrawer/OffCanvasDrawer";
import { CenteredModal, type ModalRef } from "../../components/vertical_central_modal/CenteredModal";
import { useIsMobile } from "../../hooks/useIsMobile";
import type CadastroDTO from "../../model/CadastroDTO";
import type StatusDTO from "../../model/StatusDTO";
import ApiServices from "../../services/api-service";
import { enviarNotificacao } from "../../utils/enviarNotificacao";
import Tabela from "./Tabela";

// --- Funções Auxiliares (Mantidas) ---
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

    const isMobile = useIsMobile();
    const loaderRef = useRef<LoadingIndicatorRef>(null);
    const open = isModalOpen;

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const [busca, setBusca] = useState("");
    const [rows, setRows] = useState<CadastroDTO[]>([])
    const [isRefreshing, setIsRefreshing] = useState(false);
    const newRowRef = useRef<HTMLTableRowElement | null>(null);
    const modalRef = useRef<ModalRef>(null);
    const offcanvasRef = useRef<OffcanvasRef>(null);


    const getCadastroVazio = (): CadastroDTO => {
        return {
            codigoCadastro: 0, // 0 sinaliza para o Backend que é NOVO
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

    const [cadastro, setCadastro] = useState<CadastroDTO | null>({
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
        pesoCarregado: 0,
        numeroOrdem: 0,
        status: '',
        vigia: 'Nome do Usuário Logado',
    })

    const [status, setStatus] = useState<StatusDTO[]>();
    const [filtroAtivo, setFiltroAtivo] = useState<number | null>(null);


    const [ordem, setOrdem] = useState<'asc' | 'desc'>('desc');
const handleOrdenar = (tipo: 'asc' | 'desc') => {
        setOrdem(tipo);
        
        // Criamos uma cópia do array para não mutar o estado diretamente
        const sortedRows = [...rows].sort((a, b) => {
            // Tratamento para datas nulas ou undefined (coloca no final ou inicio dependendo da logica)
            const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
            const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;

            if (tipo === 'asc') {
                return dataA - dataB; // Mais antigo para mais novo
            } else {
                return dataB - dataA; // Mais novo para mais antigo
            }
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

    const buscarToddosStatus = async () => {
        const { data, success } = await ApiServices.buscarTodosStatus();
        if (success) {
            setStatus(data);
        }
    }

const fetchTodos = useCallback(async (isBackgroundFetching = false) => {
        if (isBackgroundFetching) setIsRefreshing(true)
        setFiltroAtivo(null);
        const { success, data } = await ApiServices.buscarTodos();
        if (success && data) {
            const novaRows = data.map((item: CadastroDTO) =>
                createData(item.codigoCadastro!, item.nomeMotorista, item.telefone, item.cpf, item.corVeiculo, item.placa, item.marca, item.modelo, item.tipoProduto, item.produto, item.operacao, item.pesoVazio, item.pesoCarregado, item.vigia, item.numeroOrdem, item.status, item.dataCriacao)
            );
            // Aplica ordenação padrão (desc) ao carregar
            const sorted = novaRows.sort((a: any, b: any) => {
                 const dA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
                 const dB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
                 return dB - dA;
            });
            setRows(sorted);
            setOrdem('desc'); // Reseta visualmente para desc
        } else {
            setRows([]);
        }
        if (isBackgroundFetching) setIsRefreshing(false)
    }, []);

    const buscarPorStatus = useCallback(async (codigo: number, indexStatus: number, isBackgroundFetch = false) => {
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
    }, []);

    useEffect(() => {
        loaderRef.current?.start()
        fetchTodos()
        buscarToddosStatus()
        loaderRef.current?.done()
    }, [setIsModalOpen, isModalOpen])


    const buttonActions = [
        {
            id: "1",
            title: "Atualizar",
            background: "#2563EB",
            hover: "#1D4ED8",
            acao: () => { fetchTodos(false); },
            icon: isRefreshing
                ? (<CircularProgress size={20} sx={{ color: "#FFFFFF" }} />)
                : <CachedIcon sx={{ color: "#FFFFFF" }} />
        },
        {
            id: "2",
            title: "Cadastrar",
            background: "#10B981",
            hover: "#059669",
            acao: () => {
                handleClearForm();     // Limpa o estado 'cadastro'
                offcanvasRef.current?.open();
            },
            icon: <AddCircleIcon sx={{ color: "#FFFFFF" }} />
        },
        {
            id: "3",
            title: "Limpar filtros",
            background: "#faa93fff",
            hover: "#eb9c0bff",
            acao: () => { fetchTodos(false); },
            icon: isRefreshing
                ? (<CircularProgress size={20} sx={{ color: "#FFFFFF" }} />)
                : <CachedIcon sx={{ color: "#FFFFFF" }} />
        },
        {
            id: "4",
            title: "Ajuda",
            background: "#0D9488",
            hover: "#0F766E",
            acao: () => { offcanvasRef.current?.open() },
            icon: <HelpOutlineIcon sx={{ color: "#FFFFFF" }} />
        }
    ];




    const handleRowClick = (row: CadastroDTO) => {
  
        setCadastro(row);    // Preenche o formulário com os dados da linha
        offcanvasRef.current?.open();
    };
    const handleClearForm = () => {
  
        setCadastro(getCadastroVazio());
    };

    const errors = {};

const handleCadastro = useCallback(
  (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const target = e.target as ChangeEventTarget;
    const { name, value } = target;

    if (!name) return;

    setCadastro((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        [name]: value
      };
    });
  },
  []
);
    const submitCadastro = async () => {
        if (!cadastro) return;

        // Validações básicas
        if (!cadastro.telefone || !cadastro.cpf) {
            // Adicione aqui um toast/alert de erro se necessário
            alert("Preencha Telefone e CPF");
            return;
        }

        try {
            loaderRef.current?.start();

            if (cadastro.codigoCadastro && cadastro.codigoCadastro > 0) {

                console.log("Atualizando registro...", cadastro);


                await ApiServices.cadastrar(cadastro);
            } else {

                enviarNotificacao("Notificação enviada", `${cadastro.telefone}`);


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
    return (
        <Box sx={{
            height: "100vh",
            display: "flex",
            marginTop: 10,
            flexDirection: "column",
            backgroundColor: "#F3F4F6",
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden"
        }}>
            <LoadingIndicator ref={loaderRef} />

            <OffCanvasDrawer
                ref={offcanvasRef}
                title="Filtros Avançados"
                position="left"
                width={700}

            >

                <CadastroForm
                    cadastro={cadastro}
                    handleCadastro={handleCadastro}
                    errors={errors}
                    status={status!}
                    submitCadastro={submitCadastro}
                    clearForm={handleClearForm} // <--- Passando a função aqui
                />

            </OffCanvasDrawer>

            <CenteredModal
                ref={modalRef}
                title="Formulário Encapsulado"
                maxWidth="md" children={undefined}
            />

            {/* AJUSTE PRINCIPAL AQUI:
                Removido maxWidth e margin:auto.
                Padding fixo em 20px.
            */}
            <Box sx={{
                padding: "20px",
                width: "100%",
                boxSizing: "border-box"
            }}>

                {/* --- HEADER --- */}
                <Box sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    mb: 3
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
                            Painel principal
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#6B7280", mt: 0.5 }}>
                            Gerenciador de cargas.
                        </Typography>
                    </Box>

                    {/* Botões alinhados à direita */}
                    <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mt: isMobile ? 2 : 0, width: isMobile ? '100%' : 'auto' }}>
                        {buttonActions.map((btn) => (
                            <Button
                                key={btn.id}
                                variant="contained"
                                startIcon={btn.icon}
                                onClick={btn.acao}
                                fullWidth={isMobile}
                                sx={{
                                    backgroundColor: btn.background,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    padding: "8px 20px",
                                    boxShadow: "none", // Design mais Flat
                                    "&:hover": {
                                        backgroundColor: btn.hover,
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                    }
                                }}
                            >
                                {btn.title}
                            </Button>
                        ))}
                    </Stack>
                </Box>

                {/* --- ÁREA DE FILTROS E BUSCA --- */}
                <Paper elevation={0} sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid #E5E7EB",
                    mb: 3,
                    backgroundColor: "#FFFFFF",
                    width: "100%" // Garante largura total
                }}>

                    <TextField
                        fullWidth
                        placeholder="Pesquisar por motorista, placa, CPF ou número da ordem..."
                        variant="outlined"
                        size="small" // Input um pouco mais compacto
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") buscarPorDescricao(); }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "#F9FAFB",
                                "& fieldset": { borderColor: "#E5E7EB" },
                                "&:hover fieldset": { borderColor: "#D1D5DB" },
                                "&.Mui-focused fieldset": { borderColor: "#2563EB" }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: "#9CA3AF" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {!isMobile && (
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 2,
                            gap: 1.5,
                            flexWrap: "wrap"
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                Filtros rápidos:
                            </Typography>

                            <Chip
                                label="Todos"
                                onClick={() => fetchTodos(false)}
                                size="small"
                                sx={{
                                    backgroundColor: filtroAtivo === null ? "#111827" : "#F3F4F6",
                                    color: filtroAtivo === null ? "#FFF" : "#374151",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: filtroAtivo === null ? "#000" : "#E5E7EB" }
                                }}
                            />

                            {status?.map((value, index) => (
                                <Box
                                    key={index}
                                    onClick={() => buscarPorStatus(value.id, index)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px 10px",
                                        borderRadius: "20px",
                                        cursor: "pointer",
                                        backgroundColor: filtroAtivo === index ? `${value.corHexadecimal}20` : "transparent",
                                        border: `1px solid ${filtroAtivo === index ? value.corHexadecimal : "#E5E7EB"}`,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: `${value.corHexadecimal}10`,
                                            borderColor: value.corHexadecimal
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        width: 8, height: 8, borderRadius: "50%",
                                        backgroundColor: value.corHexadecimal, mr: 1
                                    }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#374151", fontSize: '0.875rem' }}>
                                        {value.descricao}
                                    </Typography>
                                </Box>
                            ))}
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <SortIcon fontSize="small"/> Ordenar por data:
                                </Typography>
                                
                                <Chip
                                    icon={<ArrowDownwardIcon />}
                                    label="Mais recentes"
                                    onClick={() => handleOrdenar('desc')}
                                    size="small"
                                    variant={ordem === 'desc' ? "filled" : "outlined"}
                                    color={ordem === 'desc' ? "primary" : "default"}
                                    clickable
                                />

                                <Chip
                                    icon={<ArrowUpwardIcon />}
                                    label="Mais antigos"
                                    onClick={() => handleOrdenar('asc')}
                                    size="small"
                                    variant={ordem === 'asc' ? "filled" : "outlined"}
                                    color={ordem === 'asc' ? "primary" : "default"}
                                    clickable
                                />
                            </Box>
                        </Box>
                        
                    )}
                
                </Paper>

                <LeftModal
                    open={open}
                    onClose={handleCloseModal}
                    cadastro={cadastro}
                    handleCadastro={handleCadastro}
                    errors={errors}
                    submitCadastro={submitCadastro}
                />

                <Paper elevation={0} sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
                    width: "100%"
                }}>
                    <Tabela rows={rows} fetchTodos={fetchTodos} newRowRef={newRowRef} handleRowClick={handleRowClick} status={status!} />
                </Paper>
            </Box>
        </Box>
    )
}
export default ListaEspera;