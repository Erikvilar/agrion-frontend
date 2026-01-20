
export enum AppMode {
  LOCAL = "local",
  DEVELOPMENT = "development",
  PRODUCTION = "prod",
}


const currentMode: AppMode = AppMode.LOCAL as AppMode;

interface ApiConfig {
  BASE_URL: string;
  URL: string;
  TIMEOUT_MS: number;
}

const localConfig: ApiConfig = {
  BASE_URL: "http://192.168.100.105:8081/v1/agrion/",
  URL: "192.168.100.105:8081/v1/agrion",
  TIMEOUT_MS: 10000,
};

const devConfig: ApiConfig = {
  BASE_URL: "http://141.148.158.42:25568/v1/agrion/",
  URL: "141.148.158.42:25568/v1/agrion/",
  TIMEOUT_MS: 10000,
};

const prodConfig: ApiConfig = {
  BASE_URL: "https://back.stackpanel.com.br/v1/agrion/",
  URL: "back.stackpanel.com.br/v1/agrion/",
  TIMEOUT_MS: 8000,
};

const apiConfig: ApiConfig = currentMode === AppMode.PRODUCTION ? prodConfig : currentMode === AppMode.DEVELOPMENT ? devConfig : localConfig;

export const isLocal = currentMode === AppMode.LOCAL;
export const isDev = currentMode === AppMode.DEVELOPMENT;
export const isProd = currentMode === AppMode.PRODUCTION;


export default apiConfig;