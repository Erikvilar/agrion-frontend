export default interface CadastroDTO {
    codigoCadastro?:number;
    nomeMotorista: string;
    telefone: number | null;
    cpf: string;
    corVeiculo: string;
    placa: string;
    marca: string;
    modelo: string;
    operacao:string;
    tipoProduto:string;
    produto:string;
    pesoVazio: number;
    pesoCarregado?:number;
    vigia: string;
    numeroOrdem: number;
    status: string;
    dataCriacao?:string | Date;
    
}