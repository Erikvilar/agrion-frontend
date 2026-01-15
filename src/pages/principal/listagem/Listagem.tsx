import SearchOffIcon from "@mui/icons-material/SearchOff";
import {
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
import  { memo, useCallback, useEffect, useState } from "react";
import { useNotification } from "@/hooks/useNotification";
import type StatusDTO from '../../../model/dto/StatusDTO.ts';

import { type ColorPalette } from "@/styles/themeConstants";
import {CadastroRow} from "@/pages/principal/Principal";
import RegistroCadastroDTO from "@/model/dto/registro/RegistroCadastroDTO";



interface TabelaProps {
    rows: CadastroRow[];
    fetchTodos: () => void;
    handleRowClick: (row: RegistroCadastroDTO) => void;
    status: StatusDTO[];
    newRowRef: any;
    coluna:any;
    currentTheme: ColorPalette;
}

interface TableRowItemProps {
    row: CadastroRow;
    index: number;
    status: StatusDTO[];
    handleMudarStatus: (row: CadastroRow) => void;
    handleRowClick: (row: RegistroCadastroDTO) => void;
    theme: ColorPalette;
}


const formatarDataHora = (data: Date | string) => {
    if (!data) return "-";
    const d = new Date(data);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const TableRowItem = memo(({ row, handleMudarStatus, handleRowClick, theme }: TableRowItemProps) => {
    const estaConfirmado = 'confirmado' in row ? row.confirmado : (row as any).confirmacao;

    const statusColor = estaConfirmado ? "#2ecc71" : "#f1c40f";

    const statusLabel = estaConfirmado ? "NO PÁTIO" : "NÃO CONFIRMADO";

    // const idUnico = 'identificador' in row ? row.identificador : (row as any).codigoCadastro;
    //
    // const numeroOrdem = 'ordem' in row ? row.ordem : (row as any).numeroOrdem;


    const pesoExibicao = 'peso' in row ? row.peso : (row as any).peso;


    // const dataReferencia = 'previsaoChegada' in row ? row.previsaoChegada : (row as any).dataCriacao;
    //
    // const tipoCarga = 'tipo' in row ? row.tipo : (row as any).tipoProduto;

    const origemCarga = 'origem' in row ? row.origem : "Interna/Própria";


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
                backgroundColor: `${statusColor}15`,
                border: `1px solid ${statusColor}40`,
                textTransform: "none",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "4px 10px",
                boxShadow: "none",
                "&:hover": {
                    backgroundColor: statusColor,
                    color: "#FFFFFF"
                }
            }}>
            {statusLabel}
        </Button>
    );

    return (
        <TableRow
            hover
            onClick={() => handleRowClick(row as any)}
            sx={{
                cursor: 'pointer', transition: "background 0.1s",
                "&:hover": { backgroundColor: `${theme.table.hover} !important` }
            }}
        >
            <TableCell sx={cellStyle}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" fontWeight={700} color={theme.table.primary}>
                        {row.nomeMotorista ? row.nomeMotorista.toUpperCase() : "-"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "yellow", fontWeight: 600, fontSize: "0.9rem", mt: 0.5 }}>
                        Origem: <Typography variant="caption" sx={{ color: "white", fontWeight: 600, fontSize: "0.9rem", mt: 0.5 }}>{origemCarga || "Não inf."}</Typography>
                    </Typography>
                </Box>
            </TableCell>

            <TableCell sx={cellStyle}>{row.contato || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.placa || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.cpf || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.tipo || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.produto || "-"}</TableCell>
            <TableCell sx={cellStyle}>{row.ordem ? row.ordem : "0"}</TableCell>

            {/* Peso Formatado */}
            <TableCell sx={cellStyle}>
                {pesoExibicao ? pesoExibicao.toLocaleString('pt-BR') : "0"} Kg
            </TableCell>

            {/* Previsão de Chegada Formatada */}
            <TableCell sx={cellStyle}>
                {formatarDataHora("previsaoChegada" in row ? row.previsaoChegada : "")}
            </TableCell>

            <TableCell align="center" sx={cellStyle}>{row.operacao || "-"}</TableCell>
            <TableCell align="right" sx={cellStyle}><ActionButton /></TableCell>
        </TableRow>
    );
});

const Listagem = ({ rows, fetchTodos, handleRowClick, status, currentTheme,coluna }: TabelaProps) => {
    const [tableRows, setTableRows] = useState<CadastroRow[]>(rows);
    const { NotificationModal, showNotification } = useNotification();

    useEffect(() => { setTableRows(rows); }, [rows]);

    const handleMudarStatus = useCallback(async (row: CadastroRow) => {

        const identificador = row.cpf;

        if (!identificador) {
            showNotification("error", "Erro", "Identificador (CPF) não encontrado.");
            return;
        }


        showNotification("info", "Confirmar Pré-Cadastro?", `Deseja confirmar a chegada de ${row.nomeMotorista}?`, async () => {

            console.log("Ação disparada para:", identificador);
        });

    }, [fetchTodos, showNotification]);



    const headerStyle = {
        backgroundColor: currentTheme.table.paper,
        color: currentTheme.table.secondary,
        fontWeight: "700",
        borderBottom: `1px solid ${currentTheme.border.divider}`,
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
                backgroundColor: currentTheme.table.main,
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
                                {coluna.map((head:any) => (
                                    <TableCell key={head} align={head === "Status" ? "right" : "left"} sx={headerStyle}>
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={coluna.length} align="center" sx={{ py: 6, borderBottom: "none" }}>
                                        <Box display="flex" flexDirection="column" alignItems="center" color={currentTheme.text.disabled}>
                                            <SearchOffIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                                            <Typography variant="body1">Nenhum registro encontrado</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tableRows.map((row, index) => (
                                    <TableRowItem

                                        key={`${row.cpf}-${index}`}
                                        index={index}
                                        row={row}
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

export default Listagem;