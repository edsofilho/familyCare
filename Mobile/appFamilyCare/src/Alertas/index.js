import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from '../context/UserContext';
import api from '../../services/api';

export default function Alertas({ navigation, route }) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const userType = route?.params?.userType || 'cuidador';
  const { currentFamily, user } = useUser();

  useEffect(() => {
    listarAlertas();
  }, []);

  async function listarAlertas() {
    try {
      if (!currentFamily || !currentFamily.id) {
        Alert.alert('Erro', 'Família não encontrada');
        return;
      }
      setLoading(true);
      const idosoSelecionado = route?.params?.idoso;
      const requestData = { 
        familiaId: currentFamily.id 
      };
      if (idosoSelecionado && idosoSelecionado.id) {
        requestData.idosoId = idosoSelecionado.id;
      }
      
      console.log('Enviando requisição para listar alertas:', requestData);
      
      const res = await api.post('/listarAlertas.php', requestData);
      console.log('Resposta da API:', res.data);
      
      if (res.data.status === 'sucesso' && res.data.alertas) {
        setAlertas(res.data.alertas);
      } else {
        console.log('Nenhum alerta encontrado ou erro na resposta');
        setAlertas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      console.error('Detalhes do erro:', error.response?.data);
      
      // Tentar buscar alertas de forma alternativa
      try {
        console.log('Tentando busca alternativa...');
        const res = await api.post('/getAlertasTempoReal.php', { familiaId: currentFamily.id });
        if (res.data.status === 'sucesso' && res.data.alertas) {
          setAlertas(res.data.alertas);
        } else {
          setAlertas([]);
        }
      } catch (altError) {
        console.error('Erro na busca alternativa:', altError);
        Alert.alert('Erro', 'Erro ao conectar com o servidor. Verifique sua conexão.');
        setAlertas([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleHome = () => {
    if (userType === 'idoso') {
      navigation.replace('HomeIdoso');
    } else {
      navigation.replace('HomeCuidador');
    }
  };

  const formatarData = (dataString) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleString('pt-BR');
    } catch (error) {
      return dataString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return '#D35400';
      case 'respondido':
        return '#27AE60';
      case 'resolvido':
        return '#7F8C8D';
      default:
        return '#2E86C1';
    }
  };

  const marcarComoResolvido = async (alertaId) => {
    try {
      const res = await api.post('/responderAlerta.php', {
        alertaId: alertaId,
        cuidadorId: user?.id,
        acao: 'resolvido',
        observacao: 'Marcado como resolvido pelo cuidador'
      });
      
      if (res.data.status === 'sucesso') {
        Alert.alert('Sucesso', 'Alerta marcado como resolvido');
        // Recarregar a lista de alertas
        listarAlertas();
      } else {
        Alert.alert('Erro', 'Erro ao marcar alerta como resolvido');
      }
    } catch (error) {
      console.error('Erro ao marcar como resolvido:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    }
  };

  const atenderAlerta = async (alerta) => {
    try {
      const res = await api.post('/responderAlerta.php', {
        alertaId: alerta.id,
        cuidadorId: user?.id,
        acao: 'respondido',
        observacao: null,
      });
      
      if (res.data.status === 'sucesso') {
        // Criar mensagem pré-escrita baseada no alerta
        const mensagemPreEscrita = `Oi ${alerta?.nomeIdoso || 'querido(a)'}! Atendi o seu alerta. O que aconteceu? Está tudo bem?`;
        
        // Navegar para a tela do Chat com mensagem pré-escrita
        navigation.replace('Chat', {
          mensagemPreEscrita: mensagemPreEscrita
        });
      } else {
        Alert.alert('Erro', 'Erro ao atender alerta');
      }
    } catch (error) {
      console.error('Erro ao atender alerta:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E86C1" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={handleHome}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
        
        <Text style={styles.titulo}>Alertas</Text>
        
        <TouchableOpacity style={styles.botaoAtualizar} onPress={listarAlertas}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E86C1" />
            <Text style={styles.loadingText}>Carregando alertas...</Text>
          </View>
        ) : alertas.length > 0 ? (
          alertas.map((alerta) => (
            <View key={alerta.id} style={styles.alertaCard}>
              <View style={styles.alertaHeader}>
                <View style={styles.alertaInfo}>
                  <Text style={styles.alertaIdoso}>{alerta.nomeIdoso}</Text>
                  <Text style={styles.alertaTipo}>{alerta.tipo}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(alerta.status) }]}>
                  <Text style={styles.statusText}>{alerta.status || 'Ativo'}</Text>
                </View>
              </View>
              
              <View style={styles.alertaDetails}>
                <Text style={styles.alertaData}>
                  <Ionicons name="time" size={14} color="#666" />
                  {' '}{formatarData(alerta.dataAlerta)}
                </Text>
                
                {alerta.descricao && (
                  <Text style={styles.alertaDescricao}>{alerta.descricao}</Text>
                )}
                
                {alerta.totalRespostas > 0 && (
                  <Text style={styles.respostasText}>
                    {alerta.totalRespostas} resposta{alerta.totalRespostas > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
              
              {/* Botões de ação - apenas para alertas ativos e respondidos */}
              {(alerta.status === 'ativo' || alerta.status === 'respondido') && (
                <View style={styles.actionButtonsContainer}>
                  {/* Botão Atender Alerta - apenas para alertas ativos */}
                  {alerta.status === 'ativo' && (
                    <TouchableOpacity 
                      style={styles.atenderButton} 
                      onPress={() => atenderAlerta(alerta)}
                    >
                      <Ionicons name="chatbubble" size={20} color="#fff" />
                      <Text style={styles.atenderButtonText}>Atender Alerta</Text>
                    </TouchableOpacity>
                  )}
                  
                  {/* Botão Marcar como Resolvido */}
                  <TouchableOpacity 
                    style={styles.resolverButton} 
                    onPress={() => marcarComoResolvido(alerta.id)}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.resolverButtonText}>Marcar como Resolvido</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#ccc" />
            <Text style={styles.semAlertas}>Nenhum alerta encontrado</Text>
            <Text style={styles.emptySubtext}>Todos os alertas foram respondidos ou não há alertas ativos</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2E86C1",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  botaoVoltar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  botaoAtualizar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 8,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  semAlertas: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: 'center',
  },
  alertaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertaInfo: {
    flex: 1,
  },
  alertaIdoso: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 4,
  },
  alertaTipo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  alertaDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  alertaData: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  alertaDescricao: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  respostasText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    marginTop: 12,
    gap: 8,
  },
  atenderButton: {
    backgroundColor: '#2E86C1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  atenderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  resolverButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resolverButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
