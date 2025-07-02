import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { familiaAPI } from '../../services/api';

export default function EntrarFamilia({ navigation }) {
  const { user } = useUser();
  const [codigoFamilia, setCodigoFamilia] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEntrarFamilia = async () => {
    if (!codigoFamilia.trim()) {
      Alert.alert('Erro', 'Digite o código da família');
      return;
    }
    setLoading(true);
    try {
      const res = await familiaAPI.enter(user.id, codigoFamilia.trim());
      if (res.data.status === 'sucesso') {
        Alert.alert('Sucesso', 'Entrou na família com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('HomeCuidador')
          }
        ]);
      } else {
        Alert.alert('Erro', res.data.mensagem || 'Erro ao entrar na família');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao entrar na família. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#2E86C1" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Ionicons name="people-circle-outline" size={80} color="#2E86C1" />
        <Text style={styles.titulo}>Entrar em uma Família</Text>
        <Text style={styles.subtitulo}>
          Digite o código da família que você recebeu
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Código da família"
          value={codigoFamilia}
          onChangeText={setCodigoFamilia}
          placeholderTextColor="#999"
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity 
          style={[styles.entrarButton, loading && styles.entrarButtonDisabled]} 
          onPress={handleEntrarFamilia}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.entrarButtonText}>Entrando...</Text>
          ) : (
            <>
              <Ionicons name="enter-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.entrarButtonText}>Entrar na Família</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Como obter o código?</Text>
        <Text style={styles.infoText}>
          • Peça o código para um membro da família{'\n'}
          • O código é gerado automaticamente quando a família é criada{'\n'}
          • Você pode compartilhar seu código com outros cuidadores
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2E86C1',
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#154360',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  entrarButton: {
    backgroundColor: '#2E86C1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E86C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  entrarButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  entrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E86C1',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#154360',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 