import axios from "axios";

console.log("API base URL:", import.meta.env.VITE_API_BASE_URL); // Debug log

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  withCredentials: true,
});


// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });
export default API;
