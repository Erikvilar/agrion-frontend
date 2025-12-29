import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip,
    Divider,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import Constants from "../../constants/Constants";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNotification } from "../../hooks/useNotification";
import type CadastroDTO from "../../model/CadastroDTO";
import type StatusDTO from '../../model/StatusDTO';
import ApiServices from "../../services/api-service";
import { notificationService } from "../../services/notification-service";
import { enviarNotificacao } from "../../utils/enviarNotificacao";
import { TempoDeEspera } from "../../utils/TempoEspera";

// --- ESTILOS CONSTANTES ---
const STYLES = {
    headerCell: {
        backgroundColor: "#333333",
        color: "#bdbdbd",
        fontWeight: 600,
        fontSize: "0.75rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
        borderBottom: "1px solid #E5E7EB",
        padding: "12px 16px",
    },
    cell: {
        fontSize: "0.875rem",
        color: "#111827",
        fontWeight: 500,
        padding: "8px 16px",
    },
    statusBtn: {
        minWidth: 100,
        color: "#FFF",
        boxShadow: "none",
        textTransform: "none" as const,
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: 700,
        padding: "4px 12px",
        "&:hover": { boxShadow: "0 2px 4px rgba(0,0,0,0.1)", filter: "brightness(0.9)" }
    }
};



// --- HELPER PARA CHIP DE OPERAÇÃO ---
const RenderOperacaoChip = ({ operacao }: { operacao: string }) => {
    if (!operacao) return null;
    const config = {
        CARREGAMENTO: { bg: "#FEF3C7", color: "#D97706" },
        DESCARREGAMENTO: { bg: "#DBEAFE", color: "#2563EB" },
    }[operacao] || { bg: "#F3F4F6", color: "#4B5563" };

    return (
        <Chip 
            label={operacao} 
            size="small" 
            sx={{ 
                backgroundColor: config.bg, 
                color: config.color, 
                fontWeight: 600, 
                height: 24, 
                fontSize: "0.7rem", 
                borderRadius: "4px" 
            }} 
        />
    );
};

// --- LINHA DA TABELA (MEMOIZED) ---
interface TableRowItemProps {
    row: CadastroDTO;
    index: number;
    isMobile: boolean;
    expanded: boolean;
    onToggleExpand: any;
    status:StatusDTO[];
    handleMudarStatus: (row: CadastroDTO) => void;
    handleRowClick: (row: CadastroDTO) => void;
}

