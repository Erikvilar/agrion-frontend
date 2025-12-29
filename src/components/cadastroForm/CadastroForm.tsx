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
    Typography
} from "@mui/material";
import { green, grey, orange, red } from "@mui/material/colors";
import React, { useState } from "react";
import type CadastroDTO from "../../model/CadastroDTO";
import type StatusDTO from '../../model/StatusDTO';

interface Errors {
    cpf?: boolean;
    pesoVazio?: boolean;
    previsao?: boolean;
    placa?: boolean;
}

interface CadastroVeiculoFormProps {
    cadastro: CadastroDTO | null;
    handleCadastro: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: Errors;
    status: StatusDTO[];
    submitCadastro: (isPreCadastro: boolean) => void;
    clearForm: () => void;
}

// Otimização: Estilo constante movido para fora para evitar recriação a cada render
const inputStyle = { bgcolor: "#fff" };

export const CadastroForm = ({
    cadastro,
    handleCadastro,
    errors,
    submitCadastro,
    clearForm,
    status
}: CadastroVeiculoFormProps) => {

    const [isPreCadastro, setIsPreCadastro] = useState(false);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPreCadastro(event.target.checked);
    };

    return (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>

            {/* --- CABEÇALHO --- */}
            <Box sx={{ mb: 1 }}>
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

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
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
                        label={<Typography variant="caption" color="text.secondary">Modo Pré-cadastro (Veículo não chegou)</Typography>}
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

                {/* CONDICIONAL: DATA DE PREVISÃO */}
                {isPreCadastro && (
                    <Box key="box-previsao" sx={{ gridColumn: '1 / -1' }}>
                        <Box sx={{ p: 2, border: `1px dashed ${orange[400]}`, borderRadius: 2, bgcolor: orange[50] }}>
                            <Typography fontSize="0.8rem" fontWeight="bold" color={orange[800]} sx={{ mb: 1 }}>
                                Previsão de Chegada
                            </Typography>
                            <TextField
                                fullWidth size="small" type="datetime-local" name="previsaoChegada"
                                onChange={handleCadastro} InputLabelProps={{ shrink: true }} sx={inputStyle}
                            />
                        </Box>
                    </Box>
                )}

                {/* SEÇÃO 1: MOTORISTA */}
                <Box key="header-motorista" sx={{ gridColumn: '1 / -1', mt: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color={grey[500]}>DADOS DO MOTORISTA</Typography>
                </Box>

                <Box key="input-nome" sx={{ gridColumn: { xs: '1 / -1', md: 'span 7' } }}>
                    <TextField
                        fullWidth size="small" name="nomeMotorista" label="Nome do Motorista"
                        placeholder="Nome completo"
                        value={cadastro?.nomeMotorista || ''} onChange={handleCadastro}
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
                        fullWidth size="small" name="telefone" label="Whatsapp / Telefone" placeholder="(XX) 99999-9999"
                        value={cadastro?.telefone || ''} onChange={handleCadastro}
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
                        fullWidth size="small" name="pesoVazio" label="Tara (Kg)" placeholder="0" type="number"
                        value={cadastro?.pesoVazio || ''} onChange={handleCadastro}
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
                        fullWidth size="small" name="numeroOrdem" label="Nº Ordem" placeholder="000123" type="number"
                        value={cadastro?.numeroOrdem || ''} onChange={handleCadastro}
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
                            name="tipoProduto" displayEmpty
                            value={cadastro?.tipoProduto || ""} onChange={handleCadastro}
                        >
                            {/* ADICIONADO KEY EXPLICITA PARA EVITAR ERRO DE CHAVE DUPLICADA "2" */}
                            <MenuItem key="default" value="" disabled>Selecione...</MenuItem>
                            <MenuItem key="granel" value="GRANEL">GRANEL</MenuItem>
                            <MenuItem key="bags" value="BAGS">BAGS</MenuItem>
                            <MenuItem key="sacaria" value="SACARIA">SACARIA</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            <Box key="select-status" sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
    <FormControl fullWidth size="small">
        <Typography fontSize="0.75rem" fontWeight={600} color={grey[600]} sx={{ mb: 0.5 }}>
            Status
        </Typography>
        <Select
            name="status"
            displayEmpty
            // O valor do Select é o estado atual do formulário
            value={cadastro?.status || ""} 
            onChange={handleCadastro}
        >
            <MenuItem value="" disabled>
                Selecione...
            </MenuItem>
            
            {/* Uso de status?.map para evitar erro se a lista ainda for undefined.
               Ajuste nos values e no texto de exibição.
            */}
            {status?.map((item) => (
                <MenuItem key={item.id} value={item.descricao}>
                    {/* (Opcional) Bolinha com a cor do status */}
                    <Box 
                        component="span" 
                        sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: item.corHexadecimal, 
                            display: 'inline-block', 
                            mr: 1 
                        }} 
                    />
                    {item.descricao}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
</Box>
                <Box key="select-operacao" sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <FormControl fullWidth size="small">
                        <Typography fontSize="0.75rem" fontWeight={600} color={grey[600]} sx={{ mb: 0.5 }}>Tipo de Operação</Typography>
                        <Select
                            name="operacao" displayEmpty
                            value={cadastro?.operacao || ""} onChange={handleCadastro}
                        >
                            {/* ADICIONADO KEY EXPLICITA PARA EVITAR ERRO DE CHAVE DUPLICADA "2" */}
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
                    {isPreCadastro ? "Salvar agendamento" : "Cadastrar"}
                </Button>
            </Box>
        </Box>
    );
};