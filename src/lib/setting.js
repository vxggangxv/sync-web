export const ENV_MODE_DEV = process.env.NODE_ENV === 'development';
export const ENV_MODE_PROD = process.env.NODE_ENV === 'production';

// const apiConfig = window.globalConfig;

// const BASE_API_URL = process.env.REACT_APP_API_URL;
export const BASE_API_URL = ENV_MODE_PROD
  ? process.env.REACT_APP_BASE_API_URL
  : process.env.REACT_APP_BASE_API_LOCAL_URL;

export const BASE_BIN_URL = ENV_MODE_PROD
  ? `${process.env.REACT_APP_BASE_BIN_URL}/bin/v1`
  : `${process.env.REACT_APP_BASE_BIN_LOCAL_URL}/bin/v1`;

export const BASE_SOCKET_PRIVATE_URL = ENV_MODE_PROD
  ? `${process.env.REACT_APP_BASE_SOCKET_URL}/private`
  : `${process.env.REACT_APP_BASE_SOCKET_LOCAL_URL}/private`;

export const BASE_SOCKET_PROJECT_URL = ENV_MODE_PROD
  ? `${process.env.REACT_APP_BASE_SOCKET_URL}/project`
  : `${process.env.REACT_APP_BASE_SOCKET_LOCAL_URL}/project`;
