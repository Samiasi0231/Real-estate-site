import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:5500/api", 
  withCredentials:true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiRequest;
