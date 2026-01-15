//visualização de pre cadastro
export interface ViewTabelaPreCadastroDTO {
    nomeMotorista: string;
    contato: string;
    placa: string;
    cpf: string;
    corVeiculo: string;
    modelo: string;
    marca: string;
    tipo: string;
    produto: string;
    origem: string;
    peso: number;
    ordem: number;
    previsaoChegada: Date
    operacao: string;
    prioridade: boolean;
    confirmacao: boolean;
    dataCriacao:Date;
}
//visualização de dados cadastrados
export interface ViewTabelaDTO {
    nomeMotorista: string;
    contato: string;
    placa: string;
    cpf: string;
    tipo: string;
    produto: string;
    ordem: number;
    pesoInicial: number;
    pesoFinal: number;
    operacao: string;
    status: string;
    dataCriacao:Date;
}