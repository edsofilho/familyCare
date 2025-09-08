import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, Platform, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaskedTextInput } from 'react-native-mask-text';
import { useUser } from '../context/UserContext';
import { idosoAPI, condicoesAPI, cuidadorAPI } from '../../services/api';

// Componente para seção colapsável - movido para fora para evitar re-renderizações
const SecaoColapsavel = ({ titulo, aberta, onToggle, children }) => (
  <View style={styles.secaoContainer}>
    <TouchableOpacity
      style={styles.secaoHeader}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      <Ionicons 
        name={aberta ? 'chevron-up' : 'chevron-down'} 
        size={20} 
        color="#2E86C1" 
      />
    </TouchableOpacity>
    {aberta && (
      <View style={styles.secaoConteudo}>
        {children}
      </View>
    )}
  </View>
);

export default function CadastrarIdoso({ navigation }) {
  const { user, currentFamily } = useUser();
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    sexo: '',
    altura: '',
    peso: '',
    carteiraSUS: '',
    contatoEmergenciaNome: '',
    contatoEmergenciaTelefone: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [loading, setLoading] = useState(false);

  // Estados para seções colapsáveis
  const [secoesAbertas, setSecoesAbertas] = useState({
    informacoesBasicas: true,
    dadosFisicos: false,
    contatos: false,
    dadosLogin: false,
    responsavelPrincipal: false,
    condicoesMedicas: false
  });

  // Condições médicas do banco
  const [condicoesDisponiveis, setCondicoesDisponiveis] = useState([]);
  const [condicoesSelecionadas, setCondicoesSelecionadas] = useState([]);
  const [outraCondicao, setOutraCondicao] = useState('');

  // Cuidadores da família
  const [cuidadores, setCuidadores] = useState([]);
  const [cuidadorSelecionado, setCuidadorSelecionado] = useState(null);
  const [mostrarCuidadores, setMostrarCuidadores] = useState(false);



  useEffect(() => {
    if (currentFamily?.id) {
      fetchCondicoes();
      fetchCuidadores();
    }
  }, [currentFamily?.id]);

  // Buscar condições médicas do banco de dados
  const fetchCondicoes = async () => {
    try {
      if (typeof condicoesAPI !== 'undefined' && condicoesAPI.getAll) {
        const res = await condicoesAPI.getAll();
        if (res.data.status === 'sucesso') {
          const nomesCondicoes = res.data.condicoes.map(condicao => condicao.nome);
          setCondicoesDisponiveis(nomesCondicoes);
          return;
        }
      }
    } catch (error) {
      // Erro ao buscar condições médicas
    }
    
    // Fallback para condições padrão
    const condicoes = [
      'Hipertensão', 'Diabetes Tipo 2', 'Artrite', 'Problemas Cardíacos',
      'Alzheimer', 'Parkinson', 'Osteoporose', 'Câncer', 'Asma',
      'Depressão', 'Ansiedade', 'Insônia', 'Problemas de Visão',
      'Problemas Auditivos', 'Doença Renal', 'Doença Hepática',
      'Problemas Respiratórios', 'Problemas Digestivos',
      'Problemas de Pele', 'Problemas Neurológicos'
    ];
    setCondicoesDisponiveis(condicoes);
  };

  // Buscar cuidadores da família
  const fetchCuidadores = async () => {
    try {
      const res = await cuidadorAPI.getByFamily(currentFamily.id);
      if (res.data.status === 'sucesso') {
        setCuidadores(res.data.cuidadores);
      }
    } catch (error) {
      // Erro ao buscar cuidadores
    }
  };

  const toggleSecao = (secao) => {
    setSecoesAbertas(prev => ({
      ...prev,
      [secao]: !prev[secao]
    }));
  };

  const toggleCondicao = (condicao) => {
    setCondicoesSelecionadas((prev) =>
      prev.includes(condicao)
        ? prev.filter((c) => c !== condicao)
        : [...prev, condicao]
    );
  };

  const adicionarCondicaoPersonalizada = () => {
    if (outraCondicao.trim()) {
      toggleCondicao(outraCondicao.trim());
      setOutraCondicao('');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      if (prev[field] === value) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const selecionarCuidador = (cuidador) => {
    setCuidadorSelecionado(cuidador);
    setFormData(prev => ({
      ...prev,
      contatoEmergenciaNome: cuidador.nome,
      contatoEmergenciaTelefone: cuidador.telefone
    }));
    setMostrarCuidadores(false);
  };



  const handleSubmit = async () => {
    if (!formData.nome || !formData.idade || !formData.sexo || !formData.altura || !formData.peso) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }
    if (!formData.senha || formData.senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }
    if (!currentFamily) {
      Alert.alert('Erro', 'Nenhuma família selecionada');
      return;
    }
    if (!cuidadorSelecionado) {
      Alert.alert('Erro', 'Selecione um responsável principal para o idoso');
      return;
    }
    const condicoesValidas = condicoesSelecionadas.filter(condicao => condicao !== 'Outras');
    if (condicoesValidas.length === 0 && !outraCondicao.trim()) {
      Alert.alert('Aviso', 'É recomendado informar pelo menos uma condição médica');
      return;
    }
    setLoading(true);
    try {
      let condicoesFinal = condicoesSelecionadas.filter(condicao => condicao !== 'Outras');
      
      // Adicionar condição personalizada se existir
      if (outraCondicao.trim()) {
        condicoesFinal = [...condicoesFinal, outraCondicao.trim()];
      }
      
      const idosoData = {
        ...formData,
        familiaId: currentFamily.id,
        condicoes: condicoesFinal,
        responsavelPrincipalId: cuidadorSelecionado.id
      };

      const res = await idosoAPI.add(idosoData);
      
      if (res.data.status === 'sucesso') {
        Alert.alert('Sucesso', 'Idoso cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('HomeCuidador')
          }
        ]);
      } else {
        Alert.alert('Erro', res.data.mensagem || 'Erro ao cadastrar idoso');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar idoso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.replace('HomeCuidador');
  };

  const irParaBuscarCuidadores = () => {
    navigation.navigate('CadastroCuidador');
  };

  // Verificar se há cuidadores na família
  const temCuidadores = cuidadores.length > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoVoltar} onPress={handleBack}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.titulo}>Cadastro de Idoso</Text>
        <Text style={styles.subtitulo}>Família: {currentFamily?.nome}</Text>
        
        {!temCuidadores && (
          <View style={styles.avisoContainer}>
            <Ionicons name="warning" size={48} color="#f39c12" />
            <Text style={styles.avisoTitulo}>Nenhum cuidador na família</Text>
            <Text style={styles.avisoTexto}>
              Para cadastrar um idoso, você precisa primeiro adicionar cuidadores à família.
            </Text>
            <TouchableOpacity 
              style={styles.botaoBuscarCuidadores}
              onPress={irParaBuscarCuidadores}
            >
              <Ionicons name="person-add" size={20} color="#fff" />
              <Text style={styles.textoBotao}>Buscar Cuidadores</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {temCuidadores && (
          <View style={styles.formBox}>
            {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
            <SecaoColapsavel
              titulo="📋 Informações Básicas"
              aberta={secoesAbertas.informacoesBasicas}
              onToggle={() => toggleSecao('informacoesBasicas')}
            >
              <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={(text) => {
                  if (formData.nome !== text) {
                    handleChange('nome', text);
                  }
                }}
                placeholder="Nome completo *"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
              
              <TextInput
                style={styles.input}
                value={formData.idade}
                onChangeText={(text) => {
                  if (formData.idade !== text) {
                    handleChange('idade', text);
                  }
                }}
                placeholder="Idade *"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              
              <Text style={styles.label}>Sexo *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => handleChange('sexo', 'Masculino')}
                >
                  <View style={[styles.radio, formData.sexo === 'Masculino' && styles.radioSelected]}>
                    {formData.sexo === 'Masculino' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>Masculino</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => handleChange('sexo', 'Feminino')}
                >
                  <View style={[styles.radio, formData.sexo === 'Feminino' && styles.radioSelected]}>
                    {formData.sexo === 'Feminino' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>Feminino</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => handleChange('sexo', 'Outro')}
                >
                  <View style={[styles.radio, formData.sexo === 'Outro' && styles.radioSelected]}>
                    {formData.sexo === 'Outro' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>Outro</Text>
                </TouchableOpacity>
              </View>
            </SecaoColapsavel>

            {/* SEÇÃO 2: DADOS FÍSICOS */}
            <SecaoColapsavel
              titulo="📏 Dados Físicos"
              aberta={secoesAbertas.dadosFisicos}
              onToggle={() => toggleSecao('dadosFisicos')}
            >
              <TextInput
                style={styles.input}
                value={formData.altura}
                onChangeText={(text) => {
                  if (formData.altura !== text) {
                    handleChange('altura', text);
                  }
                }}
                placeholder="Altura (cm) *"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
              
              <TextInput
                style={styles.input}
                value={formData.peso}
                onChangeText={(text) => {
                  if (formData.peso !== text) {
                    handleChange('peso', text);
                  }
                }}
                placeholder="Peso (kg) *"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
              
              <MaskedTextInput
                style={styles.input}
                value={formData.carteiraSUS}
                onChangeText={(text) => {
                  if (formData.carteiraSUS !== text) {
                    handleChange('carteiraSUS', text);
                  }
                }}
                placeholder="Carteira SUS"
                placeholderTextColor="#999"
                mask="000000000000000"
                keyboardType="numeric"
              />
            </SecaoColapsavel>

            {/* SEÇÃO 3: CONTATOS */}
            <SecaoColapsavel
              titulo="📞 Contatos"
              aberta={secoesAbertas.contatos}
              onToggle={() => toggleSecao('contatos')}
            >
              <MaskedTextInput
                style={styles.input}
                value={formData.telefone}
                onChangeText={(text) => {
                  if (formData.telefone !== text) {
                    handleChange('telefone', text);
                  }
                }}
                placeholder="Telefone do idoso"
                placeholderTextColor="#999"
                mask="(99) 99999-9999"
                keyboardType="phone-pad"
              />
              
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => {
                  if (formData.email !== text) {
                    handleChange('email', text);
                  }
                }}
                placeholder="Email do idoso"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </SecaoColapsavel>

            {/* SEÇÃO 4: DADOS DE LOGIN */}
            <SecaoColapsavel
              titulo="🔐 Dados de Login"
              aberta={secoesAbertas.dadosLogin}
              onToggle={() => toggleSecao('dadosLogin')}
            >
              <Text style={styles.label}>Crie uma senha para o idoso acessar o app *</Text>
              <TextInput
                style={styles.input}
                value={formData.senha}
                onChangeText={(text) => {
                  if (formData.senha !== text) {
                    handleChange('senha', text);
                  }
                }}
                placeholder="Senha (mínimo 6 caracteres) *"
                placeholderTextColor="#999"
                secureTextEntry
              />
              
              <TextInput
                style={styles.input}
                value={formData.confirmarSenha}
                onChangeText={(text) => {
                  if (formData.confirmarSenha !== text) {
                    handleChange('confirmarSenha', text);
                  }
                }}
                placeholder="Confirmar senha *"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </SecaoColapsavel>

            {/* SEÇÃO 5: RESPONSÁVEL PRINCIPAL */}
            <SecaoColapsavel
              titulo="👤 Responsável Principal"
              aberta={secoesAbertas.responsavelPrincipal}
              onToggle={() => toggleSecao('responsavelPrincipal')}
            >
              <Text style={styles.label}>Selecione o responsável principal *</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setMostrarCuidadores(!mostrarCuidadores)}
              >
                <Text style={styles.selectorButtonText}>
                  {cuidadorSelecionado ? cuidadorSelecionado.nome : 'Selecione um cuidador'}
                </Text>
                <Ionicons name={mostrarCuidadores ? 'chevron-up' : 'chevron-down'} size={20} color="#2E86C1" />
              </TouchableOpacity>
              
              {mostrarCuidadores && (
                <View style={styles.cuidadoresList}>
                  {cuidadores.map((cuidador) => (
                    <TouchableOpacity
                      key={cuidador.id}
                      style={styles.cuidadorItem}
                      onPress={() => selecionarCuidador(cuidador)}
                    >
                      <Text style={styles.cuidadorNome}>{cuidador.nome}</Text>
                      <Text style={styles.cuidadorTelefone}>{cuidador.telefone}</Text>
                    </TouchableOpacity>
                  ))}
                  

                </View>
              )}
              
              {cuidadorSelecionado && (
                <View style={styles.cuidadorSelecionado}>
                  <Text style={styles.cuidadorSelecionadoLabel}>Responsável selecionado:</Text>
                  <Text style={styles.cuidadorSelecionadoNome}>{cuidadorSelecionado.nome}</Text>
                  <Text style={styles.cuidadorSelecionadoTelefone}>{cuidadorSelecionado.telefone}</Text>
                </View>
              )}
            </SecaoColapsavel>

            {/* SEÇÃO 6: CONDIÇÕES MÉDICAS */}
            <SecaoColapsavel
              titulo="🏥 Condições Médicas"
              aberta={secoesAbertas.condicoesMedicas}
              onToggle={() => toggleSecao('condicoesMedicas')}
            >
              <Text style={styles.label}>Selecione as condições médicas:</Text>
              {condicoesDisponiveis.map((condicao) => (
                <TouchableOpacity
                  key={condicao}
                  style={styles.checkboxRow}
                  onPress={() => toggleCondicao(condicao)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, condicoesSelecionadas.includes(condicao) && styles.checkboxChecked]}>
                    {condicoesSelecionadas.includes(condicao) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{condicao}</Text>
                </TouchableOpacity>
              ))}
              
              {/* Campo para cadastrar outra condição */}
              <View style={styles.outraCondicaoContainer}>
                <Text style={styles.outraCondicaoLabel}>Cadastrar outra condição:</Text>
                <View style={styles.outraCondicaoRow}>
                  <TextInput
                    style={styles.outraCondicaoInput}
                    value={outraCondicao}
                    onChangeText={(text) => {
                      if (outraCondicao !== text) {
                        setOutraCondicao(text);
                      }
                    }}
                    placeholder="Digite a condição médica"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    onSubmitEditing={adicionarCondicaoPersonalizada}
                    returnKeyType="done"
                  />
                  {outraCondicao.trim() && (
                    <TouchableOpacity
                      style={styles.addOutraCondicaoButton}
                      onPress={adicionarCondicaoPersonalizada}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              {/* Mostrar condições personalizadas adicionadas */}
              {condicoesSelecionadas.filter(c => !condicoesDisponiveis.includes(c)).length > 0 && (
                <View style={styles.condicoesPersonalizadasContainer}>
                  <Text style={styles.condicoesPersonalizadasLabel}>Condições adicionadas:</Text>
                  {condicoesSelecionadas.filter(c => !condicoesDisponiveis.includes(c)).map((condicao) => (
                    <TouchableOpacity
                      key={condicao}
                      style={styles.checkboxRow}
                      onPress={() => toggleCondicao(condicao)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.checkbox, styles.checkboxChecked]}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                      <Text style={[styles.checkboxLabel, styles.condicaoPersonalizada]}>{condicao}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </SecaoColapsavel>
            
            <TouchableOpacity 
              style={[styles.botao, loading && styles.botaoDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.textoBotao}>
                {loading ? 'Cadastrando...' : 'Cadastrar Idoso'}
              </Text>
            </TouchableOpacity>
            
            <View style={{ height: 40 }} />
          </View>
        )}
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 48,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: '5%',
    paddingVertical: 20,
    minHeight: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  botaoVoltar: {
    backgroundColor: '#2E86C1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  avisoContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  avisoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  avisoTexto: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  botaoBuscarCuidadores: {
    backgroundColor: '#2E86C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBox: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  secaoContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#e3f2fd',
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  secaoConteudo: {
    padding: 20,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#f1f1f1',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 15,
    color: '#333',
  },
  botao: {
    backgroundColor: '#2E86C1',
    width: '100%',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  botaoDisabled: {
    backgroundColor: '#B0BEC5',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2E86C1',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
  },
  outraCondicaoContainer: {
    marginBottom: 8,
    paddingVertical: 4,
  },
  outraCondicaoLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  outraCondicaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outraCondicaoInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f1f1f1',
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  addOutraCondicaoButton: {
    backgroundColor: '#2E86C1',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  condicoesPersonalizadasContainer: {
    marginBottom: 8,
    paddingVertical: 4,
  },
  condicoesPersonalizadasLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  condicaoPersonalizada: {
    fontStyle: 'italic',
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
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  selectorButtonText: {
    fontSize: 16,
    color: '#333',
  },
  cuidadoresList: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cuidadorItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cuidadorNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cuidadorTelefone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  cuidadorSelecionado: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cuidadorSelecionadoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cuidadorSelecionadoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  cuidadorSelecionadoTelefone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

});