import axios from "axios";
import url from './url';

const api = axios.create({
    baseURL: url
});

// Funções de autenticação
export const authAPI = {
    login: async (email, senha) => {
        return await api.post('/login.php', { email, senha });
    },
    loginIdoso: async (email, senha) => {
        return await api.post('/loginIdoso.php', { email, senha });
    },
    register: async (userData) => {
        return await api.post('/addUsuario.php', userData);
    }
};

export default api;