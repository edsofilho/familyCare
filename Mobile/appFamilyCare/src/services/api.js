import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.10/familyCare/apireact';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar headers se necessário
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, senha) => api.post('/login.php', { email, senha }),
  register: (userData) => api.post('/addUsuario.php', userData),
};

export const idosoAPI = {
  add: (idosoData) => api.post('/addIdoso.php', idosoData),
  getByFamily: (familiaId) => api.post('/getIdosos.php', { familiaId }),
};

export const condicoesAPI = {
  getAll: () => api.get('/getCondicoesMedicas.php'),
};

export const cuidadorAPI = {
  getByFamily: (familiaId) => api.post('/getCuidadores.php', { familiaId }),
  add: (cuidadorData) => api.post('/addCuidador.php', cuidadorData),
  search: (termo, usuarioAtual) => api.post('/buscarUsuarios.php', { termo, usuarioAtual }),
  sendInvite: (familiaId, usuarioId, cuidadorId) => api.post('/enviarSolicitacao.php', { familiaId, usuarioId, cuidadorId }),
  getInvites: (cuidadorId) => api.post('/listarSolicitacoes.php', { cuidadorId }),
  respondInvite: (solicitacaoId, acao) => api.post('/responderSolicitacao.php', { solicitacaoId, acao }),
};

export const familiaAPI = {
  getByUser: (usuarioId) => api.post('/getFamilias.php', { usuarioId }),
  enter: (usuarioId, codigoFamilia) => api.post('/entrarFamilia.php', { usuarioId, codigoFamilia }),
};

export const alertaAPI = {
  add: (alertaData) => api.post('/addAlerta.php', alertaData),
  getByFamily: (familiaId) => api.post('/listarAlertas.php', { familiaId }),
};

export { api };
export default api; 
