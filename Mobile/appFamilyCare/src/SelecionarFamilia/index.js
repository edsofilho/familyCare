import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { authAPI } from '../../services/api';

export default function SelecionarFamilia({ navigation }) {
  const { user, currentFamily, setFamily } = useUser();
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFamilias();
  }, []);

  const carregarFamilias = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getFamilias();
      if (response.data.success) {
        setFamilias(response.data.familias || []);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar as famílias');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const selecionarFamilia = async (familia) => {
    try {
      if (setFamily) {
        setFamily(familia);
        Alert.alert('Sucesso', `Família ${familia.nome} selecionada!`);
        navigation.replace('HomeCuidador');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar família');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E86C1" />
        <Text style={styles.loadingText}>Carregando famílias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Família</Text>
      {familias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma família encontrada</Text>
        </View>
      ) : (
        <FlatList
          data={familias}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.familiaItem}
              onPress={() => selecionarFamilia(item)}
            >
              <Text style={styles.familiaNome}>{item.nome}</Text>
              <Text style={styles.familiaDescricao}>{item.descricao || 'Sem descrição'}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        style={styles.voltarButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.voltarButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  familiaItem: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2E86C1',
  },
  familiaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  familiaDescricao: {
    fontSize: 14,
    color: '#666',
  },
  voltarButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  voltarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 