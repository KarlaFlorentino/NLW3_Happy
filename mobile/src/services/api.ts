import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/3333', 
    
});

export default api;

//Dispositivo físico: baseURL: 'http://(ip na rede):3333,
//Emulador do ios: baseURL: 'http://localhost/3333',
/*Emulador do android: 
    1) Terminal: adb reverse tcp:3333 tcp:3333
    2) baseURL: 'http://localhost/3333,
*/