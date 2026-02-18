import axios from 'axios';

const api = axios.create({ //configuring api service
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json', },
});

export default api;