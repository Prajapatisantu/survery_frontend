import axios from 'axios';

// Create an axios instance with a base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
});

export default instance;
