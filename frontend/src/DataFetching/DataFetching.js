import axios from "axios";
import config from "../Config/config.js";

const causeBankApi = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

// Set default headers
ForumApi.defaults.headers.common["x-client-type"] = "web"; // or 'mobile', depending on the context

// example usage
export const getCauses = async () => causeBankApi.get("/api/v1/causes");

export default causeBankApi;
