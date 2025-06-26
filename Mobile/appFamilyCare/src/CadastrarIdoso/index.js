import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CadastrarIdoso({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    sexo: '',
    altura: '',
    peso: '',
    condicoes: '',
    contatoEmergencia: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validar campos obrigatórios
    if (!formData.nome || !formData.idade || !formData.sexo || !formData.altura || !formData.peso || !formData.condicoes || !formData.contatoEmergencia) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Aqui você pode adicionar a lógica para salvar os dados no servidor
    // Por enquanto, apenas mostramos um alerta de sucesso
    Alert.alert('Sucesso', 'Idoso cadastrado com sucesso!');
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace('Home');
        }
      }}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
      <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}} showsVerticalScrollIndicator={false}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.titulo}>Cadastro de Idoso</Text>
        <View style={styles.formBox}>
          <TextInput
            style={styles.input}
            value={formData.nome}
            onChangeText={(text) => handleChange('nome', text)}
            placeholder="Nome"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={formData.idade}
            onChangeText={(text) => handleChange('idade', text)}
            placeholder="Idade"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={formData.sexo}
            onChangeText={(text) => handleChange('sexo', text)}
            placeholder="Sexo"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={formData.altura}
            onChangeText={(text) => handleChange('altura', text)}
            placeholder="Altura"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            value={formData.peso}
            onChangeText={(text) => handleChange('peso', text)}
            placeholder="Peso"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            value={formData.condicoes}
            onChangeText={(text) => handleChange('condicoes', text)}
            placeholder="Condições"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={formData.contatoEmergencia}
            onChangeText={(text) => handleChange('contatoEmergencia', text)}
            placeholder="Contato de Emergência"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff'
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  botaoVoltar: {
    backgroundColor: '#2E86C1',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 16,
  },
  formBox: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  botao: {
    backgroundColor: '#2E86C1',
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});