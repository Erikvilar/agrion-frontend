export default interface RegistroCadastroDTO {
    identificador: number;
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
    peso: number | string;
    ordem: number | string;
    previsaoChegada: Date | string | undefined;
    operacao: string;
    confirmado: boolean;
    prioridade: boolean;
}