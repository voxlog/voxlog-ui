import axios from 'axios';
// create api that gets the body and the status code from the response
const api = axios.create({
  baseURL: 'http://localhost:8000',
  /*headers: {
    'Content-Type': 'application/json',
  },*/
});

export default api;
