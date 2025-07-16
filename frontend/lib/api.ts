import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // your FastAPI server
  withCredentials: true, // if you're using cookies for auth
});

export default api;
