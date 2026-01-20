import  UserDTO from "@/model/dto/UserDTO";
import interceptor from "../api/interceptor";
import {ConfirmarEntradaDTO} from "@/model/dto/registro/ResponsesDTO";
import RegistroCadastroDTO from "@/model/dto/registro/RegistroCadastroDTO";


const ApiServices = {

  async login(user: UserDTO) {
    try {
      
      const response = await interceptor.post("auth/login", { ...user });
      return {
        success: true,
        status: response.status,
        data: response.data,

      };

    } catch (error: any) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message,
          data: error.response.data || null,
        };
      }

      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  },
  async logout (user:UserDTO){
   const response = await interceptor.post("auth/logout", { ...user });
      try {
      return {
        success: true,
        status: response.status,
        data: response.data,

      } 
    }catch (error: any) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message,
          data: error.response.data || null,
        };
      }

      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  
  },
  async cadastrar(cadastro: RegistroCadastroDTO) {
    try {
      const response = await interceptor.post("preCadastro/cadastrar", cadastro);
      return response.data;
    } catch (error: any) {

      const apiErrorEvent = new CustomEvent('APP_API_ERROR', {
        detail: {
          title: error.error || "Erro de Cadastro",
          message: error.message || "Falha ao processar requisição"
        }
      });
      window.dispatchEvent(apiErrorEvent);
      throw error;
    }
  },
  async buscarPorDescricao(descricao: string) {
    try {
      const response = await interceptor.get(`cadastro/busca?descricao=` + descricao);
      console.log(response.data)
      return {
        success: true,
        status: response.status,
        data: response.data,

      };
    } catch (error: any) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message || "Erro desconhecido",
          data: error.response.data || null,
        };
      }

      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  },


  async buscarTodosPreCadastro() {
    try {
      const response = await interceptor.get("preCadastro/visualizar");
      return {
        success: true,
        status: response.status,
        data: response.data,

      };
    } catch (error: any) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message || "Erro desconhecido",
          data: error.response.data || null,
        };
      }

      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  },
  async buscarPorStatus(codigo:number) {
    try {
      const response = await interceptor.get(`cadastro/buscarPorStatus?status=${codigo}`);
      console.log(codigo)
      return {
        success: true,
        status: response.status,
        data: response.data,

      };
    } catch (error: any) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message || "Erro desconhecido",
          data: error.response.data || null,
        };
      }

      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  },
  async mudarStatus(id:number){
    try {
      const response = await interceptor.post("cadastro/mudarStatus",{id});
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message || "Erro desconhecido",
          data: error.response.data || null,
        };
      }
      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  },
  async atualizarPeso(id:number | undefined, pesoCarregado:number){
    try {
      const response = await interceptor.post("cadastro/atualizarPeso",{id,pesoCarregado});
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message,
          data: error.response.data || null,
        };
      }
      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  },
  async historico(){
    try {
      const response = await interceptor.get("cadastro/historico");
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message,
          data: error.response.data || null,
        };
      }
      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  },
async buscarTodosStatus(){
  try {
      const response = await interceptor.get("status");
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message,
          data: error.response.data || null,
        };
      }
      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }






  },

async confirmarEntrada(confirmarEntrada:ConfirmarEntradaDTO){
  try {
      const response = await interceptor.post("preCadastro/confirmarEntrada",confirmarEntrada);
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error:any) {

      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message,
          data: error.response.data || null,
        };
      }
      return {
        success: false,
        status: 0,
        message: error.message || "Erro de conexão com o servidor",
        data: null,
      };
    }
  },

async notifyUser(username: string, message: string) {
    const token = localStorage.getItem("token");

    try {

      const response = await interceptor.post(
          `/api/notificar/usuario?username=${encodeURIComponent(username)}`,
          message,
          {
            headers: {
              'Content-Type': 'text/plain',
              'Authorization': `Bearer ${token}`
            }
          }
      );

      return { isSuccess: true, data: response.data };
    } catch (error: any) {
      console.error("Erro ao enviar notificação:", error);
      return { isSuccess: false, message: error.response?.data || "Erro ao notificar" };
    }
  },

async notifyGroup(role: string, message: string) {
    const token = localStorage.getItem("token");

    try {
      const response = await interceptor.post(
          `/api/notificar/grupo`,
          {
            role: role,
            message: message,
            timestamp: new Date().toISOString()
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
      );

      return { isSuccess: true, data: response.data };
    } catch (error: any) {
      console.error("Erro ao enviar notificação:", error);
      return { isSuccess: false, message: error.response?.data || "Erro ao notificar" };
    }
  }
}
export default ApiServices;