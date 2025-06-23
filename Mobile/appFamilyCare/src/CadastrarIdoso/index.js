import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CadastrarIdoso({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    endereco: '',
    telefone: '',
    email: '',
    nomeResponsavel: '',
    telefoneResponsavel: '',
    emailResponsavel: '',
    medicacoes: '',
    alergias: '',
    observacoes: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validar campos obrigatórios
    if (!formData.nome || !formData.dataNascimento || !formData.cpf || !formData.telefone) {
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
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Cadastrar Idoso</Text>
          <Ionicons name="person-add-outline" size={40} color="#4CAF50" />
        </View>

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
          <Text style={styles.label}>Data de Nascimento *</Text>
          <TextInput
            style={styles.input}
            value={formData.dataNascimento}
            onChangeText={(text) => handleChange('dataNascimento', text)}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CPF *</Text>
          <TextInput
            style={styles.input}
            value={formData.cpf}
            onChangeText={(text) => handleChange('cpf', text)}
            placeholder="000.000.000-00"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço *</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco}
            onChangeText={(text) => handleChange('endereco', text)}
            placeholder="Rua, número, bairro, cidade"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={styles.input}
            value={formData.telefone}
            onChangeText={(text) => handleChange('telefone', text)}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informações do Responsável</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Responsável *</Text>
          <TextInput
            style={styles.input}
            value={formData.nomeResponsavel}
            onChangeText={(text) => handleChange('nomeResponsavel', text)}
            placeholder="Nome completo do responsável"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone do Responsável *</Text>
          <TextInput
            style={styles.input}
            value={formData.telefoneResponsavel}
            onChangeText={(text) => handleChange('telefoneResponsavel', text)}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email do Responsável</Text>
          <TextInput
            style={styles.input}
            value={formData.emailResponsavel}
            onChangeText={(text) => handleChange('emailResponsavel', text)}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informações Médicas</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medicações</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={formData.medicacoes}
            onChangeText={(text) => handleChange('medicacoes', text)}
            placeholder="Medicações em uso"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alergias</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={formData.alergias}
            onChangeText={(text) => handleChange('alergias', text)}
            placeholder="Alergias conhecidas"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={formData.observacoes}
            onChangeText={(text) => handleChange('observacoes', text)}
            placeholder="Informações adicionais"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleHome}>
          <Text style={styles.submitButtonText}>Cadastrar Idoso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleHome}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
  multiline: {
    height: 120,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});