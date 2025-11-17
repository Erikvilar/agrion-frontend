const Constants:{ [key: string]: string } = {
  //cores dos botoes de status
  INATIVO: "#A0A0A0",       // Cinza médio
  RECEBIDO: "#1565C0",      // Azul forte (chegada/entrada)
  AGUARDANDO: "#FFA726",    // Laranja suave (espera)
  CONVOCADO: "#FFD54F",     // Amarelo claro (ação pendente)
  OPERACAO: "#FFD54F",      // Mesma cor de processo, já que inclui carga/descarga
  DESPACHE: "#43A047",      // Verde (saída)
  CONCLUIDO: "#43A047",     // Verde (finalizado


  ATUALIZAR: "#1E88E5",     // Azul vivo
  SALVAR: "#2E7D32",        // Verde escuro



  danger: "#DC3545",       // Vermelho erro
  warning: "#FFC107",      // Amarelo alerta
  info: "#17A2B8",         // Azul claro
  light: "#F8F9FA",        // Cinza claro
  dark: "#343A40",         // Cinza escuro
  background: "#FFFFFF",   // Fundo branco
  text: "#212529",         // Texto principal
  mutedText: "#6C757D",    // Texto secundário
  border: "#DEE2E6",       // Bordas padrão
  shadow: "rgba(0, 0, 0, 0.15)", // Sombra padrão
};

export default Constants;
