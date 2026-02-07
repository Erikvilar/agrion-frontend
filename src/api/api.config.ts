export enum AppMode {
  LOCAL = "local",
  DEVELOPMENT = "development",
  PRODUCTION = "prod",
}


const currentMode: AppMode = AppMode.PRODUCTION as AppMode;

interface ApiConfig {
  BASE_URL: string;
  URL: string;
  TIMEOUT_MS: number;
}

const localConfig: ApiConfig = {
  BASE_URL: "http://localhost:8090/v1/agrion/",
  URL: "localhost:8090/v1/agrion",
  TIMEOUT_MS: 10000,
};

const devConfig: ApiConfig = {
  BASE_URL: "http://76.13.236.54:8090/v1/agrion/",
  URL: "76.13.236.54:8090/v1/agrion",
  TIMEOUT_MS: 10000,
};

const prodConfig: ApiConfig = {

  BASE_URL: "https://webdataflux.cloud/v1/agrion/",
  URL: "webdataflux.cloud/v1/agrion",
  TIMEOUT_MS: 8000,
};

const apiConfig: ApiConfig =
    currentMode === AppMode.PRODUCTION
        ? prodConfig
        : currentMode === AppMode.DEVELOPMENT
            ? devConfig
            : localConfig;

export const isLocal = currentMode === AppMode.LOCAL;
export const isDev = currentMode === AppMode.DEVELOPMENT;
export const isProd = currentMode === AppMode.PRODUCTION;

export default apiConfig;