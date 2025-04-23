import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Alerta({ navigation }) {
    const handleHome = () => {
        navigation.replace('Home');
      };
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alertas de Queda</Text>

      <View style={styles.alertaBox}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.alertaTexto}>Nenhum alerta de queda registrado até o momento.</Text>
      </View>

      <TouchableOpacity style={styles.voltar} onPress={handleHome}>
        <Text style={styles.voltarTexto}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  alertaBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    marginBottom: 40,
  },
  alertaTexto: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  voltar: {
    backgroundColor: '#2E86C1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  voltarTexto: {
    color: '#fff',
    fontSize: 16,
  },
});
