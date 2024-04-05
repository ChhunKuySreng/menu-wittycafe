import App from "../../package.json";

export const APP_NAME = App.name;
export const IS_APP_PRODUCTION = process.env.REACT_APP_PRODUCTION === "true";
export const APP_VERSION = App.version;
export const API_URL = process.env.REACT_APP_API_URL;

export const API_FLEET_URL = process.env.REACT_APP_FLEET_URL;
export const CHAPTCHA_QA_CLIENT_KEY = process.env.REACT_APP_CHAPTCHA_QA_CLIENT_KEY;
export const CHAPTCHA_PRODUCTiON_CLIENT_KEY = process.env.REACT_APP_CHAPTCHA_PRODUCTION_CLIENT_KEY;
export const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
