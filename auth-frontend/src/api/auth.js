import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const sendOtp = (data) => API.post("/send-otp", data);
export const verifyOtp = (data) => API.post("/verify-otp", data);
export const signup = (data) => API.post("/signup", data);
export const signin = (data) => API.post("/signin", data);
