import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface TempoDeEsperaProps {
  dataCriacao?: string | Date;
}

export const TempoDeEspera = ({ dataCriacao }: TempoDeEsperaProps) => {
  const calcularTempoFormatado = () => {
    if (!dataCriacao) return '';
    try {
      const data = new Date(dataCriacao);
      return formatDistanceToNow(data, {
        locale: ptBR,
        addSuffix: false,
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return 'inválido';
    }
  };

  const [tempoExibido, setTempoExibido] = useState(calcularTempoFormatado);

  useEffect(() => {
    if (!dataCriacao) return;

    const intervalId = setInterval(() => {
      setTempoExibido(calcularTempoFormatado());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [dataCriacao]);

  if (!dataCriacao) return null;

  return <div>{tempoExibido}</div>;
};
