import {useEffect, useState, useCallback, useRef} from "react"; // Adicionado useRef e useCallback
import {
    Box,
    Card,
    CardContent,
    Grid,
    IconButton,
    Typography,
    Stack,
    Chip,
    Avatar,
    Collapse,
    CircularProgress,
    Button,
    Skeleton,
    TextField,
    InputAdornment,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Badge
} from "@mui/material";
import {APP_THEME, type ThemeMode} from "@/styles/themeConstants";

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScaleIcon from '@mui/icons-material/Scale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

import ApiServices from "@/services/api-service";
import  { WSMessage } from "@/services/websocket/eventBus"
import {toast, Toaster} from "react-hot-toast";
import eventBus from "@/services/websocket/eventBus";

interface PreCadastroItem {
    identificador: number;
    nomeMotorista: string;
    placa: string;
    telefone: string;
    modelo: string;
    marca: string;
    corVeiculo: string;
    produto: string;
    status: string;
    previsaoChegada?: string;
    pesoVazio?: number;
    confirmado?: boolean;
    prioridade?: boolean;
}

export interface ConfirmarEntradaDTO {
    identificador: number;
    confirmar: boolean;
    pesoVazio?: number;
}

export default function Controle() {
    const [mode, setMode] = useState<ThemeMode>('dark');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [rows, setRows] = useState<PreCadastroItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState<number | null>(null);
    const [pesoInput, setPesoInput] = useState<string>("");
    const [notifications, setNotifications] = useState<WSMessage[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const theme = APP_THEME[mode];

    const usuarioLogado = localStorage.getItem("login");
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
        audioRef.current.volume = 0.5;
    }, []);

    const playNotificationSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                console.warn("Áudio aguardando interação do usuário.");
            });
        }
    }, []);


    const fetchData = async () => {
        setLoading(true);
        try {
            const {data, success} = await ApiServices.buscarTodosPreCadastro();
            if (success && data) {
                const dadosFormatados: PreCadastroItem[] = data.map((item: any) => ({
                    identificador: item.identificador,
                    nomeMotorista: item.nomeMotorista,
                    placa: item.placa,
                    telefone: item.contato || item.telefone,
                    modelo: item.modelo,
                    marca: item.marca,
                    produto: item.produto || 'Granel',
                    status: !item.confirmado ? 'AGUARDANDO' : 'NO PÁTIO',
                    previsaoChegada: item.previsaoChegada,
                    pesoVazio: item.peso ?? 0,
                    confirmado: item.confirmado,
                    prioridade: item.prioridade
                }));

                const sorted = dadosFormatados.sort((a, b) => {
                    if (a.prioridade && !b.prioridade) return -1;
                    if (!a.prioridade && b.prioridade) return 1;
                    const dateA = a.previsaoChegada ? new Date(a.previsaoChegada).getTime() : Infinity;
                    const dateB = b.previsaoChegada ? new Date(b.previsaoChegada).getTime() : Infinity;
                    return dateA - dateB;
                });
                setRows(sorted);
            }
        } catch (err) {
            console.error("Erro ao buscar pré-cadastros:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const onMessage = (data: WSMessage) => {
            playNotificationSound();

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
    }, [theme, playNotificationSound]);

    const clearNotifications = () => setNotifications([]);
    const toggleTheme = () => setMode((prev) => prev === 'dark' ? 'light' : 'dark');

    const handleCardClick = (id: number) => {
        if (expandedId !== id) setPesoInput("");
        setExpandedId(prev => prev === id ? null : id);
    };

    const handleConfirmarEntrada = async (preCadastroItem: PreCadastroItem) => {
        const pesoNumerico = parseFloat(pesoInput);
        if (isNaN(pesoNumerico) || pesoNumerico <= 0) return;

        setConfirmingId(preCadastroItem.identificador);
        try {
            const responseDTO: ConfirmarEntradaDTO = {
                identificador: preCadastroItem.identificador,
                confirmar: true,
                pesoVazio: pesoNumerico
            };
            const {success} = await ApiServices.confirmarEntrada(responseDTO);
            if (success) {
                setRows(prevRows => prevRows.map(row => {
                    if (row.identificador === preCadastroItem.identificador) {
                        return {...row, confirmed: true, status: 'NO PÁTIO', pesoVazio: pesoNumerico};
                    }
                    return row;
                }));
                setPesoInput("");
                setExpandedId(null);
                let messageDefault = `Confirmada entrada de veiculo ${preCadastroItem.marca} de placa ${preCadastroItem.placa} no pátio.`
                await ApiServices.notifyGroup("ROLE_GERENCIAL", messageDefault);
            }
        } catch (error) {
            console.error("Erro ao confirmar entrada:", error);
        } finally {
            setConfirmingId(null);
        }
    };

    const calcularTempo = (dataString?: string) => {
        if (!dataString) return "Sem previsão";
        const agora = new Date().getTime();
        const alvo = new Date(dataString).getTime();
        const diffMinutos = Math.floor((alvo - agora) / 60000);
        if (diffMinutos < 0) {
            const atraso = Math.abs(diffMinutos);
            return atraso > 60 ? `Há ${Math.floor(atraso / 60)}h` : `Há ${atraso} min`;
        }
        return diffMinutos > 60 ? `Em ${Math.floor(diffMinutos / 60)}h` : `Em ${diffMinutos} min`;
    };

    const getStatusColor = (status: string) => {
        if (status === 'AGUARDANDO') return '#ca8a04';
        if (status === 'NO PÁTIO') return '#16a34a';
        return theme.text.disabled;
    };

    const DetailItem = ({label, value}: { label: string, value: any }) => (
        <Box sx={{flex: 1, minWidth: '45%'}}>
            <Typography variant="caption" sx={{
                color: theme.text.secondary,
                display: 'block',
                fontWeight: 600,
                fontSize: 10,
                textTransform: 'uppercase'
            }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{fontWeight: 700, color: theme.text.primary, fontSize: 13}}>
                {value}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{
            width: "100%",
            height: "100vh",
            backgroundColor: theme.background.main,
            color: theme.text.primary,
            display: 'flex',
            flexDirection: 'column',
            overflow: "hidden"
        }}>
            <Toaster position="top-right" reverseOrder={false}/>

            <Box sx={{flexShrink: 0}}>
                <Box sx={{
                    p: 2,
                    pt: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: theme.background.paper,
                    borderBottom: `1px solid ${theme.border.divider}`
                }}>
                    <Box>

                        <Typography variant="h5" sx={{fontWeight: 800, color: theme.text.primary}}>AGRION PROJECT</Typography>
                        <Typography variant="caption"
                                    sx={{color: theme.text.secondary, fontWeight: 600}}>User: {usuarioLogado}</Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <IconButton onClick={() => setIsOpen(true)} sx={{color: theme.text.primary}}>
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton onClick={fetchData} disabled={loading}
                                    sx={{color: theme.text.primary}}><RefreshIcon/></IconButton>
                        <IconButton onClick={toggleTheme} sx={{color: theme.text.primary}}>{mode === 'dark' ?
                            <LightModeIcon/> : <DarkModeIcon/>}</IconButton>
                    </Box>
                </Box>

                <Box sx={{p: 2}}>
                    <Grid container spacing={2}>

                            <Card sx={{
                                backgroundColor: theme.background.paper,
                                border: `1px solid ${theme.border.main}`,
                                boxShadow: 'none'
                            }}>
                                <CardContent sx={{p: '12px !important'}}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h5" fontWeight={800}
                                                    color={theme.text.primary}>{rows.filter(p => p?.confirmado).length}</Typography>
                                        <LocalShippingIcon
                                            sx={{color: theme.border.focus, opacity: 0.8, fontSize: 20}}/>
                                    </Box>
                                    <Typography variant="caption" color={theme.text.secondary}
                                                sx={{fontSize: '0.65rem'}}>Pátio Total</Typography>
                                </CardContent>
                            </Card>


                            <Card sx={{
                                backgroundColor: theme.background.paper,
                                border: `1px solid ${theme.border.main}`,
                                boxShadow: 'none'
                            }}>
                                <CardContent sx={{p: '12px !important'}}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h5" fontWeight={800}
                                                    sx={{color: '#ca8a04'}}>{rows.filter(p => !p?.confirmado).length}</Typography>
                                        <AccessTimeIcon sx={{color: '#ca8a04', opacity: 0.8, fontSize: 20}}/>
                                    </Box>
                                    <Typography variant="caption" color={theme.text.secondary}
                                                sx={{fontSize: '0.65rem'}}>Agendados</Typography>
                                </CardContent>
                            </Card>


                            <Card sx={{
                                backgroundColor: theme.background.paper,
                                border: `1px solid ${theme.border.main}`,
                                boxShadow: 'none'
                            }}>
                                <CardContent sx={{p: '12px !important'}}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h5" fontWeight={800}
                                                    sx={{color: '#ca8a04'}}>{rows.filter(p => p?.prioridade).length}</Typography>
                                        <LocalShippingIcon sx={{color: '#ca8a04', opacity: 0.8, fontSize: 20}}/>
                                    </Box>
                                    <Typography variant="caption" color={theme.text.secondary}
                                                sx={{fontSize: '0.65rem'}}>Prioritários</Typography>
                                </CardContent>
                            </Card>

                    </Grid>
                </Box>
            </Box>

            <Drawer
                anchor="right"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: {
                        width: 320,
                        backgroundColor: theme.background.paper,
                        backgroundImage: 'none',
                        color: theme.text.primary
                    }
                }}
            >
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${theme.border.divider}`
                }}>
                    <Typography variant="h6" fontWeight={800} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <NotificationsIcon fontSize="small"/> Notificações
                    </Typography>
                    <Box>
                        <IconButton onClick={clearNotifications} size="small" sx={{color: theme.text.secondary, mr: 1}}>
                            <DeleteSweepIcon/>
                        </IconButton>
                        <IconButton onClick={() => setIsOpen(false)} size="small" sx={{color: theme.text.secondary}}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </Box>
                <List sx={{flex: 1, overflowY: 'auto', p: 1}}>
                    {notifications.length === 0 ? (
                        <Box sx={{p: 4, textAlign: 'center'}}>
                            <Typography variant="body2" color="text.secondary">Nenhuma notificação por
                                enquanto.</Typography>
                        </Box>
                    ) : (
                        notifications.map((notif, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    mb: 1,
                                    borderRadius: 1,
                                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    borderLeft: `3px solid ${theme.border.focus}`
                                }}
                            >
                                <ListItemText
                                    primary={notif.message}
                                    primaryTypographyProps={{variant: 'body2', fontWeight: 600}}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {new Date().toLocaleTimeString()}
                                </Typography>
                            </ListItem>
                        ))
                    )}
                </List>
            </Drawer>

            <Box sx={{
                flex: 1, px: 2, pb: 4, overflowY: "auto",
                msOverflowStyle: 'none', scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {display: 'none'}
            }}>
                <Stack spacing={2}>
                    {loading ? (
                        Array.from(new Array(4)).map((_, i) => <Skeleton key={i} variant="rectangular" height={90} sx={{
                            borderRadius: 3,
                            bgcolor: theme.border.divider
                        }}/>)
                    ) : (
                        rows.map((item) => {
                            const isExpanded = expandedId === item.identificador;
                            const isPesoValido = parseFloat(pesoInput) > 0;
                            const cardBg = item.prioridade ? (mode === 'dark' ? '#2c2615' : '#fffbeb') : theme.background.paper;
                            const cardBorder = item.prioridade ? '#ca8a04' : (isExpanded ? theme.border.focus : theme.border.main);

                            return (
                                <Card
                                    key={item.identificador}
                                    onClick={() => handleCardClick(item.identificador)}
                                    sx={{
                                        backgroundColor: cardBg, border: `1px solid ${cardBorder}`,
                                        borderRadius: '12px', transition: 'all 0.3s ease', cursor: 'pointer',
                                        position: 'relative', overflow: 'hidden',
                                        '&::before': item.prioridade ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '4px',
                                            backgroundColor: '#ca8a04'
                                        } : {}
                                    }}
                                >
                                    <CardContent sx={{p: 2, '&:last-child': {pb: isExpanded ? 0 : 2}}}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start"
                                             mb={1}>
                                            <Box display="flex" gap={1.5}>
                                                <Avatar sx={{
                                                    bgcolor: item.prioridade ? '#ca8a04' : theme.border.divider,
                                                    color: item.prioridade ? '#fff' : theme.text.primary,
                                                    width: 40,
                                                    height: 40,
                                                    fontWeight: 700
                                                }}>
                                                    {item.nomeMotorista?.substring(0, 2).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={700}
                                                                color={theme.text.primary}
                                                                lineHeight={1.2}>{item.nomeMotorista}</Typography>
                                                    <Typography variant="body2" color={theme.text.secondary}
                                                                fontSize="0.8rem">{item.placa} • {item.produto}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                gap: 0.5
                                            }}>
                                                <Chip label={item.status} size="small" sx={{
                                                    height: 20,
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    backgroundColor: `${getStatusColor(item.status)}20`,
                                                    color: getStatusColor(item.status),
                                                    border: `1px solid ${getStatusColor(item.status)}40`
                                                }}/>
                                                {item.prioridade && <Chip label="PRIORIDADE" size="small" sx={{
                                                    height: 16,
                                                    fontSize: '0.55rem',
                                                    fontWeight: 900,
                                                    bgcolor: '#ca8a04',
                                                    color: '#fff'
                                                }}/>}
                                            </Box>
                                        </Box>


                                    </CardContent>
                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                        <Box sx={{
                                            p: 3,

                                            pt: 0,
                                            mt: 1,

                                        }}>
                                            <Stack spacing={2} sx={{mb: 2}}>
                                                <Stack direction="row" spacing={2}><DetailItem label="Motorista"
                                                                                               value={item.nomeMotorista}/>
                                                    <DetailItem label="Placa" value={item.placa}/></Stack>
                                                <Stack direction="row" spacing={2}><DetailItem label="Modelo"
                                                                                               value={item.modelo}/>
                                                    <DetailItem label="Marca" value={item.marca}/></Stack>
                                                <Stack direction="row" spacing={2}><DetailItem label="Cor"
                                                                                               value={item.corVeiculo}/>
                                                    <DetailItem label="Previsão"
                                                                value={calcularTempo(item.previsaoChegada) || 'N/A'}/></Stack>
                                                <Stack direction="row" spacing={2}><DetailItem label="ID Ordem"
                                                                                               value={`#${item.identificador}`}/>
                                                    <DetailItem label="Tara prevista"
                                                                value={item.pesoVazio ? `${item.pesoVazio} kg` : 'Não informado'}/></Stack>
                                            </Stack>
                                            {!item.confirmado && (
                                                <Box sx={{mt: 2, mb: 2}}>
                                                    <Typography variant="caption" sx={{
                                                        color: theme.text.secondary,
                                                        mb: 1,
                                                        display: 'block'
                                                    }}>Confirme o peso (TARA):</Typography>
                                                    <TextField
                                                        fullWidth size="small" type="number" value={pesoInput}
                                                        onChange={(e) => setPesoInput(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        placeholder="0.00"
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start"><ScaleIcon
                                                                fontSize="small"
                                                                sx={{color: theme.text.secondary}}/></InputAdornment>,
                                                            endAdornment: <InputAdornment position="end"
                                                                                          sx={{color: theme.text.secondary}}>kg</InputAdornment>,
                                                            sx: {
                                                                color: theme.text.primary,
                                                                fontWeight: 600,
                                                                bgcolor: item.prioridade ? 'rgba(0,0,0,0.05)' : theme.background.main
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                            <Button
                                                fullWidth variant="contained"
                                                disabled={confirmingId !== null || item.confirmado || (!item.confirmado && !isPesoValido)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleConfirmarEntrada(item);
                                                }}
                                                startIcon={confirmingId === item.identificador ?
                                                    <CircularProgress size={20} color="inherit"/> : <CheckCircleIcon/>}
                                                sx={{
                                                    backgroundColor: item.confirmado ? "#16a34a" : (item.prioridade ? "#ca8a04" : theme.border.focus),
                                                    fontWeight: 700,
                                                    py: 1.2,
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    boxShadow: 'none',
                                                    "&:disabled": {
                                                        backgroundColor: item.confirmado ? "#16a34a" : theme.border.divider,
                                                        color: "white",
                                                        opacity: 0.6
                                                    }
                                                }}
                                            >
                                                {confirmingId === item.identificador ? "Processando..." : item.confirmado ? "Entrada confirmada" : "Confirmar entrada"}
                                            </Button>
                                        </Box>
                                    </Collapse>
                                </Card>
                            );
                        })
                    )}
                </Stack>
            </Box>
        </Box>
    );
}