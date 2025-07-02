import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export default function ConectarColeteCare({ navigation }) {
  const { user, currentFamily } = useUser();

  const handleHomeIdoso = () => {
    navigation.replace("HomeIdoso");
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Ionicons name="bluetooth" size={40} color="#2E86C1" />
        <Text style={styles.title}>Conectar ColeteCare</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.deviceContainer}>
          {/* <Image
            source={require('../../assets/colete_care.png')}
            style={styles.deviceImage}
            resizeMode="contain"
          /> */}
          <Text style={styles.deviceText}>ColeteCare</Text>
          <Text style={styles.deviceStatus}>Dispositivo não conectado</Text>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Instruções para conexão:</Text>
          <View style={styles.instructionList}>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#2E86C1" />
              <Text style={styles.instructionText}>Ligue o Bluetooth do seu dispositivo</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#2E86C1" />
              <Text style={styles.instructionText}>Aproxime o ColeteCare do seu dispositivo</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#2E86C1" />
              <Text style={styles.instructionText}>Toque em "Conectar" para iniciar a busca</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.connectButton} onPress={handleHomeIdoso}>
          <Text style={styles.connectButtonText}>Conectar</Text>
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
  connectButton: {
    backgroundColor: '#2E86C1',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
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