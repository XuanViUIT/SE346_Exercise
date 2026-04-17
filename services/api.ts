import axios from 'axios';

const BASE_URL = 'http://blackntt.net:4321'; 

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});