const TableRowItem = memo(({
    row,
    index,
    isMobile,
    expanded,
    onToggleExpand,
    status,
    handleMudarStatus,
    handleRowClick
}: TableRowItemProps) => {
    
    // Renderização do botão de Ação
    const ActionButton = () => (
        <Button
            onClick={(e) => {
                e.stopPropagation(); // Impede abrir o formulário ao clicar no botão
                handleMudarStatus(row);
            }}
            variant="contained"
            size="small"
            sx={{
                ...STYLES.statusBtn,
                cursor: "pointer",
                backgroundColor:status.find(s => s.descricao === row.status)?.corHexadecimal,
            }}
        >
            {row.status}
        </Button>
    );

    // Helper para exibir dados com label no Mobile
    const MobileField = ({ label, value }: { label: string, value: any }) => (
        <Box>
            <Typography variant="caption" color="textSecondary" display="block">{label}</Typography>
            <Typography variant="body2" fontWeight={500}>{value || "-"}</Typography>
        </Box>
    );

    // --- RENDERIZAÇÃO MOBILE ---
    if (isMobile) {
        return (
            <TableRow sx={{ "& td": { borderBottom: "none", padding: "10px" } }}>
                <TableCell colSpan={10}>
                    <Accordion
                        expanded={expanded}
                        onChange={onToggleExpand}
                        sx={{
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            borderRadius: "8px !important",
                            "&:before": { display: "none" },
                            overflow: "hidden"
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                            sx={{
                                backgroundColor: Constants[row.status] || "#6B7280",
                                color: "white",
                                minHeight: 56,
                            }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                                    {index + 1}º - {row.nomeMotorista}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    {row.produto}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        
                        {/* Ao clicar nos detalhes, abre o formulário de edição */}
                        <AccordionDetails 
                            onClick={() => handleRowClick(row)}
                            sx={{ backgroundColor: "#FFFFFF", p: 3, cursor: 'pointer' }}
                        >
                            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                                <Box gridColumn="span 2">
                                    <MobileField label="Motorista" value={row.nomeMotorista} />
                                </Box>
                                <MobileField label="Placa" value={row.placa} />
                                <MobileField label="Modelo" value={row.modelo} />
                                
                                <Box gridColumn="span 2"><Divider /></Box>
                                
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Tempo Espera</Typography>
                                    <Box color="#DC2626" fontWeight={600}><TempoDeEspera dataCriacao={row.dataCriacao} /></Box>
                                </Box>
                                
                                <Box display="flex" justifyContent="flex-end" alignItems="center">
                                    <ActionButton />
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </TableCell>
            </TableRow>
        );
    }

    // --- RENDERIZAÇÃO DESKTOP ---
    return (
        <TableRow 
            hover 
            onClick={() => handleRowClick(row)}
            sx={{ 
                "& td": { borderBottom: "1px solid #F3F4F6" }, 
                cursor: 'pointer',
                transition: "background 0.2s" 
            }}
        >
            <TableCell scope="row" sx={{ ...STYLES.cell, maxWidth: 180 }}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" fontWeight={600}>{row.nomeMotorista}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "#EF4444", fontWeight: 600, fontSize: "0.7rem" }}>
                            <TempoDeEspera dataCriacao={row.dataCriacao} />
                        </Typography>
                    </Box>
                </Box>
            </TableCell>

            <TableCell align="center" sx={STYLES.cell}>{row.telefone || "-"}</TableCell>
            <TableCell align="center" sx={STYLES.cell}>{row.placa || "-"}</TableCell>
            <TableCell align="center" sx={STYLES.cell}>{row.cpf || "-"}</TableCell>
            
            <TableCell align="center" sx={STYLES.cell}>
                {row.tipoProduto || "-"}
            </TableCell>

            <TableCell align="center" sx={STYLES.cell}>{row.produto || "-"}</TableCell>
            <TableCell align="center" sx={STYLES.cell}>{row.numeroOrdem || "-"}</TableCell>
            <TableCell align="center" sx={STYLES.cell}>{row.pesoCarregado || "-"}</TableCell>
            <TableCell align="center" sx={STYLES.cell}>{row.pesoVazio || "-"}</TableCell>

            <TableCell align="center" sx={STYLES.cell}>
                <RenderOperacaoChip operacao={row.operacao} />
            </TableCell>

            <TableCell align="center" sx={STYLES.cell}>{row.vigia || "-"}</TableCell>

            <TableCell align="center" sx={{ padding: "8px" }}>
                <ActionButton />
            </TableCell>
        </TableRow>
    );
});

// --- COMPONENTE PRINCIPAL ---

interface TabelaProps {
    rows: CadastroDTO[];
    fetchTodos: () => void;
    handleRowClick: (row: CadastroDTO) => void;
    status:StatusDTO[];
    newRowRef: any;
}

const Tabela = ({ rows, fetchTodos, handleRowClick,status }: TabelaProps) => {
    const isMobile = useIsMobile();
    const [tableRows, setTableRows] = useState<CadastroDTO[]>(rows);
    const { showNotification, NotificationModal } = useNotification();
    const [expanded, setExpanded] = useState<number | false>(false);

    useEffect(() => {
        setTableRows(rows);
    }, [rows]);

    const handleAccordionChange = (panelId: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panelId : false);
    };

    const handleMudarStatus = useCallback(async (row: CadastroDTO) => {
        const { codigoCadastro, status, telefone } = row;
        if (!codigoCadastro) { showNotification("error", "Erro", "Código não encontrado."); return; }

        const isCarregamento = status.includes("OPERACAO");
        let apiCallPromise;

        if (isCarregamento) {
            const userInput = await notificationService.inputText("Informe o peso carregado.", "Peso Carregado");
            if (!userInput.isConfirmed || !userInput.value) return;
            apiCallPromise = ApiServices.atualizarPeso(codigoCadastro, userInput.value);
        } else {
            showNotification("info", "Avançar status?", `Confirme o avanço`, async () => {
                apiCallPromise = ApiServices.mudarStatus(codigoCadastro);
                executeApiCall(apiCallPromise, telefone, status);
            });
            return;
        }
        if (apiCallPromise) executeApiCall(apiCallPromise, telefone, status);
    }, [fetchTodos, showNotification]);

    const executeApiCall = async (promise: any, telefone: any, status: any) => {
        try {
            const { success, message } = await promise;
            if (success && telefone != null) {
                fetchTodos();
                enviarNotificacao(`Olá, status alterado para ${status}.`, telefone.toString());
                showNotification("success", "Sucesso!", "Status atualizado.");
            } else {
                showNotification("error", "Erro", message);
            }
        } catch (error) {
            showNotification("error", "Erro", "Falha de comunicação.");
        }
    };

    return (
        <Paper elevation={0} sx={{ width: "100%", overflow: "hidden", border: "1px solid #E5E7EB", borderRadius: 3, backgroundColor: "#FFFFFF" }}>
            <TableContainer sx={{ maxHeight: { xs: 500, xl: 710 }, "&::-webkit-scrollbar": { width: 8, height: 8 }, "&::-webkit-scrollbar-thumb": { backgroundColor: "#D1D5DB", borderRadius: 4 } }}>
                {NotificationModal}
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {isMobile ? (
                                <TableCell sx={STYLES.headerCell} colSpan={10}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <span>LISTA DE MOTORISTAS</span>
                                        <Chip label={`Total: ${tableRows.length}`} size="small" sx={{ backgroundColor: "#E5E7EB", fontWeight: 700 }} />
                                    </Box>
                                </TableCell>
                            ) : (
                                ["Motorista", "Contato", "Placa", "CPF", "Tipo", "Produto", "Ordem", "Carregado", "Tara", "Operação", "Vigia", "Status"].map((head) => (
                                    <TableCell key={head} align={head === "Motorista" ? "left" : "center"} sx={STYLES.headerCell}>
                                        {head}
                                    </TableCell>
                                ))
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tableRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={20} align="center" sx={{ py: 6, borderBottom: "none" }}>
                                    <Box display="flex" flexDirection="column" alignItems="center" color="#9CA3AF">
                                        <SearchOffIcon sx={{ fontSize: 48, mb: 1, color: "#D1D5DB" }} />
                                        <Typography variant="body1">Nenhum registro encontrado</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tableRows.map((row, index) => (
                                <TableRowItem
                                    status={status}
                                    key={row.codigoCadastro || index}
                                    index={index}
                                    row={row}
                                    isMobile={isMobile}
                                    expanded={expanded === row.codigoCadastro}
                                    onToggleExpand={handleAccordionChange(row.codigoCadastro!)}
                                    handleMudarStatus={handleMudarStatus}
                                    handleRowClick={handleRowClick}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default Tabela;