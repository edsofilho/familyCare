import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert, Linking, Platform, StatusBar, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { useUser } from '../context/UserContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

export default function Home({ navigation }) {
  const { user, currentFamily, logout, setFamily } = useUser();
  const [idosos, setIdosos] = useState([]);
  const [cuidadores, setCuidadores] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalContatoVisible, setModalContatoVisible] = useState(false);
  const [contatoEditando, setContatoEditando] = useState(null);
  const [contatoNome, setContatoNome] = useState("");
  const [contatoTelefone, setContatoTelefone] = useState("");
  const [cuidadoresExpandido, setCuidadoresExpandido] = useState(false);
  const [alertasRecentes, setAlertasRecentes] = useState([]);
  const [ultimaVerificacao, setUltimaVerificacao] = useState(null);
  const [editFamilyNameModal, setEditFamilyNameModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState(currentFamily?.nome || "");
  const [notifiedAlertIds, setNotifiedAlertIds] = useState([]);

  useEffect(() => {
    if (currentFamily && currentFamily.id) {
      carregarDados();
    }
  }, [currentFamily?.id]);

  // Carregar índice salvo quando o componente monta
  useEffect(() => {
    carregarIndiceSalvo();
  }, []);

  // Salvar índice quando mudar
  useEffect(() => {
    if (currentFamily && currentFamily.id && idosos.length > 0) {
      salvarIndice();
    }
  }, [currentIndex, currentFamily?.id, idosos.length]);

  const carregarIndiceSalvo = async () => {
    try {
      if (currentFamily && currentFamily.id) {
        const indiceSalvo = await AsyncStorage.getItem(`carouselIndex_${currentFamily.id}`);
        if (indiceSalvo !== null) {
          const indice = parseInt(indiceSalvo);
          if (idosos.length > 0 && indice < idosos.length) {
            setCurrentIndex(indice);
          }
        }
      }
    } catch (error) {
      // Erro ao carregar índice salvo
    }
  };

  const salvarIndice = async () => {
    try {
      if (currentFamily && currentFamily.id) {
        await AsyncStorage.setItem(`carouselIndex_${currentFamily.id}`, currentIndex.toString());
      }
    } catch (error) {
      // Erro ao salvar índice
    }
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar idosos
      const resIdosos = await api.post('/getIdosos.php', { familiaId: currentFamily.id });
      if (resIdosos.data.status === 'sucesso' || resIdosos.data.success) {
        setIdosos(resIdosos.data.idosos);
        // Carregar índice salvo após carregar os idosos
        setTimeout(() => carregarIndiceSalvo(), 100);
      } else {
        setIdosos([]);
      }
      
      // Carregar cuidadores
      const resCuidadores = await api.post('/getCuidadores.php', { familiaId: currentFamily.id });
      if (resCuidadores.data.status === 'sucesso' || resCuidadores.data.success) {
        setCuidadores(resCuidadores.data.cuidadores);
      } else {
        setCuidadores([]);
      }

    } catch (error) {
      // Erro ao carregar dados
      Alert.alert('Erro', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const verificarAlertasTempoReal = async () => {
    try {
      const res = await api.post('/getAlertasTempoReal.php', {
        familiaId: currentFamily.id,
        ultimaVerificacao: ultimaVerificacao
      });
      if (res.data.status === 'sucesso' && res.data.alertas.length > 0) {
        setUltimaVerificacao(res.data.timestamp);
        let notifiedIds = JSON.parse(await AsyncStorage.getItem('alertasNotificados')) || [];
        const novosAlertas = res.data.alertas.filter(alerta => !notifiedIds.includes(alerta.id));
        if (novosAlertas.length > 0) {
          setAlertasRecentes(novosAlertas);
          notifiedIds = [...notifiedIds, ...novosAlertas.map(a => a.id)];
          await AsyncStorage.setItem('alertasNotificados', JSON.stringify(notifiedIds));
          novosAlertas.forEach(alerta => {
            Alert.alert(
              `🚨 Alerta de ${alerta.nomeIdoso}`,
              `Tipo: ${alerta.tipo}\nData: ${new Date(alerta.dataAlerta).toLocaleString('pt-BR')}`,
              [
                { text: 'Ver Alertas', onPress: () => handleAlertas() },
                { text: 'OK', style: 'cancel' }
              ]
            );
          });
        }
      }
    } catch (error) {
      // Erro ao verificar alertas
    }
  };

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  const handleInforma = () => {
    if (idosos.length === 0) {
      Alert.alert('Aviso', 'Não há idosos cadastrados nesta família');
      return;
    }
    const idosoSelecionado = idosos[currentIndex];
    navigation.replace("Informacoes", { 
      idoso: idosoSelecionado,
      userType: 'cuidador'
    });
  };

  const handleAlertas = () => {
    if (idosos.length === 0) {
      Alert.alert('Aviso', 'Não há idosos cadastrados nesta família');
      return;
    }
    const idosoSelecionado = idosos[currentIndex];
    navigation.replace("Alertas", { 
      idoso: idosoSelecionado,
      userType: 'cuidador'
    });
  };

  const handleMedi = () => {
    if (idosos.length === 0) {
      Alert.alert('Aviso', 'Não há idosos cadastrados nesta família');
      return;
    }
    const idosoSelecionado = idosos[currentIndex];
    navigation.replace("Medicacao", { 
      idoso: idosoSelecionado,
      userType: 'cuidador'
    });
  };

  const handleDoencas = () => {
    if (idosos.length === 0) {
      Alert.alert('Aviso', 'Não há idosos cadastrados nesta família');
      return;
    }
    navigation.replace("Doencas");
  };

  const handleCadastrarIdoso = () => {
    navigation.replace('CadastrarIdoso');
  };

  const handleLigarCuidador = (telefone) => {
    if (telefone) {
      Linking.openURL(`tel:${telefone}`);
    } else {
      Alert.alert('Erro', 'Telefone não disponível');
    }
  };

  const handleAdicionarContato = (cuidador) => {
    if (cuidador.nome && cuidador.telefone) {
      // Abrir app de contatos com dados pré-preenchidos
      const contatoUrl = `contacts://add?name=${encodeURIComponent(cuidador.nome)}&phone=${encodeURIComponent(cuidador.telefone)}`;
      Linking.openURL(contatoUrl).catch(() => {
        // Fallback se não conseguir abrir o app de contatos
        Alert.alert(
          'Adicionar Contato',
          `Nome: ${cuidador.nome}\nTelefone: ${cuidador.telefone}\n\nCopie estas informações e adicione manualmente aos seus contatos.`
        );
      });
    } else {
      Alert.alert('Erro', 'Dados do cuidador incompletos');
    }
  };

  const handleEditarContato = (cuidador) => {
    setContatoEditando(cuidador);
    setContatoNome(cuidador.nome);
    setContatoTelefone(cuidador.telefone);
    setModalContatoVisible(true);
  };

  const salvarContato = () => {
    // Aqui você pode integrar com a API para salvar o contato editado
    setModalContatoVisible(false);
    Alert.alert('Contato atualizado', `Nome: ${contatoNome}\nTelefone: ${contatoTelefone}`);
  };

  // Função para editar nome da família
  const handleEditFamilyName = async () => {
    if (!newFamilyName.trim()) {
      Alert.alert('Erro', 'Nome da família não pode estar vazio');
      return;
    }
    
    try {
      const res = await api.post('/updateFamilyName.php', { 
        familiaId: currentFamily.id, 
        nome: newFamilyName.trim() 
      });
      
      if (res.data.status === 'sucesso' || res.data.success) {
        Alert.alert('Sucesso', 'Nome da família atualizado com sucesso');
        setEditFamilyNameModal(false);
        // Atualizar o contexto da família
        setFamily({ ...currentFamily, nome: newFamilyName.trim() });
      } else {
        Alert.alert('Erro', res.data.message || res.data.mensagem || 'Erro ao atualizar nome da família');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar nome da família. Verifique sua conexão.');
    }
  };

  if (!currentFamily) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E86C1" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.NomeCuidador}>Olá, {user.nome}</Text>
        <View style={styles.familiaContainer}>
          <Text style={styles.familiaNome}>{currentFamily.nome}</Text>
          <TouchableOpacity onPress={() => {
            setNewFamilyName(currentFamily.nome);
            setEditFamilyNameModal(true);
          }}>
            <Ionicons name="create-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : idosos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum idoso cadastrado</Text>
            <Text style={styles.emptySubtext}>Cadastre o primeiro idoso da família</Text>
            <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastrarIdoso}>
              <Ionicons name="person-add-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.cadastrarText}>Cadastrar Idoso</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Carousel de Idosos */}
            <View style={styles.carouselContainer}>
              <Carousel
                style={styles.carousel}
                width={width * 0.96}
                height={height * 0.38}
                data={idosos}
                scrollAnimationDuration={600}
                onSnapToItem={setCurrentIndex}
                defaultIndex={currentIndex}
                renderItem={({ item }) => (
                  <View style={styles.carouselCard}>
                    <View style={styles.cardHeader}>
                      <Ionicons name="person-circle" size={48} color="#2E86C1" />
                      <View style={styles.cardInfo}>
                        <Text style={styles.nomeIdoso}>{item.nome}</Text>
                        <Text style={styles.infoIdoso}>Idade: {item.idade} anos</Text>
                      </View>
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.actionButton} onPress={handleAlertas}>
                        <Ionicons name="alert-circle" size={28} color="#D35400" />
                        <Text style={styles.actionText}>Alertas</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton} onPress={handleInforma}>
                        <Ionicons name="information-circle-outline" size={28} color="#2E86C1" />
                        <Text style={styles.actionText}>Informações</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton} onPress={handleMedi}>
                        <Ionicons name="medkit-outline" size={28} color="#27AE60" />
                        <Text style={styles.actionText}>Medicamentos</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              <View style={styles.carouselIndicators}>
                {idosos.map((_, idx) => (
                  <View
                    key={idx}
                    style={[styles.carouselDot, currentIndex === idx && styles.carouselDotActive]}
                  />
                ))}
              </View>
            </View>

            {/* Botão Cadastrar Idoso */}
            <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastrarIdoso}>
              <Ionicons name="person-add-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.cadastrarText}>Cadastrar Novo Idoso</Text>
            </TouchableOpacity>

            {/* Seção de Cuidadores */}
            <View style={styles.cuidadoresSection}>
              <TouchableOpacity 
                style={styles.cuidadoresHeader}
                onPress={() => setCuidadoresExpandido(!cuidadoresExpandido)}
                activeOpacity={0.7}
              >
                <View style={styles.cuidadoresTitleContainer}>
                  <Ionicons name="people" size={24} color="#2E86C1" style={{ marginRight: 8 }} />
                  <Text style={styles.tituloCuidadores}>Cuidadores ({cuidadores.length})</Text>
                </View>
                <Ionicons 
                  name={cuidadoresExpandido ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#2E86C1" 
                />
              </TouchableOpacity>
              
              {cuidadoresExpandido && (
                <View style={styles.cuidadoresContent}>
                  {cuidadores.length === 0 ? (
                    <View style={styles.emptyCuidadores}>
                      <Ionicons name="people-outline" size={48} color="#ccc" />
                      <Text style={styles.emptyCuidadoresText}>Nenhum cuidador cadastrado</Text>
                    </View>
                  ) : (
                    <View style={styles.listaCuidadores}>
                      {cuidadores.map((cuidador) => (
                        <View key={cuidador.id} style={styles.cuidadorItem}>
                          <View style={styles.cuidadorInfo}>
                            <Text style={styles.cuidadorNome}>{cuidador.nome}</Text>
                            <Text style={styles.cuidadorTelefone}>{cuidador.telefone}</Text>
                          </View>
                          <View style={styles.cuidadorButtons}>
                            <TouchableOpacity 
                              style={styles.cuidadorButton} 
                              onPress={() => handleLigarCuidador(cuidador.telefone)}
                            >
                              <Ionicons name="call" size={20} color="#2E86C1" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.cuidadorButton} 
                              onPress={() => handleAdicionarContato(cuidador)}
                            >
                              <Ionicons name="person-add" size={20} color="#27AE60" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <TouchableOpacity style={styles.solicitacoesButton} onPress={() => navigation.navigate('Solicitacoes')}>
                    <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.solicitacoesText}>Gerenciar Solicitações</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.cadastrarCuidadorButton} onPress={() => navigation.navigate('CadastroCuidador')}>
                    <Ionicons name="person-add-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.cadastrarCuidadorText}>Cadastrar Novo Cuidador</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Botão Sair */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Modal de edição/cadastro de contato */}
      <Modal
        visible={modalContatoVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalContatoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {contatoEditando ? 'Editar Contato' : 'Novo Contato'}
              </Text>
              <TouchableOpacity onPress={() => setModalContatoVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              value={contatoNome}
              onChangeText={setContatoNome}
              placeholder="Nome do contato"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.modalInput}
              value={contatoTelefone}
              onChangeText={setContatoTelefone}
              placeholder="Telefone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.modalButton} onPress={salvarContato}>
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de edição do nome da família */}
      <Modal
        visible={editFamilyNameModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditFamilyNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Nome da Família</Text>
              <TouchableOpacity onPress={() => setEditFamilyNameModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              value={newFamilyName}
              onChangeText={setNewFamilyName}
              placeholder="Nome da família"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleEditFamilyName}>
              <Text style={styles.modalButtonText}>Salvar</Text>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2E86C1',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  NomeCuidador: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  familiaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familiaNome: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  carouselContainer: {
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.42,
  },
  carousel: {
    marginBottom: 8,
    alignSelf: 'center',
  },
  carouselCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    minHeight: height * 0.32,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nomeIdoso: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 6,
  },
  infoIdoso: {
    fontSize: 15,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f8f9fa',
    minWidth: 90,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E86C1',
    marginTop: 6,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  carouselDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  carouselDotActive: {
    backgroundColor: '#2E86C1',
  },
  cadastrarButton: {
    backgroundColor: '#2E86C1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cadastrarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cuidadoresSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cuidadoresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  cuidadoresTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tituloCuidadores: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  cuidadoresContent: {
    padding: 16,
  },
  emptyCuidadores: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyCuidadoresText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  listaCuidadores: {
    marginBottom: 16,
  },
  cuidadorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  cuidadorInfo: {
    flex: 1,
  },
  cuidadorNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86C1',
    marginBottom: 2,
  },
  cuidadorTelefone: {
    fontSize: 14,
    color: '#666',
  },
  cuidadorButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cuidadorButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  solicitacoesButton: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solicitacoesText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#2E86C1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cadastrarCuidadorButton: {
    backgroundColor: '#2E86C1',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  cadastrarCuidadorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 