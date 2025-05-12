import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';



export default function HomeIdoso() {
  const handlePress = () => {
    // Aqui futuramente você pode mandar um alerta!
    alert('SOS acionado!');
  };
//  const api = 'http://10.68.36.109/3mtec/addAlerta.php'
   const enviarAlerta = () => {
    fetch('http://127.0.0.1/Users/ds-mtec-3/Documents/TCC/familyCare/Mobile/appFamilyCare/apireact/addAlerta.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome_idoso: 'João da Silva',
        localizacao: 'Rua das Flores, 123' // pode ser vazio ou usar GPS depois
      })
    })
    .then(response => response.json())
    .then(json => {
      if (json.status === 'sucesso') {
        Alert.alert('Alerta enviado com sucesso!');
      } else {
        Alert.alert('Erro:', json.mensagem || 'Erro desconhecido.');
      }
    })
    .catch(error => {
      Alert.alert('Erro de conexão:', error.message);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sosButton} onPress={enviarAlerta}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    backgroundColor: '#EC1C24',
    paddingVertical: 60,
    paddingHorizontal: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sosText: {
    color: '#fff',
    fontSize: 100,
    fontWeight: 'bold',
  },
});
