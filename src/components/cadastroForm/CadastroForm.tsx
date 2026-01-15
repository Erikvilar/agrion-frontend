import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    Switch,
    TextField,
    Tooltip,
    Typography,
    type SelectChangeEvent
} from "@mui/material";
import { green, grey, orange, red } from "@mui/material/colors";
import  { useState } from "react";

import type StatusDTO from '../../model/dto/StatusDTO.ts';
import RegistroCadastroDTO from "@/model/dto/registro/RegistroCadastroDTO";

interface Errors {
    cpf?: boolean;
    pesoVazio?: boolean;
    previsao?: boolean;
    placa?: boolean;
}

interface CadastroVeiculoFormProps {
    cadastro: RegistroCadastroDTO | null;
    handleCadastro: (e: FormChangeEvent) => void;
    errors: Errors;
    status: StatusDTO[];
    submitCadastro: (isPreCadastro: boolean) => void;
    clearForm: () => void;
}


const inputStyle = { bgcolor: "transparent",color:"white" };
type FormChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent;
export const CadastroForm = ({
    cadastro,
    handleCadastro,
    errors,
    submitCadastro,
    clearForm,
    status
}: CadastroVeiculoFormProps) => {

    const [isPreCadastro, setIsPreCadastro] = useState(true);
    status.entries();
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPreCadastro(event.target.checked);
    };

    return (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%"}}>

            {/* --- CABEÇALHO --- */}
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={700} color={grey[800]} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isPreCadastro ? "Agendamento" : "Cadastro comum"}
                    </Typography>

                    <Tooltip title="Limpar formulário">
                        <IconButton
                            onClick={clearForm}
                            size="small"
                            sx={{ color: grey[500], "&:hover": { color: red[500], bgcolor: red[50] } }}
                        >
                            <DeleteSweepIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPreCadastro}
                                onChange={handleSwitchChange}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: orange[600] },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: orange[600] },
                                }}
                            />
                        }
                        label={<Typography variant="caption" color={grey[500]}>Modo Pré-cadastro (Veículo não chegou)</Typography>}
                    />
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* --- FORMULÁRIO --- */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
                gap: 2
            }}>


                {isPreCadastro && (
                    <Box key="box-previsao" sx={{ gridColumn: '1 / -1', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    color: cadastro?.confirmado ? grey[500] : orange[800],
                                }}
                            >
                                {cadastro?.confirmado ? "Chegada confirmada em" :"Previsão de chegada" }
                            </Typography>

                            {/* Indicador visual de bloqueio */}
                            {cadastro?.confirmado && (
                                <Tooltip title="Este campo não pode ser editado após a confirmação">
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: grey[500] }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    </Box>
                                </Tooltip>
                            )}
                        </Box>

                        <TextField
                            fullWidth
                            size="small"
                            type="datetime-local"
                            name="previsaoChegada"
                            disabled={cadastro?.confirmado}
                            sx={{
                                ...inputStyle,

                                "& .Mui-disabled": {
                                    bgcolor: grey[100],
                                    color: grey[600],
                                    cursor: "not-allowed",
                                    WebkitTextFillColor: grey[600],
                                },
                                "& input::-webkit-calendar-picker-indicator": {
                                    filter: cadastro?.confirmado
                                        ? "grayscale(100%) opacity(30%)"
                                        : "invert(40%) sepia(90%) saturate(1500%) hue-rotate(10deg) brightness(90%) contrast(100%)",
                                    cursor: cadastro?.confirmado ? "default" : "pointer"
                                }
                            }}
                            value={
                                cadastro?.previsaoChegada ? (() => {
                                    const d = new Date(cadastro.previsaoChegada);
                                    const pad = (n: number) => n.toString().padStart(2, '0');
                                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                                })() : ""
                            }
                            onChange={handleCadastro}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                )}


                <Box key="header-motorista" sx={{ gridColumn: '1 / -1', mt: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color={grey[500]}>DADOS DO MOTORISTA</Typography>
                </Box>

                <Box key="input-nome" sx={{ gridColumn: { xs: '1 / -1', md: 'span 7' } }}>
                    <TextField
                        fullWidth size="small" name="nomeMotorista" label="Nome do Motorista"
                        placeholder="Nome completo"
                        value={cadastro?.nomeMotorista.toLocaleUpperCase() || ''} onChange={handleCadastro}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: grey[400] }} /></InputAdornment>,
                        }}
                    />
                </Box>

                <Box key="input-cpf" sx={{ gridColumn: { xs: '1 / -1', md: 'span 5' } }}>
                    <TextField
                        fullWidth size="small" name="cpf" label="CPF" placeholder="000.000.000-00"
                        error={!!errors.cpf} helperText={errors.cpf ? "Inválido" : ""}
                        value={cadastro?.cpf || ''} onChange={handleCadastro}
                    />
                </Box>

                <Box key="input-telefone" sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <TextField
                        fullWidth size="small" name="telefone" label="Telefone" placeholder="(XX) 99999-9999"
                        value={cadastro?.telefone || ''} onChange={handleCadastro}
                    />
                </Box>
                <Box key="input-telefone" sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <TextField
                        fullWidth size="small" name="origem" label="Origem" placeholder="CIDADE-SIGLA"
                        value={cadastro?.origem || ''} onChange={handleCadastro}
                    />
                </Box>


                {/* SEÇÃO 2: VEÍCULO */}
                <Box key="header-veiculo" sx={{ gridColumn: '1 / -1', mt: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color={grey[500]}>DADOS DO VEÍCULO</Typography>
                </Box>

                <Box key="input-placa" sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
                    <TextField
                        fullWidth size="small" name="placa" label="Placa" placeholder="ABC-1234"
                        value={cadastro?.placa || ''} onChange={handleCadastro}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LocalShippingIcon fontSize="small" sx={{ color: grey[400] }} /></InputAdornment>,
                        }}
                    />
                </Box>

                <Box key="input-marca" sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
                    <TextField
                        fullWidth size="small" name="marca" label="Marca" placeholder="Ex: Scania"
                        value={cadastro?.marca || ''} onChange={handleCadastro}
                    />
                </Box>

                <Box key="input-modelo" sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
                    <TextField
                        fullWidth size="small" name="modelo" label="Modelo" placeholder="Ex: R450"
                        value={cadastro?.modelo || ''} onChange={handleCadastro}
                    />
                </Box>

                <Box key="input-cor" sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
                    <TextField
                        fullWidth size="small" name="corVeiculo" label="Cor" placeholder="Ex: Branco"
                        value={cadastro?.corVeiculo || ''} onChange={handleCadastro}
                    />
                </Box>

                <Box key="input-peso" sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
                    <TextField
                        fullWidth size="small" name="peso" label="Tara (Kg)" placeholder="0" type="number"
                        value={cadastro?.peso || ''} onChange={handleCadastro}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}
                    />
                </Box>


                {/* SEÇÃO 3: OPERAÇÃO E CARGA */}
                <Box key="header-operacao" sx={{ gridColumn: '1 / -1', mt: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color={grey[500]}>OPERAÇÃO</Typography>
                </Box>

                <Box key="input-ordem" sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
                    <TextField
                        fullWidth size="small" name="ordem" label="Nº Ordem" placeholder="000123" type="number"
                        value={cadastro?.ordem || ''} onChange={handleCadastro}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><DescriptionIcon fontSize="small" sx={{ color: grey[400] }} /></InputAdornment>,
                        }}
                    />
                </Box>

                <Box key="input-produto" sx={{ gridColumn: { xs: '1 / -1', md: 'span 8' } }}>
                    <TextField
                        fullWidth size="small" name="produto" label="Nome do Produto" placeholder="Ex: Soja, Milho..."
                        value={cadastro?.produto || ''} onChange={handleCadastro}
                    />
                </Box>

                <Box key="select-tipo" sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <FormControl fullWidth size="small">
                        <Typography fontSize="0.75rem" fontWeight={600} color={grey[600]} sx={{ mb: 0.5 }}>Tipo de Produto</Typography>
                        <Select
                            name="tipo"
                            value={cadastro?.tipo || ""} onChange={handleCadastro}
                        >
                            <MenuItem key="default" value="" disabled>Selecione...</MenuItem>
                            <MenuItem key="granel" value="GRANEL">GRANEL</MenuItem>
                            <MenuItem key="bags" value="BAGS">BAGS</MenuItem>
                            <MenuItem key="sacaria" value="SACARIA">SACARIA</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/*<Box key="select-status" sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>*/}
                {/*    <FormControl fullWidth size="small">*/}
                {/*        <Typography fontSize="0.75rem" fontWeight={600} color={grey[600]} sx={{ mb: 0.5 }}>*/}
                {/*            Status*/}
                {/*        </Typography>*/}
                {/*        <Select*/}
                {/*            name="status"*/}
                {/*            displayEmpty*/}
                {/*            value={cadastro? || ""}*/}
                {/*            onChange={handleCadastro}*/}
                {/*        >*/}
                {/*            <MenuItem value="" disabled>*/}
                {/*                Selecione...*/}
                {/*            </MenuItem>*/}
                {/*            {status?.map((item) => (*/}
                {/*                <MenuItem key={item.id} value={item.descricao}>*/}
                {/*                    <Box*/}
                {/*                        component="span"*/}
                {/*                        sx={{*/}
                {/*                            width: 8,*/}
                {/*                            height: 8,*/}
                {/*                            borderRadius: '50%',*/}
                {/*                            backgroundColor: item.corHexadecimal,*/}
                {/*                            display: 'inline-block',*/}
                {/*                            mr: 1*/}
                {/*                        }}*/}
                {/*                    />*/}
                {/*                    {item.descricao}*/}
                {/*                </MenuItem>*/}
                {/*            ))}*/}
                {/*        </Select>*/}
                {/*    </FormControl>*/}
                {/*</Box>*/}

                <Box key="select-operacao" sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <FormControl fullWidth size="small">
                        <Typography fontSize="0.75rem" fontWeight={600} color={grey[600]} sx={{ mb: 0.5 }}>Tipo de Operação</Typography>
                        <Select
                            name="operacao" displayEmpty
                            value={cadastro?.operacao || ""} onChange={handleCadastro}
                        >
                            <MenuItem key="default-op" value="" disabled>Selecione...</MenuItem>
                            <MenuItem key="carregamento" value="CARREGAMENTO">CARREGAMENTO</MenuItem>
                            <MenuItem key="descarregamento" value="DESCARREGAMENTO">DESCARREGAMENTO</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

            </Box>

            {/* FOOTER ACTION */}
            <Box sx={{ mt: 'auto', pt: 4 }}>
                <Button
                    variant="contained"
                    onClick={() => submitCadastro(isPreCadastro)}
                    fullWidth
                    size="large"
                    sx={{
                        borderRadius: 2, textTransform: "none", fontWeight: 700,
                        background: isPreCadastro ? orange[700] : green[600],
                        boxShadow: isPreCadastro ? "0 4px 14px rgba(237, 108, 2, 0.4)" : "0 4px 14px rgba(46, 125, 50, 0.4)",
                        "&:hover": { background: isPreCadastro ? orange[800] : green[800] },
                    }}
                >
                    {cadastro?.identificador ? "ATUALIZANDO":"SALVAR"}
                </Button>
            </Box>
        </Box>
    );
};