//visualização de pre cadastro
export interface ViewTabelaPreCadastroDTO {
    identificador:number;
    nomeMotorista: string;
    telefone: string;
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
    identificador: number;
    nomeMotorista: string;
    telefone: string;
    placa: string;
    marca: string;
    modelo: string;
    cor: string;
    cpf: string;
    tipo: string;
    produto: string;
    origem: string;
    ordem: number;
    pesoInicial: number;
    pesoFinal: number;
    operacao: string;
    status: string;
    dataCriacao: Date;
}