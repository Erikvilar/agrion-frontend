import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface TempoDeEsperaProps {
  dataCriacao?: string | Date | undefined
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

  const getTimeColor = (dataString: TempoDeEsperaProps): string => {
    if (!dataString) return 'grey';

    const dataEntrada = new Date(dataString.dataCriacao || "");
    const agora = new Date();


    const diffEmHoras = Math.abs(agora.getTime() - dataEntrada.getTime()) / 36e5;


    if (diffEmHoras <= 2) {
      return '#16a34a';
    }
    else if (diffEmHoras <= 9) {
      return '#ca8a04';
    }
    else if (diffEmHoras <= 48) {
      return '#f97316';
    }
    else {
      return '#dc2626';
    }
  };
  // @ts-ignore
  const corTexto = getTimeColor(dataCriacao);
  return <div>
    Há: <span style={{ color: corTexto, fontWeight: "bold" }}>
            {tempoExibido}
        </span>
  </div>
};
