import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Informa({ navigation }) {
  const handleVoltar = () => {
    navigation.replace('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Informações do Idoso</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.valor}>Getúlio Pereira</Text>

        <Text style={styles.label}>Idade:</Text>
        <Text style={styles.valor}>82 anos</Text>

        <Text style={styles.label}>Sexo:</Text>
        <Text style={styles.valor}>Masculino</Text>

        <Text style={styles.label}>Altura:</Text>
        <Text style={styles.valor}>1,72 m</Text>

        <Text style={styles.label}>Peso:</Text>
        <Text style={styles.valor}>68 kg</Text>

        <Text style={styles.label}>Condições:</Text>
        <Text style={styles.valor}>Hipertensão, Diabetes tipo 2</Text>

        <Text style={styles.label}>Contato de Emergência:</Text>
        <Text style={styles.valor}>Cláudio - (11) 91234-5678</Text>
      </View>

      <TouchableOpacity style={styles.botaoVoltar} onPress={handleVoltar}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E86C1',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  valor: {
    fontSize: 16,
    color: '#555',
  },
  botaoVoltar: {
    flexDirection: 'row',
    backgroundColor: '#2E86C1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
