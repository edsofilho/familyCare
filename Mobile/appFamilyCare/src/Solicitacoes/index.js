import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { cuidadorAPI } from '../../services/api';

export default function Solicitacoes({ navigation }) {
  const { user, currentFamily } = useUser();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      const res = await cuidadorAPI.getInvites(user.id);
      if (res.data.status === 'sucesso') {
        setSolicitacoes(res.data.solicitacoes);
      } else {
        Alert.alert('Erro', res.data.mensagem);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const responderSolicitacao = async (solicitacaoId, acao) => {
    setProcessando(true);
    try {
      const res = await cuidadorAPI.respondInvite(solicitacaoId, acao);
      if (res.data.status === 'sucesso') {
        Alert.alert('Sucesso', res.data.mensagem, [
          {
            text: 'OK',
            onPress: () => carregarSolicitacoes()
          }
        ]);
      } else {
        Alert.alert('Erro', res.data.mensagem);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao processar solicitação');
    } finally {
      setProcessando(false);
    }
  };

  const renderSolicitacao = ({ item }) => (
    <View style={styles.solicitacaoCard}>
      <View style={styles.solicitacaoHeader}>
        <Ionicons name="people" size={24} color="#2E86C1" />
        <Text style={styles.familiaNome}>{item.familiaNome}</Text>
      </View>
      <View style={styles.solicitacaoInfo}>
        <Text style={styles.solicitanteText}>
          <Text style={styles.label}>Solicitante: </Text>
          {item.solicitanteNome}
        </Text>
        <Text style={styles.emailText}>
          <Text style={styles.label}>Email: </Text>
          {item.solicitanteEmail}
        </Text>
        <Text style={styles.codigoText}>
          <Text style={styles.label}>Código da família: </Text>
          {item.familiaCodigo}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.label}>Data: </Text>
          {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={[styles.botaoAceitar, processando && styles.botaoDisabled]}
          onPress={() => responderSolicitacao(item.id, 'aceitar')}
          disabled={processando}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Aceitar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoRejeitar, processando && styles.botaoDisabled]}
          onPress={() => responderSolicitacao(item.id, 'rejeitar')}
          disabled={processando}
        >
          <Ionicons name="close" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E86C1" />
        <Text style={styles.loadingText}>Carregando solicitações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Solicitações de Convite</Text>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {solicitacoes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="mail-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma solicitação pendente</Text>
            <Text style={styles.emptySubtext}>
              Quando você receber convites para famílias, eles aparecerão aqui
            </Text>
          </View>
        ) : (
          <FlatList
            data={solicitacoes}
            renderItem={renderSolicitacao}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
        <TouchableOpacity 
          style={styles.botaoAtualizar} 
          onPress={carregarSolicitacoes}
          disabled={loading}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Atualizar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  botaoVoltar: {
    backgroundColor: '#2E86C1',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  solicitacaoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2E86C1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  solicitacaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  familiaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginLeft: 10,
  },
  solicitacaoInfo: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  solicitanteText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  codigoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 14,
    color: '#666',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoAceitar: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  botaoRejeitar: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  botaoDisabled: {
    backgroundColor: '#ccc',
  },
  botaoAtualizar: {
    backgroundColor: '#2E86C1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
}); 