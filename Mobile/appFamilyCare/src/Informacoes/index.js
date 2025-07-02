import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Platform, 
  StatusBar,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useUser } from '../context/UserContext';

export default function Informacoes({ navigation, route }) {
  const { user, currentFamily } = useUser();
  const [idoso, setIdoso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [condicoesMedicas, setCondicoesMedicas] = useState([]);
  const [loadingCondicoes, setLoadingCondicoes] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    sexo: '',
    altura: '',
    peso: '',
    carteiraSUS: '',
    telefone: '',
    email: ''
  });

  useEffect(() => {
    if (route.params && route.params.idoso) {
      const idosoRecebido = route.params.idoso;
      setIdoso({
        ...idosoRecebido,
        carteiraSUS: idosoRecebido.carteiraSUS !== undefined && idosoRecebido.carteiraSUS !== null ? String(idosoRecebido.carteiraSUS) : '',
      });
      setFormData({
        nome: idosoRecebido.nome || '',
        idade: idosoRecebido.idade ? idosoRecebido.idade.toString() : '',
        sexo: idosoRecebido.sexo || '',
        altura: idosoRecebido.altura ? idosoRecebido.altura.toString() : '',
        peso: idosoRecebido.peso ? idosoRecebido.peso.toString() : '',
        carteiraSUS: idosoRecebido.carteiraSUS !== undefined && idosoRecebido.carteiraSUS !== null ? String(idosoRecebido.carteiraSUS) : '',
        telefone: idosoRecebido.telefone || '',
        email: idosoRecebido.email || ''
      });
      carregarCondicoesMedicas(idosoRecebido.id);
    } else {
      // Erro: Nenhum idoso recebido
    }
    setLoading(false);
  }, [route.params]);

  const carregarCondicoesMedicas = async (idosoId) => {
    try {
      setLoadingCondicoes(true);
      const response = await api.post('/getCondicoesMedicas.php', { idosoId: idosoId });
      if (response.data.status === 'sucesso') {
        setCondicoesMedicas(response.data.condicoes || []);
      } else {
        setCondicoesMedicas([]);
      }
    } catch (error) {
      // Erro ao carregar condições médicas
      setCondicoesMedicas([]);
    } finally {
      setLoadingCondicoes(false);
    }
  };

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.idade || !formData.sexo || !formData.altura || !formData.peso) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }
    const idade = parseInt(formData.idade);
    const altura = parseInt(formData.altura);
    const peso = parseFloat(formData.peso);
    if (isNaN(idade) || idade <= 0 || idade > 150) {
      Alert.alert('Erro', 'Idade deve ser um número válido entre 1 e 150');
      return;
    }
    if (isNaN(altura) || altura <= 0 || altura > 300) {
      Alert.alert('Erro', 'Altura deve ser um número válido (em centímetros)');
      return;
    }
    if (isNaN(peso) || peso <= 0 || peso > 500) {
      Alert.alert('Erro', 'Peso deve ser um número válido (em kg)');
      return;
    }
    try {
      const data = {
        nome: formData.nome.trim(),
        idade: idade,
        sexo: formData.sexo,
        altura: altura,
        peso: peso,
        carteiraSUS: formData.carteiraSUS || '',
        telefone: formData.telefone || '',
        email: formData.email || '',
        id: idoso.id
      };
      const res = await api.post('/updateIdoso.php', data);
      if (res.data.success || res.data.status === 'sucesso') {
        Alert.alert('Sucesso', 'Idoso atualizado com sucesso');
        setModalVisible(false);
        setIdoso(prev => ({ ...prev, ...data, carteiraSUS: data.carteiraSUS !== undefined && data.carteiraSUS !== null ? String(data.carteiraSUS) : '' }));
      } else {
        Alert.alert('Erro', res.data.message || res.data.mensagem || 'Erro ao atualizar idoso');
      }
    } catch (error) {
      // Erro ao atualizar idoso
      Alert.alert('Erro', 'Erro ao atualizar idoso. Verifique sua conexão.');
    }
  };

  const handleVoltar = () => {
    try {
      if (route.params && route.params.userType === 'idoso') {
        navigation.navigate('HomeIdoso');
      } else {
        navigation.navigate('HomeCuidador');
      }
    } catch (error) {
      // Erro na navegação
      navigation.navigate('Login');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E86C1" />
      </View>
    );
  }

  if (!idoso) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={handleVoltar}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.textoBotao}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Informações</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum idoso selecionado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E86C1" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={handleVoltar}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
        
        <Text style={styles.titulo}>{idoso.nome}</Text>
        
        <TouchableOpacity style={styles.botaoEdit} onPress={handleEdit}>
          <Ionicons name="create" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Informações do Idoso */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Informações Pessoais</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Idade:</Text>
              <Text style={styles.infoValue}>{idoso.idade || 'Não informado'} anos</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sexo:</Text>
              <Text style={styles.infoValue}>{idoso.sexo || 'Não informado'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Altura:</Text>
              <Text style={styles.infoValue}>{idoso.altura ? `${idoso.altura}cm` : 'Não informado'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Peso:</Text>
              <Text style={styles.infoValue}>{idoso.peso ? `${idoso.peso}kg` : 'Não informado'}</Text>
            </View>
            {typeof idoso.carteiraSUS !== 'undefined' && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SUS:</Text>
                <Text style={styles.infoValue}>{idoso.carteiraSUS || 'Não informado'}</Text>
              </View>
            )}
            {idoso.telefone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Telefone:</Text>
                <Text style={styles.infoValue}>{idoso.telefone}</Text>
              </View>
            )}
            {idoso.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{idoso.email}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Condições Médicas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏥 Condições Médicas</Text>
          </View>
          <View style={styles.infoCard}>
            {loadingCondicoes ? (
              <Text style={styles.emptyText}>Carregando condições médicas...</Text>
            ) : condicoesMedicas.length > 0 ? (
              condicoesMedicas.map((condicao, index) => (
                <View key={index} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>•</Text>
                  <Text style={styles.infoValue}>{condicao}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma condição médica registrada</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal para editar idoso */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Idoso</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={(text) => setFormData({...formData, nome: text})}
                placeholder="Nome completo *"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                value={formData.idade}
                onChangeText={(text) => setFormData({...formData, idade: text})}
                placeholder="Idade *"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Sexo *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setFormData({...formData, sexo: 'Masculino'})}
                >
                  <View style={[styles.radio, formData.sexo === 'Masculino' && styles.radioSelected]}>
                    {formData.sexo === 'Masculino' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>Masculino</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setFormData({...formData, sexo: 'Feminino'})}
                >
                  <View style={[styles.radio, formData.sexo === 'Feminino' && styles.radioSelected]}>
                    {formData.sexo === 'Feminino' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>Feminino</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setFormData({...formData, sexo: 'Outro'})}
                >
                  <View style={[styles.radio, formData.sexo === 'Outro' && styles.radioSelected]}>
                    {formData.sexo === 'Outro' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>Outro</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                value={formData.altura}
                onChangeText={(text) => setFormData({...formData, altura: text})}
                placeholder="Altura (cm) *"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                value={formData.peso}
                onChangeText={(text) => setFormData({...formData, peso: text})}
                placeholder="Peso (kg) *"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                value={formData.carteiraSUS}
                onChangeText={(text) => setFormData({...formData, carteiraSUS: text})}
                placeholder="Carteira SUS"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                value={formData.telefone}
                onChangeText={(text) => setFormData({...formData, telefone: text})}
                placeholder="Telefone"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E86C1',
    flex: 1,
    textAlign: 'center',
  },
  botaoVoltar: {
    flexDirection: 'row',
    backgroundColor: '#2E86C1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  botaoEdit: {
    backgroundColor: '#2E86C1',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  section: {
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#2E86C1',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoEdit: {
    backgroundColor: '#2E86C1',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 10,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffeaea',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  modalScroll: {
    padding: 20,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 4,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2E86C1',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: '#2E86C1',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2E86C1',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
