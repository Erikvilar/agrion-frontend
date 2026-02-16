import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import {
    Box, Button, Divider, FormControl, IconButton, MenuItem,
    Select, TextField, Typography, Tabs, Tab, Switch, InputAdornment
} from "@mui/material";
import { green, grey, orange, red } from "@mui/material/colors";
import { useState, useRef } from "react";

import type StatusDTO from '../../model/dto/StatusDTO.ts';
import RegistroCadastroDTO from "@/model/dto/registro/RegistroCadastroDTO";

interface CadastroVeiculoFormProps {
    cadastro: RegistroCadastroDTO | null;
    handleCadastro: (e: any) => void;
    status: StatusDTO[];
    submitCadastro: (isPreCadastro: boolean) => void;
    clearForm: () => void;
    modoOperacao:boolean;

}

const inputStyle = { bgcolor: "transparent", color: "white" };

export const CadastroForm = ({
                                 cadastro,
                                 handleCadastro,
                                 submitCadastro,
                                 clearForm,
                                 modoOperacao,


                             }: CadastroVeiculoFormProps) => {

    const [tabValue, setTabValue] = useState(0);
    const [submitErrors, setSubmitErrors] = useState<Record<string, boolean>>({});
    const [isPreCadastro] = useState(modoOperacao);
    console.log(cadastro?.ordem);
    const fieldRefs = useRef<Record<string, any>>({});

    const registerRef = (name: string) => (el: any) => {
        if (el) fieldRefs.current[name] = el;
    };

    const validateField = (name: string) => !!submitErrors[name];

    const isFieldValid = (name: string) => {
        const value = (cadastro as any)?.[name];
        return !!value && value.toString().trim() !== "";
    };

    const hasErrorTabMotorista = validateField("nomeMotorista") || validateField("cpf") || validateField("placa") || validateField("origem");
    const hasErrorTabCarga = validateField("produto") || validateField("operacao") || validateField("tipo");

    const onSave = () => {
        const requiredFields = ["nomeMotorista", "cpf", "placa", "produto", "operacao", "tipo", "origem"];
        const newErrors: Record<string, boolean> = {};
        let firstErrorField: string | null = null;

        requiredFields.forEach(field => {
            if (!isFieldValid(field)) {
                newErrors[field] = true;
                if (!firstErrorField) firstErrorField = field;
            }
        });

        setSubmitErrors(newErrors);

        if (!firstErrorField) {
            submitCadastro(isPreCadastro);
        } else {
            const tabWithError = ["nomeMotorista", "cpf", "placa", "origem"].includes(firstErrorField) ? 0 : 1;
            setTabValue(tabWithError);

            setTimeout(() => {
                const element = fieldRefs.current[firstErrorField!];
                if (element) {
                    const input = element.querySelector('input') || element.querySelector('[role="button"]');
                    input?.focus();
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 150);
        }
    };
    const formatToLocalDateTime = (dateString: string) => {
        const date = new Date(dateString);

        const pad = (n: number) => String(n).padStart(2, "0");

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };
    return (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight={700} color={grey[800]}>
                    {isPreCadastro ? "Agendamento" : "Cadastro comum"}
                </Typography>
                <IconButton onClick={() => { setSubmitErrors({}); clearForm(); }} size="small">
                    <DeleteSweepIcon />
                </IconButton>
            </Box>

            <Divider />

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 1 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="fullWidth">
                    <Tab
                        icon={hasErrorTabMotorista ? <ErrorOutlineIcon sx={{ color: red[700] }} /> : <PersonIcon fontSize="small" />}
                        iconPosition="start"
                        label="Motorista & Veículo"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            minHeight: 48,
                            color: hasErrorTabMotorista ? `${red[700]} !important` : 'inherit'
                        }}
                    />
                    <Tab
                        icon={hasErrorTabCarga ? <ErrorOutlineIcon sx={{ color: red[700] }} /> : <LocalShippingIcon fontSize="small" />}
                        iconPosition="start"
                        label="Carga & Operação"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            minHeight: 48,
                            color: hasErrorTabCarga ? `${red[700]} !important` : 'inherit'
                        }}
                    />
                </Tabs>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {/* TAB 0: MOTORISTA E VEICULO */}
                <Box hidden={tabValue !== 0} sx={{ pt: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                        <Box sx={{ gridColumn: 'span 12' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                ref={registerRef("nomeMotorista")}
                                fullWidth size="small" name="nomeMotorista" placeholder="Nome do Motorista"
                                error={validateField("nomeMotorista")}
                                color={isFieldValid("nomeMotorista") ? "success" : "primary"}
                                value={cadastro?.nomeMotorista?.toLocaleUpperCase() || ''} onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 6' }}>
                            <TextField
                                sx={{border:"1px solid black"}}

                                ref={registerRef("cpf")}
                                fullWidth size="small" name="cpf" placeholder="CPF"
                                error={validateField("cpf")}
                                color={isFieldValid("cpf") ? "success" : "primary"}
                                value={cadastro?.cpf || ''} onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 6' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                fullWidth size="small" name="telefone" placeholder="Telefone"
                                value={cadastro?.telefone  } onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 4' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                ref={registerRef("placa")}
                                fullWidth size="small" name="placa" placeholder="Placa"
                                error={validateField("placa")}
                                color={isFieldValid("placa") ? "success" : "primary"}
                                value={cadastro?.placa || ''} onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 4' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                fullWidth size="small" name="marca" placeholder="Marca"
                                value={cadastro?.marca || ''} onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 4' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                fullWidth size="small" name="modelo" placeholder="Modelo"
                                value={cadastro?.modelo || ''} onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 4' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                fullWidth size="small" name="corVeiculo" placeholder="Cor"
                                value={cadastro?.corVeiculo || ''} onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 4' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                fullWidth size="small" name="peso" placeholder="Tara (Kg)" type="number"
                                value={cadastro?.peso || ''} onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 12' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                ref={registerRef("origem")}
                                fullWidth size="small" name="origem" placeholder="Origem (Cidade-UF)"
                                error={validateField("origem")}
                                color={isFieldValid("origem") ? "success" : "primary"}
                                value={cadastro?.origem || ''} onChange={handleCadastro}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* TAB 1: CARGA E OPERACAO */}
                <Box hidden={tabValue !== 1} sx={{ pt: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                        {isPreCadastro && (
                            <Box sx={{ gridColumn: '1 / -1', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold", color: cadastro?.confirmado ? grey[500] : orange[800] }}>
                                            {cadastro?.confirmado ? "Chegada confirmada em" : "Previsão de chegada"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold", color: cadastro?.prioridade ? "red" : grey[600] }}>Prioridade</Typography>
                                        <Switch
                                            size="small"
                                            color="error"
                                            checked={!!cadastro?.prioridade}
                                            onChange={(e) => handleCadastro({ target: { name: "prioridade", value: e.target.checked } } as any)}
                                        />
                                    </Box>
                                </Box>
                                <TextField

                                    fullWidth size="small" type="datetime-local" name="previsaoChegada"
                                    disabled={cadastro?.confirmado}
                                    sx={{
                                        ...inputStyle,
                                        border:"1px solid black",
                                        "& .Mui-disabled": { bgcolor: grey[100], color: grey[600], cursor: "not-allowed", WebkitTextFillColor: grey[600] },
                                        "& input::-webkit-calendar-picker-indicator": {
                                            filter: cadastro?.confirmado ? "grayscale(100%) opacity(30%)" : "invert(40%) sepia(90%) saturate(1500%) hue-rotate(10deg) brightness(90%) contrast(100%)",
                                            cursor: cadastro?.confirmado ? "default" : "pointer"
                                        }
                                    }}
                                    value={
                                        cadastro?.previsaoChegada
                                            ? formatToLocalDateTime(cadastro.previsaoChegada.toString())
                                            : ""
                                    }
                                    onChange={handleCadastro}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        )}

                        <Box sx={{ gridColumn: 'span 4' }}>
                            <TextField
                                sx={{border:"1px solid black"}}

                                fullWidth size="small" name="ordem" placeholder="Nº ordem" type="number"
                                value={cadastro?.ordem || ''} onChange={handleCadastro}
                                InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon fontSize="small" /></InputAdornment> }}
                            />
                        </Box>

                        <Box sx={{ gridColumn: 'span 8' }}>
                            <TextField
                                sx={{border:"1px solid black"}}
                                ref={registerRef("produto")}
                                fullWidth size="small" name="produto" placeholder="Nome do Produto"
                                error={validateField("produto")}
                                color={isFieldValid("produto") ? "success" : "primary"}
                                value={cadastro?.produto || ''} onChange={handleCadastro}
                            />
                        </Box>
                        <Box sx={{ gridColumn: 'span 6' }}>
                            <FormControl fullWidth size="small" error={validateField("tipo")} ref={registerRef("tipo")} >
                                <Typography fontSize="0.75rem" fontWeight={600} color={isFieldValid("tipo") ? green[700] : grey[600]} sx={{ mb: 0.5 }}>Tipo de Produto</Typography>
                                <Select name="tipo" value={cadastro?.tipo || ""} onChange={handleCadastro} sx={{ color: isFieldValid("tipo") ? green[700] : 'inherit',border:"1px solid black" }}>
                                    <MenuItem value="GRANEL">GRANEL</MenuItem>
                                    <MenuItem value="BAGS">BAGS</MenuItem>
                                    <MenuItem value="SACARIA">SACARIA</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ gridColumn: 'span 6' }}>
                            <FormControl fullWidth size="small" error={validateField("operacao")} ref={registerRef("operacao")}>
                                <Typography fontSize="0.75rem" fontWeight={600} color={isFieldValid("operacao") ? green[700] : grey[600]} sx={{ mb: 0.5 }}>Tipo de Operação</Typography>
                                <Select name="operacao" value={cadastro?.operacao || ""} onChange={handleCadastro} sx={{ color: isFieldValid("operacao") ? green[700] : 'inherit',border:"1px solid black" }}>
                                    <MenuItem value="CARREGAMENTO">CARREGAMENTO</MenuItem>
                                    <MenuItem value="DESCARREGAMENTO">DESCARREGAMENTO</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: 'auto', pt: 4 }}>
                <Button
                    variant="contained"
                    onClick={onSave}
                    fullWidth
                    size="large"
                    sx={{
                        borderRadius: 2, fontWeight: 700, textTransform: "none",
                        background: isPreCadastro ? orange[700] : green[600],
                        "&:hover": { background: isPreCadastro ? orange[800] : green[800] },
                    }}
                >
                    {cadastro?.identificador ? "ATUALIZANDO" : "SALVAR"}
                </Button>
            </Box>
        </Box>
    );
};