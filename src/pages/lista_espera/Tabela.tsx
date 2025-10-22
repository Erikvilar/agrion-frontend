import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { useIsMobile } from "../../hooks/useIsMobile";
import Constants from "../../constants/Constants";
import { notificationService } from "../../services/notification-service";
import { TempoDeEspera } from "../../utils/TempoEspera";
import ApiServices from "../../services/api-service";
import React, { useCallback, useEffect, useState } from "react";
import { enviarNotificacao } from "../../utils/enviarNotificacao";
import type CadastroDTO from "../../model/CadastroDTO";


interface TabelaProps {
  rows: CadastroDTO[];
}



const TableRowMemo = React.memo(({
  row,
  updatedRow,
  onInputChange,
  handleMudarStatus,
  isMobile,
  statusColor,
  widthSizeSx,
  fontSizeSx,
  salvarLinha, // nova prop para salvar linha no onBlur
}: {
  row: CadastroDTO;
  updatedRow: CadastroDTO;
  onInputChange: (codigoCadastro: number, campo: keyof CadastroDTO, valor: string | number) => void;
  handleMudarStatus: (row: CadastroDTO) => void;
  isMobile: boolean;
  statusColor: Record<string, string>;
  widthSizeSx: any;
  fontSizeSx: any;
  salvarLinha: (updatedRow: CadastroDTO) => void; // nova função passada por props
}) => {
  
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
      textShadow: `0 0 1px rgba(0,0,0,0.1),0 0 2px rgba(0,0,0,0.1)`,
    },

    "& .MuiInputBase-root": {
      border: "none",
      outline: "none",
    },
    "& .MuiInput-underline:before, & .MuiInput-underline:after": {
      borderBottom: "none",
    },
  }

  return (
    <TableRow
      key={row.codigoCadastro}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        "&:hover": { backgroundColor: "#acacac27", cursor: "pointer" },
      }}
    >
      <TableCell component="th" scope="row" sx={{ maxWidth: widthSizeSx }}>
        <Box display="flex" flexDirection="column" >

          <TextField
            sx={{ ...disableUnderlineFirstLine}}
            placeholder="Nome do motorista"
            value={row.nomeMotorista}

            onChange={(e) =>
              onInputChange(row.codigoCadastro!, "nomeMotorista", e.target.value)
            }
            onBlur={() => salvarLinha(updatedRow)}
          />

          <Typography variant="caption" color="text.secondary">
            <b>Espera:</b> <TempoDeEspera dataCriacao={row.dataCriacao} />
          </Typography>
        </Box>
      </TableCell>

      {!isMobile && (
        <>
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
            <TextField
              sx={{ ...disableUnderline }}
              variant="standard"

              placeholder="Nome do vigia"
              value={row.vigia ?? ""}
              onChange={(e) =>
                onInputChange(row.codigoCadastro!, "vigia", e.target.value)
              }
              onBlur={() => salvarLinha(updatedRow)}
            />
          </TableCell>
        </>
      )}

      <TableCell align="center">
        <Button
          onClick={() => handleMudarStatus(row)}
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
    </TableRow>
  );
});

const Tabela = ({ rows }) => {
  const isMobile = useIsMobile();

  const [tableRows, setTableRows] = useState<CadastroDTO[]>(rows);
  const [updatedRow, setUpdatedRow] = useState<CadastroDTO>(rows[0]);


  useEffect(() => {
    setTableRows([...rows]);
  }, [rows]);

  const handleMudarStatus = useCallback(async (row: CadastroDTO) => {
    const { codigoCadastro, status, telefone } = row;

    if (!codigoCadastro) {
      notificationService.error("Erro", "Código do cadastro não encontrado.");
      return;
    }

    const isCarregamento = status.includes("CARREGAMENTO");
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
      const userConfirmed = await notificationService.confirmAction(
        "Deseja alterar o status?",
        "O status será alterado para o próximo."
      );
      if (!userConfirmed.isConfirmed) {
        return;
      }
      apiCallPromise = ApiServices.mudarStatus(codigoCadastro);
    }

    try {
      const { data, success, message } = await apiCallPromise;
      if (success) {
        setTableRows(data);

        enviarNotificacao(
          `Atenção! \n Olá usuario o status foi alterado para ${status} fique atento as chamadas.`,
          telefone.toString()
        );

        notificationService.success("Sucesso!", "O status foi atualizado.");
      } else {
        notificationService.error("Permissão negada", message || "Não foi possível atualizar o status.");
      }
    } catch (error) {
      console.error("Falha ao tentar mudar status:", error);
      notificationService.error("Erro inesperado", "Ocorreu um problema de comunicação com o servidor.");
    }
  }, []);

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
  let blurBlocked = false;
  const salvarLinha = async (updatedRow: CadastroDTO) => {
    if (blurBlocked) return;
    blurBlocked = true
    console.log("capturada tentativa de salvar")
    setTimeout(async () => {
      blurBlocked = false
      console.log("salvando...")
      await ApiServices.cadastrar(updatedRow);
    }, 5000);

  }

  const statusColor: Record<string, string> = {
    INATIVO: Constants.INATIVO,
    RECEBIDO: Constants.RECEBIDO,
    AGUARDANDO: Constants.AGUARDANDO,
    CARREGAMENTO: Constants.CARREGAMENTO,
    DESPACHE: Constants.DESPACHE,
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
    xl: 120,
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
          xs: 600,
          sm: 500,
          md: 600,
          lg: 340,
          xl: 700,
        },
        maxHeight: { xl: 710 },
        overflowY: "auto",
      }}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead style={{ backgroundColor: "#363636f" }}>
          <TableRow >
            <TableCell sx={{ maxWidth: widthSizeSx, ...tableHeadStyle }}>
              MOTORISTA
            </TableCell>
            {!isMobile && (
              <>
                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  PLACA
                </TableCell>
                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  CPF
                </TableCell>
                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  Nº ORDEM
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  PESO CARREGADO
                </TableCell>

                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  PESO VAZIO
                </TableCell>
                <TableCell align="center" sx={{ ...tableHeadStyle }}>
                  VIGIA
                </TableCell>
              </>
            )}
            <TableCell align="center" sx={{ ...tableHeadStyle }}>
              STATUS
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tableRows.map((row) => (
            <TableRowMemo
              key={row.codigoCadastro}
              row={row}
              salvarLinha={salvarLinha}
              onInputChange={onInputChange}
              handleMudarStatus={handleMudarStatus}
              isMobile={isMobile}
              statusColor={statusColor}
              widthSizeSx={widthSizeSx}
              fontSizeSx={fontSizeSx}
              updatedRow={updatedRow}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tabela;
