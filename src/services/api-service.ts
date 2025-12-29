import type UserDTO from "../model/UserDTO";
import interceptor from "../api/interceptor";
import type CadastroDTO from "../model/CadastroDTO";




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
  async cadastrar(cadastro: CadastroDTO) {
    try {
      const response = await interceptor.post("cadastro", cadastro);
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
  async buscarTodos() {
    try {
      const response = await interceptor.get("cadastro");
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
      const response = await interceptor.get("cadastro/BuscarTodosStatus");
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
  }

}
export default ApiServices;