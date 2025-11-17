import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, FormControl, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { useIsMobile } from "../../hooks/useIsMobile";
import Constants from "../../constants/Constants";
import { notificationService } from "../../services/notification-service";
import { TempoDeEspera } from "../../utils/TempoEspera";
import ApiServices from "../../services/api-service";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { enviarNotificacao } from "../../utils/enviarNotificacao";
import type CadastroDTO from "../../model/CadastroDTO";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useNotification } from "../../hooks/useNotification";


interface TabelaProps {
  rows: CadastroDTO[];
  fetchTodos: () => void;
  isCadastrando: Boolean
  newRowRef: any
}


const TableRowMemo = forwardRef<HTMLTableRowElement, {
  row: CadastroDTO;
  index: number;
  updatedRow: CadastroDTO;
  onInputChange: (codigoCadastro: number, campo: keyof CadastroDTO, valor: string | number) => void;
  handleMudarStatus: (row: CadastroDTO) => void;
  isMobile: boolean;
  statusColor: Record<string, string>;
  widthSizeSx: any;
  fontSizeSx: any;
  salvarLinha: (updatedRow: CadastroDTO) => void;
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  salvarCadastro: (updatedRow: CadastroDTO) => void;
}>(
  (
    {
      row,
      index,
      updatedRow,
      onInputChange,
      handleMudarStatus,
      isMobile,
      statusColor,
      widthSizeSx,
      fontSizeSx,
      salvarLinha,
      expanded,
      onChange,
      salvarCadastro,
    },
    ref
  ) => {

    const disableUnderline = {

      "& .MuiInputBase-root": {
        border: "none",
        outline: "none",
      },
      "& .MuiInput-underline:before, & .MuiInput-underline:after": {
        borderBottom: "none",
      },
      "& input": {
        fontSize: 13,
        textAlign: "center",
        textShadow: `0 0 1px rgba(0,0,0,0.1),0 0 2px rgba(0,0,0,0.1)`,
      }

    }

    const disableUnderlineFirstLine = {
      "& input": {
        fontSize: 13,
        textAlign: "left",

      },
    }
    const operacao = row.operacao;

    const dataCriacaoFormatada = row.dataCriacao ? format(new Date(row.dataCriacao), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-";
    return (
      <TableRow
        key={row.codigoCadastro}
        ref={ref}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            cursor: "pointer"
          }
        }}

      >
        {isMobile ? (
          <Accordion
            expanded={expanded}
            onChange={onChange}
            sx={{
              mb: 1.5,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              "&:before": { display: "none" },
            }}
          >

            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{
                backgroundColor: Constants[row.status] || "#888",
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  color="white"
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  {index + 1}º - {row.nomeMotorista}
                </Typography>
                <Typography color="white" sx={{ fontSize: 12, opacity: 0.9 }}>
                  {row.marca} • {row.modelo}
                </Typography>
              </Box>
            </AccordionSummary>


            <AccordionDetails
              sx={{
                backgroundColor: "#fafafa",
                px: 2,
                py: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="body2">
                    <strong>Motorista:</strong> {row.nomeMotorista}
                  </Typography>
                </Box>


                <Typography variant="body2">
                  <strong>Placa:</strong> {row.placa || "-"}
                </Typography>
                <Typography variant="body2">
                  <strong>Código:</strong> {row.codigoCadastro ?? "-"}
                </Typography>
              </Box>

              {/* Linha 2: Marca + Modelo */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2">
                  <strong>Marca:</strong> {row.marca || "-"}
                </Typography>
                <Typography variant="body2">
                  <strong>Modelo:</strong> {row.modelo || "-"}
                </Typography>
              </Box>

              {/* Linha 3: Motorista + Data */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >

                <Typography variant="body2">
                  <strong>Data:</strong> {dataCriacaoFormatada}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Tempo de espera e status */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  <b>Espera:</b> <TempoDeEspera dataCriacao={row.dataCriacao} />
                </Typography>

                <TableCell align="center" sx={{ borderBottom: "none", p: 0 }}>
                  <Button
                    onClick={() => handleMudarStatus(row)}
                    sx={{
                      minWidth: widthSizeSx,
                      backgroundColor: statusColor[row.status] || "#ccc",
                      textTransform: "none",
                      px: 2,
                      py: 0.8,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: statusColor[row.status] || "#aaa",
                      },
                    }}
                    variant="contained"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      fontSize={fontSizeSx}
                      color="white"
                    >
                      {row.status}
                    </Typography>
                  </Button>
                </TableCell>
              </Box>
            </AccordionDetails>
          </Accordion>
        ) : (<></>)}



        {!isMobile && (
          <>
            <TableCell component="th" scope="row" sx={{ maxWidth: widthSizeSx }}>
              <Box display="flex" flexDirection="column" >

                <TextField
                  sx={{ ...disableUnderlineFirstLine }}
                  placeholder="Nome do motorista"
                  variant="standard"
                  value={row.nomeMotorista}

                  onChange={(e) =>
                    onInputChange(row.codigoCadastro!, "nomeMotorista", e.target.value)
                  }
                  onBlur={() => salvarLinha(updatedRow)}

                />

                <Typography variant="caption" color="text.secondary"><Box sx={{ display: "flex", width: "80%" }}>
                  <b style={{ paddingRight: 5 }}></b><TempoDeEspera dataCriacao={row.dataCriacao} />
                </Box>

                </Typography>
              </Box>
            </TableCell>


            <TableCell align="center">

              <TextField
                sx={{ ...disableUnderline }}
                variant="standard"
                placeholder="Telefone"
                value={row.telefone}
                onChange={(e) =>
                  onInputChange(row.codigoCadastro!, "telefone", e.target.value)
                }
                onBlur={() => salvarLinha(updatedRow)}
              />
            </TableCell>
            <TableCell align="center">

              <TextField
                sx={{ ...disableUnderline }}
                variant="standard"
                placeholder="Placa do veículo"
                value={row.placa}
                onChange={(e) =>
                  onInputChange(row.codigoCadastro!, "placa", e.target.value)
                }
                onBlur={() => salvarLinha(updatedRow)}

              />
            </TableCell>
            <TableCell align="center">

              <TextField

                sx={{ ...disableUnderline }}
                variant="standard"
                placeholder="CPF"
                value={row.cpf}
                onChange={(e) =>
                  onInputChange(row.codigoCadastro!, "cpf", e.target.value)
                }
                onBlur={() => salvarLinha(updatedRow)}
              />
            </TableCell>

     <TableCell align="center">
  <FormControl variant="standard" sx={{ minWidth: 120 }}>
    <Select
      value={row.tipoProduto || ""} 
      onChange={(e) =>
        onInputChange(row.codigoCadastro!, "tipoProduto", e.target.value)
      }
      onBlur={() => salvarLinha(updatedRow)}

    >
      <MenuItem value="">
        <em>{row.tipoProduto}</em>
      </MenuItem>

      <MenuItem value="GRANEL">GRANEL</MenuItem>
      <MenuItem value="BAGS">BAGS</MenuItem>
      <MenuItem value="SACARIA">SACARIA</MenuItem>
    </Select>
  </FormControl>
</TableCell>

            <TableCell align="center">

              <TextField
                sx={{ ...disableUnderline }}
                variant="standard"
                placeholder="Produto"
                value={row.produto}
                onChange={(e) =>
                  onInputChange(row.codigoCadastro!, "produto", e.target.value)
                }
                onBlur={() => salvarLinha(updatedRow)}
              />

            </TableCell>

            <TableCell align="center">
              <TextField
                sx={{ ...disableUnderline }}
                variant="standard"
                placeholder="Nº Ordem"
                type="number"
                value={row.numeroOrdem}
                onChange={(e) =>
                  onInputChange(row.codigoCadastro!, "numeroOrdem", Number(e.target.value))
                }
                onBlur={() => salvarLinha(updatedRow)}
              />
            </TableCell>

            <TableCell align="center">
              <TextField
                sx={{ ...disableUnderline }}
                variant="standard"
                placeholder="Peso Carregado"
                type="number"
                value={row.pesoCarregado ?? ""}
                onChange={(e) =>
                  onInputChange(row.codigoCadastro!, "pesoCarregado", Number(e.target.value))
                }
                onBlur={() => salvarLinha(updatedRow)}
              />
            </TableCell>

            <TableCell align="center">
              <TextField
                sx={{ ...disableUnderline }}
                variant="standard"
                placeholder="Peso Vazio"
                type="number"
                value={row.pesoVazio ?? ""}
                onChange={(e) =>
                  onInputChange(row.codigoCadastro!, "pesoVazio", Number(e.target.value))
                }
                onBlur={() => salvarLinha(updatedRow)}
              />
            </TableCell>


<TableCell align="center">
  <FormControl variant="standard" sx={{ minWidth: 120 }}>
    <Select
      value={row.operacao || ""}
      onChange={(e) =>
        onInputChange(row.codigoCadastro!, "operacao", e.target.value)
      }
      onBlur={() => salvarLinha(updatedRow)}
      displayEmpty
      renderValue={(selected) => {
        if (!selected) {
          return <em>Selecione</em>;
        }

        return (
          <Chip
            label={selected}
            variant="outlined"
            sx={{
              backgroundColor: selected ? "#FFF3CD" : "#E3F2FD",
              borderColor: selected ? "#FFB300" : "#1565C0",
              color: selected ? "#B26A00" : "#0D47A1",
              fontWeight: 600,
              height: 26
            }}
          />
        );
      }}
      sx={{
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          paddingY: 0.5,
        },
      }}
    >
      <MenuItem value="">
        <em>Selecione</em>
      </MenuItem>
      <MenuItem value="CARREGAMENTO">CARREGAMENTO</MenuItem>
      <MenuItem value="DESCARREGAMENTO">DESCARREGAMENTO</MenuItem>
    </Select>
  </FormControl>
</TableCell>

            <TableCell align="center">
              <TextField
                sx={{ ...disableUnderline }}
                variant="standard"
                disabled
                placeholder="Nome do vigia"
                value={row.vigia ?? ""}
                onChange={(e) =>
                  onInputChange(row.codigoCadastro!, "vigia", e.target.value)
                }
                onBlur={() => salvarLinha(updatedRow)}
              />
            </TableCell>
            <TableCell align="center">
              <Button
                onClick={() => row.status == "SALVAR" ? salvarCadastro(updatedRow) : handleMudarStatus(row)}
                sx={{
                  maxWidth: widthSizeSx,
                  backgroundColor: statusColor[row.status] || "#ccc",
                }}

                variant="contained"
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  fontSize={fontSizeSx}
                  color="white"
                >
                  {row.status}
                </Typography>
              </Button>
            </TableCell>
          </>
        )}


      </TableRow>
    );
  });

const Tabela = ({ rows, fetchTodos, isCadastrando, newRowRef }: TabelaProps) => {


  const isMobile = useIsMobile();
  const [tableRows, setTableRows] = useState<CadastroDTO[]>(rows);
  const [updatedRow, setUpdatedRow] = useState<CadastroDTO>(rows[0]);



  const { showNotification, NotificationModal } = useNotification();

  useEffect(() => {
    setTableRows([...rows]);
  }, [rows]);

  const [expanded, setExpanded] = useState<number | false>(false);
  const handleAccordionChange = (panelId: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panelId : false);
  };

  console.log(tableRows)

  const handleMudarStatus = useCallback(
    async (row: CadastroDTO) => {
      const { codigoCadastro, status, telefone } = row;

      if (!codigoCadastro) {
        showNotification("error", "Erro", "Código do cadastro não encontrado.");
        return;
      }

      const isCarregamento = status.includes("OPERACAO");
      let apiCallPromise;

      if (isCarregamento) {
        const userInput = await notificationService.inputText(
          "Para seguir para a próxima etapa é necessário informar o peso carregado.",
          "Peso Carregado"
        );
        if (!userInput.isConfirmed || !userInput.value) {
          return;
        }
        apiCallPromise = ApiServices.atualizarPeso(codigoCadastro, userInput.value);
      } else {

        showNotification("info", "Avançar para o próximo status?", `O status sera alterado de ${status} para o próximo`, async () => {

          apiCallPromise = ApiServices.mudarStatus(codigoCadastro);

          try {
            const { data, success, message } = await apiCallPromise;
            if (success && telefone != null) {
              setTableRows(data);

              enviarNotificacao(
                `Atenção! \n Olá usuário, o status foi alterado para ${status}, fique atento às chamadas.`,
                telefone.toString()
              );

              showNotification("success", "Sucesso!", "O status foi atualizado.");
            } else {
              showNotification("error", "Permissão negada", message);
            }
          } catch (error) {
            console.error("Falha ao tentar mudar status:", error);
            showNotification("error", "Erro inesperado", "Problema de comunicação com o servidor.");
          }
        });

        // Para não continuar o fluxo antes da confirmação
        return;
      }

      // Se for carregamento, a API já foi chamada acima
      if (apiCallPromise) {
        try {
          const { data, success, message } = await apiCallPromise;
          if (success && telefone != null) {
            setTableRows(data);

            enviarNotificacao(
              `Atenção! \n Olá usuário, o status foi alterado para ${status}, fique atento às chamadas.`,
              telefone.toString()
            );

            showNotification("success", "Sucesso!", "O status foi atualizado.");
          } else {
            showNotification("error", "Permissão negada", message);
          }
        } catch (error) {
          console.error("Falha ao tentar mudar status:", error);
          showNotification("error", "Erro inesperado", "Problema de comunicação com o servidor.");
        }
      }
    },
    []
  );

  const onInputChange = useCallback(
    (codigoCadastro: number, campo: keyof CadastroDTO, valor: string | number) => {
      setTableRows((prevRows) => {

        const index = prevRows.findIndex((row) => row.codigoCadastro === codigoCadastro);

        if (index === -1) return prevRows;
        const updated = ({ ...prevRows[index], [campo]: valor })
        const newRows = [...prevRows];
        newRows[index] = updated;
        setUpdatedRow(updated)
        return newRows;
      });
    },
    []
  );

  const salvarLinha = async (updatedRow: CadastroDTO) => {
    if (updatedRow.codigoCadastro) await ApiServices.cadastrar(updatedRow);
    console.log(updatedRow)
    fetchTodos();

  }

  const salvarCadastro = async (updatedRow: CadastroDTO) => {
    await ApiServices.cadastrar(updatedRow);
    fetchTodos();

  }

  const statusColor: Record<string, string> = {
    INATIVO: Constants.INATIVO,
    RECEBIDO: Constants.RECEBIDO,
    AGUARDANDO: Constants.AGUARDANDO,
    OPERACAO: Constants.OPERACAO,
    CONVOCADO: Constants.CONVOCADO,
    DESPACHE: Constants.DESPACHE,
    CONCLUIDO: Constants.CONCLUIDO,
    ATUALIZAR: Constants.ATUALIZAR,
    SALVAR: Constants.SALVAR,
  };

  const fontSizeSx = {
    xs: 9,
    sm: 14,
    md: 14,
    lg: 14,
    xl: 13,
  };

  const widthSizeSx = {
    xs: 100,
    sm: 120,
    md: 120,
    lg: 120,
    xl: 180,
  };

  const tableHeadStyle = {
    fontWeight: 700,
    paddingLeft: 3,
    fontSize: fontSizeSx,
    color: "white",
    fontSizeSx, backgroundColor: "#363636ff"
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        height: {
          xs: 500,
          sm: 500,
          md: 600,
          lg: 340,
          xl: 700,
        },

        maxHeight: { xl: 710 },
        scrollBehavior: "smooth",
      }}
    >
      {NotificationModal}
      <Table stickyHeader aria-label="sticky table">
        <TableHead style={{ backgroundColor: "#363636f" }}>
          <TableRow >
            {isMobile && (
              <TableCell sx={{ maxWidth: widthSizeSx, ...tableHeadStyle }}>
                <div style={{ color: "white", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>  <span style={{ color: "white" }}>LISTA DE MOTORISTAS</span>
                  <span style={{ color: "white" }}>Total {rows.length}</span>
                </div>

              </TableCell>
            )}
            {!isMobile && (
              <>

                <TableCell sx={{ maxWidth: widthSizeSx, ...tableHeadStyle }}>
                  MOTORISTA
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  CONTATO
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  PLACA
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  CPF
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  TIPO PRODUTO
                </TableCell>
                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  PRODUTO
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  Nº ORDEM
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  PESO CARREGADO
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  TARA
                </TableCell>
                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  OPERAÇÃO
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  VIGIA
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  STATUS
                </TableCell>
              </>
            )}

          </TableRow>
        </TableHead>

        <TableBody>

          {tableRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={20} align="center">
                <Box
                  sx={{
                    py: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: 0.7
                  }}
                >
                  <SearchOffIcon sx={{ fontSize: 40, mb: 1 }} />
                  Nenhum registro encontrado
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            tableRows.map((row, index) => (
              <TableRowMemo
                key={row.codigoCadastro}
                row={row}
                ref={index === 0 ? newRowRef : null}
                index={index}
                salvarLinha={salvarLinha}
                onInputChange={onInputChange}
                handleMudarStatus={handleMudarStatus}
                isMobile={isMobile}
                statusColor={statusColor}
                widthSizeSx={widthSizeSx}
                fontSizeSx={fontSizeSx}
                expanded={expanded === row.codigoCadastro}
                onChange={handleAccordionChange(row.codigoCadastro!)}
                updatedRow={updatedRow}
                salvarCadastro={salvarCadastro}
              />
            ))
          )}

        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tabela;
