import axios from 'axios';

const myAxios = axios.create({
    baseURL: process.env.REACT_APP_API_END_POINT
});

myAxios.defaults.headers.common['X-API-Key'] = process.env.REACT_APP_API_KEY;

export default myAxios;