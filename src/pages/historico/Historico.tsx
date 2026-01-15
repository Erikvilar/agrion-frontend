import  { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ApiServices from "../../services/api-service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LoadingIndicator, { type LoadingIndicatorRef } from "../../components/loading-indicator/Component";

// Tipo do DTO
interface HistoricoGeralDTO {
  id: number;
  descricao: string;
  acaoRealizada: string;
  dataCriacao: string;
  dataAtualizacao: string;
  veiculoId: number;
  veiculoNome: string;
  usuarioId: string;
  usuarioNome: string;
}

const Historico: React.FC = () => {
  const [historicos, setHistoricos] = useState<HistoricoGeralDTO[]>([]);
      const loaderRef = useRef<LoadingIndicatorRef>(null);
    const handleHistorico = async()=>{
            loaderRef.current?.start()
            const {data,success}= await ApiServices.historico();
            if(success){
                setHistoricos(data)
                       loaderRef.current?.done()
            }
              loaderRef.current?.done()
    }
  useEffect(() => {
    handleHistorico()
  }, []);

  return (

    <div style={{overflow:"hidden"}}>
              <LoadingIndicator ref={loaderRef} />
<TableContainer
  component={Paper}
  sx={{
    height: "calc(100vh - 80px)", 
    overflowY: "auto",          
    marginTop: "80px",            
  }}
>
    
  <Table stickyHeader>
    <TableHead>
      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell>Data Criação</TableCell>
        <TableCell>Descrição</TableCell>
        <TableCell>Ação</TableCell>
        <TableCell>Data Atualização</TableCell>
        <TableCell>Veículo ID</TableCell>
        <TableCell>Nome motorista</TableCell>
        <TableCell>Usuário ID</TableCell>
        <TableCell>Usuário Nome</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {historicos.map((hist) => (
        <TableRow key={hist.id}>
       <TableCell>
            {format(new Date(hist.dataCriacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </TableCell>
          <TableCell>{hist.descricao}</TableCell>
          <TableCell>{hist.acaoRealizada}</TableCell>
          <TableCell>
            {format(new Date(hist.dataAtualizacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </TableCell>

          <TableCell>{hist.veiculoId}</TableCell>
          <TableCell>{hist.veiculoNome}</TableCell>
          <TableCell>{hist.usuarioId}</TableCell>
          <TableCell>{hist.usuarioNome}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
</div>
  );
};

export default Historico;
