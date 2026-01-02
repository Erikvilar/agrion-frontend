import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNotification } from "../../hooks/useNotification";
import type CadastroDTO from "../../model/CadastroDTO";
import type StatusDTO from '../../model/StatusDTO';
import { TempoDeEspera } from "../../utils/TempoEspera";
import { type ColorPalette } from "../../styles/themeConstans";
import ApiServices from "../../services/api-service";
import { notificationService } from "../../services/notification-service";
import { enviarNotificacao } from "../../utils/enviarNotificacao";

interface TabelaProps {
    rows: CadastroDTO[];
    fetchTodos: () => void;
    handleRowClick: (row: CadastroDTO) => void;
    status: StatusDTO[];
    newRowRef: any;
    currentTheme: ColorPalette;
}

interface TableRowItemProps {
    row: CadastroDTO;
    index: number;
    isMobile: boolean;
    expanded: boolean;
    onToggleExpand: any;
    status: StatusDTO[];
    handleMudarStatus: (row: CadastroDTO) => void;
    handleRowClick: (row: CadastroDTO) => void;
    theme: ColorPalette;
}

const TableRowItem = memo(({ row, isMobile, expanded, onToggleExpand, handleMudarStatus, handleRowClick, status, theme }: TableRowItemProps) => {

    const statusEncontrado = status.find(s => s.descricao === row.status);
    const statusColor = statusEncontrado?.corHexadecimal || theme.border.focus;

    // Estilo da Célula ajustado para usar theme.table.primary (Texto Branco)
    // e theme.border.divider (Linha sutil no fundo escuro)
    const cellStyle = {
        fontSize: "0.875rem",
        color: theme.table.primary,
        fontWeight: 500,
        padding: "16px",
        borderBottom: `1px solid ${theme.border.divider}`,
    };

    const ActionButton = () => (
        <Button
            onClick={(e) => { e.stopPropagation(); handleMudarStatus(row); }}
            variant="contained" size="small"
            sx={{
                minWidth: 90,
                color: statusColor,
                backgroundColor: `${statusColor}15`, // Fundo translúcido do botão
                border: `1px solid ${statusColor}40`,
                textTransform: "none",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "4px 10px",
                boxShadow: "none",
                "&:hover": {
                    backgroundColor: statusColor,
                    color: "#FFFFFF" // Texto branco no hover do botão
                }
            }}>
            {row.status}
        </Button>
    );

    if (isMobile) {
        return (
            <TableRow sx={{ "& td": { borderBottom: "none", padding: "10px" } }}>
                <TableCell colSpan={10} sx={{ padding: "0 !important" }}>
                    <Accordion
                        expanded={expanded} onChange={onToggleExpand}
                        sx={{
                            // No mobile, usamos o fundo table.paper para destacar o card
                            backgroundColor: theme.table.paper,
                            color: theme.table.primary,
                            marginBottom: 1,
                            border: `1px solid ${theme.border.main}`,
                            borderRadius: "8px !important",
                            "&:before": { display: "none" },
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.table.secondary }} />}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{row.nomeMotorista}</Typography>
                                <Typography variant="caption" sx={{ color: theme.text.highlight, fontWeight: 600, mt: 0.5 }}>
                                    Há: <TempoDeEspera dataCriacao={row.dataCriacao} />
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box display="flex" justifyContent="flex-end"><ActionButton /></Box>
                        </AccordionDetails>
                    </Accordion>
                </TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow
            hover
            onClick={() => handleRowClick(row)}
            sx={{
                cursor: 'pointer', transition: "background 0.1s",
                // Hover usando a cor definida na table.hover
                "&:hover": { backgroundColor: `${theme.table.hover} !important` }
            }}
        >
            <TableCell sx={cellStyle}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" fontWeight={700} color={theme.table.primary}>
                        {row.nomeMotorista.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.text.highlight, fontWeight: 600, fontSize: "0.7rem", mt: 0.5 }}>
                        Há: <TempoDeEspera dataCriacao={row.dataCriacao} />
                    </Typography>
                </Box>
            </TableCell>

            <TableCell sx={cellStyle}>{row.telefone || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.placa || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.cpf || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.tipoProduto || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.produto || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.numeroOrdem || "0"}</TableCell>
            <TableCell sx={cellStyle}>{row.pesoCarregado || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.pesoVazio || "0"}</TableCell>
            <TableCell align="center" sx={cellStyle}>{row.operacao}</TableCell>
            <TableCell align="right" sx={cellStyle}><ActionButton /></TableCell>
        </TableRow>
    );
});

const Tabela = ({ rows, fetchTodos, handleRowClick, status, currentTheme }: TabelaProps) => {
    const isMobile = useIsMobile();
    const [tableRows, setTableRows] = useState<CadastroDTO[]>(rows);
    const { NotificationModal, showNotification } = useNotification();
    const [expanded, setExpanded] = useState<number | false>(false);

    useEffect(() => { setTableRows(rows); }, [rows]);

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
                await executeApiCall(apiCallPromise, telefone, status);
            });
            return;
        }
        if (apiCallPromise) await executeApiCall(apiCallPromise, telefone, status);
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

    // Estilo do Cabeçalho:
    // Background: theme.table.paper (Escuro)
    // Color: theme.table.primary (Branco ou Cinza Claro)
    const headerStyle = {
        backgroundColor: currentTheme.table.paper,
        color: currentTheme.table.secondary, // ou table.primary se quiser branco puro
        fontWeight: "700",
        borderBottom: `1px solid ${currentTheme.border.divider}`, // Usa divisor sutil
        whiteSpace: "nowrap" as const,
        fontSize: "0.75rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
        padding: "16px"
    };

    return (
        <>
            {NotificationModal}
            <Paper elevation={0} sx={{
                width: "100%",
                height: "100%",
                backgroundColor: currentTheme.table.main, // Fundo escuro
                border: "none",
                borderRadius: 0,
                display: "flex",
                flexDirection: "column"
            }}>
                <TableContainer sx={{
                    flex: 1, height: "100%", overflowY: "auto",
                    "&::-webkit-scrollbar": { width: 8, height: 8 },
                    "&::-webkit-scrollbar-track": { backgroundColor: currentTheme.scroll.track },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: currentTheme.scroll.thumb, borderRadius: 4 }
                }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {["Motorista", "Contato", "Placa", "CPF", "Tipo", "Produto", "Nº Ordem", "Carregado", "Tara", "Operação", "Status"].map((head) => (
                                    <TableCell key={head} align={head === "Status" ? "right" : "left"} sx={headerStyle}>
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={12} align="center" sx={{ py: 6, borderBottom: "none" }}>
                                        <Box display="flex" flexDirection="column" alignItems="center" color={currentTheme.text.disabled}>
                                            <SearchOffIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                                            <Typography variant="body1">Nenhum registro encontrado</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tableRows.map((row, index) => (
                                    <TableRowItem
                                        key={row.codigoCadastro || index}
                                        index={index} row={row} isMobile={isMobile}
                                        expanded={expanded === row.codigoCadastro}
                                        onToggleExpand={handleAccordionChange(row.codigoCadastro!)}
                                        handleMudarStatus={handleMudarStatus}
                                        handleRowClick={handleRowClick}
                                        status={status}
                                        theme={currentTheme}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default Tabela;