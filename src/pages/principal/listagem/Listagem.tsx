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

import {type ColorPalette, ThemeMode} from "@/styles/themeConstants";
import {CadastroRow} from "@/pages/principal/Principal";
import RegistroCadastroDTO from "@/model/dto/registro/RegistroCadastroDTO";
import ApiServices from "@/services/api-service.js";



interface TabelaProps {
    rows: CadastroRow[];
    fetchTodos: () => void;
    handleRowClick: (row: RegistroCadastroDTO) => void;
    status: StatusDTO[];
    newRowRef: any;
    coluna:any;
    currentTheme: ColorPalette;
    mode:ThemeMode;
}

interface TableRowItemProps {
    row: CadastroRow;
    index: number;
    handleMudarStatus: (row: CadastroRow) => void;
    handleRowClick: (row: RegistroCadastroDTO) => void;
    theme: ColorPalette;
    mode:ThemeMode
    statusList: StatusDTO[];
}


const formatarDataHora = (data: Date | string) => {
    if (!data) return "-";
    const d = new Date(data);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};


//REGRA NEGÓCIO - VISUAL
const decidirStatusBotao = (row:CadastroRow, statusList:StatusDTO[]) =>{

    const estaConfirmado = !!(
        ('confirmado' in row ? row.confirmado : false) ||
        ('confirmacao' in row ? (row as any).confirmacao : false)
    );
    const valorStatusRow = 'status' in row ? row.status : (row as any).status;

    const statusEncontrado = statusList?.find(
        (s: StatusDTO) => s.descricao === valorStatusRow || s.id === valorStatusRow
    )

    const statusColor = estaConfirmado
        ? "#2ecc71"
        : (statusEncontrado?.corHexadecimal ?? "#f1c40f");

    const statusLabel = estaConfirmado
        ? "NO PÁTIO"
        : (statusEncontrado?.descricao ?? valorStatusRow ?? "NÃO CONFIRMADO");

    return {statusColor, statusLabel};


}

const TableRowItem = memo(({ row, handleMudarStatus, handleRowClick, statusList,theme,mode }: TableRowItemProps) => {


    const {statusColor, statusLabel} = decidirStatusBotao(row, statusList);

    const pesoExibicao = 'peso' in row ? row.peso : (row as any).peso;

    const origemCarga = row.origem

    const podeMudarStatus = 'status' in row;

    const cellStyle = {
        fontSize: "0.875rem",
        color: theme.table.primary,
        fontWeight: 500,
        padding: "16px",
        borderBottom: `1px solid ${theme.border.divider}`,
    };
    const ActionButton = () => (
        <Button
            onClick={(e) => {
                e.stopPropagation();
                if(podeMudarStatus) {
                    handleMudarStatus(row);
                }


            }}
            variant="contained" size="small"
            sx={{
                minWidth: 90,

                color: mode === 'light' ? "black": statusColor,


                backgroundColor: mode === 'light' ? `${statusColor}` : `${statusColor}15`,

                border: `1px solid ${statusColor}40`,
                textTransform: "none",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "4px 10px",
                boxShadow: "none",
                "&:hover": {
                    backgroundColor: statusColor,
                    color:  'white'
                }
            }}>
            {statusLabel}
        </Button>
    );

const definicaoLinhasTabela = (row:any)=>{
    return (
        <>
            <TableCell sx={cellStyle} align="left">
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" fontWeight={700} color={theme.table.primary}>
                        {row.nomeMotorista ? row.nomeMotorista.toUpperCase() : "-"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "green", fontWeight: 600, fontSize: "0.9rem", mt: 0.5 }}>
                        Origem: <Typography variant="caption" sx={{ color:theme.table.secondary, fontWeight: 600, fontSize: "0.9rem", mt: 0.5 }}>{origemCarga || "Não inf."}</Typography>
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="center"  sx={cellStyle}>{row.telefone || "-"}</TableCell>
    <TableCell align="center"  sx={cellStyle}>{row.placa || "-"}</TableCell>
    <TableCell align="center"  sx={cellStyle}>{row.cpf || "-"}</TableCell>
    <TableCell align="center"  sx={cellStyle}>{row.tipo || "-"}</TableCell>
    <TableCell align="center"  sx={cellStyle}>{row.produto || "-"}</TableCell>
    <TableCell align="center"  sx={cellStyle}>{row.pesoInicial || row.ordem}</TableCell>
            <TableCell align="center" sx={cellStyle}>{pesoExibicao ? pesoExibicao.toLocaleString('pt-BR') : row.pesoFinal} Kg</TableCell>


            <TableCell align="center"  sx={cellStyle}>{formatarDataHora("previsaoChegada" in row ? row.previsaoChegada : 'dataCriacao' in row ? row.dataCriacao : "")}</TableCell>

            <TableCell align="center" sx={cellStyle}>{row.operacao || "-"}</TableCell>
            <TableCell align="right" sx={cellStyle}><ActionButton /></TableCell>
        </>
    )
}
    console.log(row)
    return (
        <TableRow
            hover
            onClick={() => handleRowClick(row as any)}
            sx={{
                cursor: 'pointer', transition: "background 0.1s",
                "&:hover": { backgroundColor: `${theme.table.hover} !important` }
            }}
        >


            {definicaoLinhasTabela(row)}


        </TableRow>
    );
});

const Listagem = ({ rows, fetchTodos, handleRowClick, status, currentTheme,coluna,mode }: TabelaProps) => {
    const [tableRows, setTableRows] = useState<CadastroRow[]>(rows);
    const { NotificationModal, showNotification } = useNotification();

    useEffect(() => { setTableRows(rows); }, [rows]);

    const handleMudarStatus = useCallback(async (row: CadastroRow) => {

        const idVeiculo = row.identificador
    console.log("ID MOVIDO",idVeiculo)
        if (!idVeiculo) {
            showNotification("error", "Erro", "Identificador do veículo não encontrado.");
            return;
        }


        showNotification(
            "info",
            "Mover Veículo",
            `Deseja alterar o status do veículo de ${row.nomeMotorista} (Placa: ${row.placa})?`,
            async () => {


                const response = await ApiServices.mudarStatus(idVeiculo);


                if (response.success) {
                    showNotification("success", "Sucesso", "Status do veículo atualizado com sucesso!");


                    if (fetchTodos) fetchTodos();

                } else {
                    showNotification("error", "Erro ao mover veículo", response.message || "Ocorreu um erro no servidor.");
                }
            }
        );

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
                                    <TableCell key={head} align={head === "Motorista" ? "left":"center"} sx={headerStyle}>
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
                                        mode={mode}
                                        handleMudarStatus={handleMudarStatus}
                                        handleRowClick={handleRowClick}
                                        statusList={status}
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