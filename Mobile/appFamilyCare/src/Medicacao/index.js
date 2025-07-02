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
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';
import { useUser } from '../context/UserContext';

export default function Medicacao({ navigation, route }) {
  const { user, currentFamily } = useUser();
  const [idoso, setIdoso] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [formData, setFormData] = useState({
    nome: '',
    horario: new Date(),
    idosoId: null
  });

  useEffect(() => {
    if (route.params && route.params.idoso) {
      setIdoso(route.params.idoso);
      fetchMedicamentos(route.params.idoso.id);
    } else {
      setLoading(false);
    }
  }, [route.params]);

  const fetchMedicamentos = async (idosoId) => {
    try {
      const res = await api.post('/getRemedios.php', { 
        familiaId: currentFamily.id,
        idosoId: idosoId 
      });
      
      if (res.data.status === 'sucesso') {
        setMedicamentos(res.data.remedios);
      } else {
      }
    } catch (error) {
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      nome: '',
      horario: new Date(),
      idosoId: idoso.id
    });
    setModalVisible(true);
  };

  const handleEdit = (medicamento) => {
    setModalMode('edit');
    let horarioDate;
    if (medicamento.horario) {
      const horarioStr = medicamento.horario.substring(0, 5);
      const [hours, minutes] = horarioStr.split(':');
      horarioDate = new Date();
      horarioDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      horarioDate = new Date();
    }
    setFormData({
      nome: medicamento.nome,
      horario: horarioDate,
      idosoId: idoso.id,
      remedioId: medicamento.id
    });
    setModalVisible(true);
  };

  const handleDelete = (medicamento) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir ${medicamento.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteMedicamento(medicamento.id) }
      ]
    );
  };

  const deleteMedicamento = async (medicamentoId) => {
    try {
      const res = await api.post('/deleteRemedio.php', { remedioId: medicamentoId });
      if (res.data.status === 'sucesso') {
        Alert.alert('Sucesso', 'Medicamento excluído com sucesso');
        fetchMedicamentos(idoso.id);
      } else {
        Alert.alert('Erro', res.data.mensagem);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao excluir medicamento');
    }
  };

  const handleSubmit = async () => {
    if (!formData.nome) {
      Alert.alert('Erro', 'Preencha o nome do medicamento');
      return;
    }

    try {
      const data = {
        nome: formData.nome,
        horario: formData.horario.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        idosoId: formData.idosoId,
        familiaId: currentFamily.id
      };

      // Se estiver editando, adicionar o ID do medicamento
      if (modalMode === 'edit' && formData.remedioId) {
        data.remedioId = formData.remedioId;
      }

      const res = await api.post('/addRemedio.php', data);
      
      if (res.data.status === 'sucesso') {
        Alert.alert('Sucesso', 
          modalMode === 'add' ? 'Medicamento adicionado com sucesso' : 'Medicamento atualizado com sucesso'
        );
        setModalVisible(false);
        fetchMedicamentos(idoso.id);
      } else {
        Alert.alert('Erro', res.data.mensagem);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar medicamento');
    }
  };

  const handleVoltar = () => {
    try {
      if (route.params && route.params.userType === 'idoso') {
        navigation.replace('HomeIdoso');
      } else {
        navigation.replace('HomeCuidador');
      }
    } catch (error) {
      // Erro na navegação
      navigation.replace('Login');
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
          <Text style={styles.titulo}>Medicamentos</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum idoso selecionado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={handleVoltar}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
        
        <Text style={styles.titulo}>Medicamentos</Text>
        
        <TouchableOpacity style={styles.botaoAdd} onPress={handleAdd}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Medicamentos de {idoso.nome}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {medicamentos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="medical" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum medicamento cadastrado</Text>
            <Text style={styles.emptySubtext}>Toque no + para adicionar um medicamento</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {medicamentos.map((medicamento) => (
              <View key={medicamento.id} style={styles.medicamentoCard}>
                <View style={styles.medicamentoInfo}>
                  <View style={styles.medicamentoHeader}>
                    <Ionicons name="medical" size={20} color="#2E86C1" />
                    <Text style={styles.medicamentoNome}>{medicamento.nome}</Text>
                  </View>
                  <View style={styles.medicamentoHorario}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.horarioText}>{medicamento.horario}</Text>
                  </View>
                </View>
                <View style={styles.medicamentoActions}>
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => handleEdit(medicamento)}
                  >
                    <Ionicons name="create" size={16} color="#2E86C1" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]} 
                    onPress={() => handleDelete(medicamento)}
                  >
                    <Ionicons name="trash" size={16} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal para adicionar/editar medicamento */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === 'add' ? 'Adicionar Medicamento' : 'Editar Medicamento'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalScroll}>
              <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={(text) => setFormData({...formData, nome: text})}
                placeholder="Nome do medicamento *"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />

              <DateTimePicker
                style={styles.input}
                value={formData.horario}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setFormData({...formData, horario: selectedDate});
                  }
                }}
                mode="time"
                display="default"
              />
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
              <Text style={styles.modalButtonText}>
                {modalMode === 'add' ? 'Adicionar' : 'Atualizar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E86C1',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  botaoVoltar: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  botaoAdd: {
    backgroundColor: '#1565A3',
    padding: 12,
    borderRadius: 50,
    marginLeft: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  subHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    backgroundColor: '#F8FAFC',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  medicamentoCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#2E86C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicamentoInfo: {
    flex: 1,
    marginRight: 10,
  },
  medicamentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  medicamentoNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginLeft: 6,
  },
  medicamentoHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  horarioText: {
    fontSize: 15,
    color: '#1565A3',
    marginLeft: 4,
  },
  medicamentoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
    backgroundColor: '#F0F4F8',
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    elevation: 2,
  },
  emptyCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86C1',
    flex: 1,
    textAlign: 'center',
  },
  modalScroll: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  modalButton: {
    backgroundColor: '#2E86C1',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  cancelar: {
    color: '#555',
    textAlign: 'center',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#2E86C1',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
