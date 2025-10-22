

const env: string = "locaL";

interface ApiConfig {
  BASE_URL: string;
  TIMEOUT_MS: number;

}

const localConfig: ApiConfig = {
  BASE_URL: "http://192.168.100.105:8081/v1/agrion/",
  TIMEOUT_MS: 10000,
};

const devConfig: ApiConfig = {
  BASE_URL: "http://141.148.158.42:25568/v1/agrion/",
  TIMEOUT_MS: 10000,
};

const prodConfig: ApiConfig = {
  BASE_URL: "https://api.seusite.com/api",
  TIMEOUT_MS: 8000,
};



const config: ApiConfig =
  env === "production"
    ? prodConfig
    : env === "development"
    ? devConfig
    : localConfig;

export default config;