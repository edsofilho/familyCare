import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 30 }}>
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
      <Text style={styles.titulo}>Cadastro de Idoso</Text>
      <View style={styles.formBox}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={formData.nome}
            onChangeText={(text) => handleChange('nome', text)}
            placeholder="Digite o nome completo"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Idade *</Text>
          <TextInput
            style={styles.input}
            value={formData.idade}
            onChangeText={(text) => handleChange('idade', text)}
            placeholder="Ex: 82"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sexo *</Text>
          <TextInput
            style={styles.input}
            value={formData.sexo}
            onChangeText={(text) => handleChange('sexo', text)}
            placeholder="Masculino ou Feminino"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Altura *</Text>
          <TextInput
            style={styles.input}
            value={formData.altura}
            onChangeText={(text) => handleChange('altura', text)}
            placeholder="Ex: 1,72 m"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Peso *</Text>
          <TextInput
            style={styles.input}
            value={formData.peso}
            onChangeText={(text) => handleChange('peso', text)}
            placeholder="Ex: 68 kg"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Condições *</Text>
          <TextInput
            style={styles.input}
            value={formData.condicoes}
            onChangeText={(text) => handleChange('condicoes', text)}
            placeholder="Ex: Hipertensão, Diabetes tipo 2"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contato de Emergência *</Text>
          <TextInput
            style={styles.input}
            value={formData.contatoEmergencia}
            onChangeText={(text) => handleChange('contatoEmergencia', text)}
            placeholder="Nome e telefone do contato"
          />
        </View>
        <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
          <Text style={styles.textoBotao}>Cadastrar Idoso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  botaoVoltar: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#2980B9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  formBox: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botao: {
    backgroundColor: '#2980B9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});