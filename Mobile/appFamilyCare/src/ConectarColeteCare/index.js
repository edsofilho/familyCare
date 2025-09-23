import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export default function ConectarColeteCare({ navigation }) {
  const { user, currentFamily } = useUser();
  const [codigoColete, setCodigoColete] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVincularColete = async () => {
    if (!codigoColete.trim()) {
      Alert.alert('Erro', 'Por favor, digite o código do colete');
      return;
    }

    setLoading(true);
    try {
      // Aqui será feita a chamada para a API para vincular o colete ao idoso
      const response = await fetch('http://localhost/apireact/vincularColete.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigoColete: codigoColete.trim(),
          idosoId: user.id
        })
      });

      const result = await response.json();
      
      if (result.status === 'sucesso') {
        Alert.alert('Sucesso', 'Colete vinculado com sucesso!', [
          { text: 'OK', onPress: () => navigation.replace("HomeIdoso") }
        ]);
      } else {
        Alert.alert('Erro', result.mensagem || 'Erro ao vincular colete');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeIdoso = () => {
    navigation.replace("HomeIdoso");
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Ionicons name="watch" size={40} color="#2E86C1" />
        <Text style={styles.title}>Vincular ColeteCare</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.deviceContainer}>
          <Text style={styles.deviceText}>ColeteCare</Text>
          <Text style={styles.deviceStatus}>Digite o código do seu colete</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Código do Colete:</Text>
          <TextInput
            style={styles.codeInput}
            value={codigoColete}
            onChangeText={setCodigoColete}
            placeholder="Ex: COL001234"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            maxLength={20}
          />
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Como encontrar o código:</Text>
          <View style={styles.instructionList}>
            <View style={styles.instructionItem}>
              <Ionicons name="information-circle-outline" size={20} color="#2E86C1" />
              <Text style={styles.instructionText}>O código está impresso na etiqueta do colete</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="information-circle-outline" size={20} color="#2E86C1" />
              <Text style={styles.instructionText}>Também pode ser encontrado no manual do dispositivo</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="information-circle-outline" size={20} color="#2E86C1" />
              <Text style={styles.instructionText}>Formato: COL + números (ex: COL001234)</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.connectButton, loading && styles.disabledButton]} 
          onPress={handleVincularColete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.connectButtonText}>Vincular Colete</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 20 }} />
        <TouchableOpacity style={styles.backButton} onPress={handleHomeIdoso}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  deviceContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  deviceImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  deviceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  deviceStatus: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  instructionContainer: {
    marginBottom: 30,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: '#2E86C1',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
  },
  connectButton: {
    backgroundColor: '#2E86C1',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#fff',
    borderColor: '#2E86C1',
    borderWidth: 1,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2E86C1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});