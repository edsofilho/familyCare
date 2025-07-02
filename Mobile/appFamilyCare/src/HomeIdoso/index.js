import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

const HomeIdoso = ({ navigation }) => {
  const { user } = useUser();
  const [alertaAtivo, setAlertaAtivo] = useState(false);
  const [corDeFundo, setCorDeFundo] = useState("#fff");
  const [contador, setContador] = useState(5);
  const [intervalId, setIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [contadorIntervalId, setContadorIntervalId] = useState(null);
  const [familia, setFamilia] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
      navigation.navigate('Login');
      return;
    }
    
    // Buscar informações da família do idoso
    buscarFamilia();
  }, [user, navigation]);

  const buscarFamilia = async () => {
    try {
      const response = await api.post('/getFamiliaIdoso.php', { idosoId: user.id });
      if (response.data.success) {
        setFamilia(response.data.familia);
      }
    } catch (error) {
      // Se não conseguir buscar a família, não exibe erro
    }
  };

  const limparTimers = () => {
    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);
    if (contadorIntervalId) clearInterval(contadorIntervalId);
    setIntervalId(null);
    setTimeoutId(null);
    setContadorIntervalId(null);
  };

  const handleConectarColeteCare = () => {
    navigation.navigate("ConectarColeteCare");
  };

  const handleInformacoes = () => {
    if (user) {
      navigation.navigate("Informacoes", { 
        idoso: user,
        userType: 'idoso'
      });
    } else {
      Alert.alert('Erro', 'Dados do idoso não disponíveis');
    }
  };

  const handleMedicamentos = () => {
    if (user) {
      navigation.navigate("Medicacao", { 
        idoso: user,
        userType: 'idoso'
      });
    } else {
      Alert.alert('Erro', 'Dados do idoso não disponíveis');
    }
  };

  const iniciarAlerta = () => {
    if (!user) {
      Alert.alert('Erro', 'Dados do idoso não disponíveis');
      return;
    }

    setAlertaAtivo(true);
    setContador(5);
    setCorDeFundo("#fff");

    // Efeito de piscar
    const intervalo = setInterval(() => {
      setCorDeFundo((prev) => (prev === "#fff" ? "#ec1c24" : "#fff"));
    }, 500);
    setIntervalId(intervalo);

    // Contador regressivo
    const contagem = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(contagem);
          pararAlerta();
          enviarAlerta();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setContadorIntervalId(contagem);

    // Timeout de segurança
    const timeout = setTimeout(() => {
      clearInterval(contagem);
      pararAlerta();
      enviarAlerta();
    }, 5000);
    setTimeoutId(timeout);
  };

  const pararAlerta = () => {
    setAlertaAtivo(false);
    setCorDeFundo("#fff");
    setContador(5);
    limparTimers();
  };

  const enviarAlerta = async () => {
    try {
      if (!user) {
        Alert.alert('Erro', 'Dados do idoso não disponíveis');
        return;
      }
      const alertData = {
        id_idoso: user.id,
        tipo_alerta: 'SOS',
        descricao: 'Alerta de emergência enviado pelo idoso'
      };
      const response = await api.post('/addAlerta.php', alertData);
      if (response.data.success) {
        navigation.navigate('Informacoes', { 
          idoso: user, 
          userType: 'idoso' 
        });
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao enviar alerta');
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Erro ao enviar alerta. Verifique sua conexão e tente novamente.'
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const corTextoDinamico = corDeFundo === "#ec1c24" ? "#fff" : "#ec1c24";

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: corDeFundo }]}>
      <StatusBar barStyle={alertaAtivo ? "light-content" : "dark-content"} />
      
      {/* Header */}
      {!alertaAtivo && user && (
        <View style={styles.header}>
          <Text style={styles.NomeCuidador}>Olá, {user.nome}</Text>
          {familia && (
            <View style={styles.familiaContainer}>
              <Text style={styles.familiaNome}>{familia.nome}</Text>
            </View>
          )}
        </View>
      )}

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Botão SOS ou Contagem */}
        {!alertaAtivo ? (
          <View style={styles.sosContainer}>
            <TouchableOpacity style={styles.sosButton} onPress={iniciarAlerta}>
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubtext}>Toque para enviar alerta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.alertaContainer}>
            <Text style={[styles.contagem, { color: corTextoDinamico }]}>
              Enviando alerta em {contador} segundo{contador !== 1 ? "s" : ""}...
            </Text>
            <TouchableOpacity style={styles.cancelarButton} onPress={pararAlerta}>
              <Text style={styles.cancelarText}>Cancelar Alerta</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu de opções */}
        {!alertaAtivo && (
          <View style={styles.menuContainer}>
            <View style={styles.menuButtons}>
              <TouchableOpacity style={styles.menuButton} onPress={handleInformacoes}>
                <Ionicons name="information-circle-outline" size={24} color="#fff" />
                <Text style={styles.menuButtonText}>Informações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={handleMedicamentos}>
                <Ionicons name="medkit-outline" size={24} color="#fff" />
                <Text style={styles.menuButtonText}>Medicamentos</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.conectarButton} onPress={handleConectarColeteCare}>
              <View style={styles.buttonContent}>
                <Ionicons name="bluetooth-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Conectar ColeteCare</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sairButton} onPress={handleLogout}>
              <View style={styles.buttonContent}>
                <Ionicons name="exit-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Sair</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  sosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sosButton: {
    backgroundColor: "#EC1C24",
    paddingVertical: 60,
    paddingHorizontal: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sosText: {
    color: "#fff",
    fontSize: 80,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sosSubtext: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  alertaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contagem: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  cancelarButton: {
    backgroundColor: "#555",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  cancelarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: "#2E86C1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 90,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  conectarButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sairButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
});

export default HomeIdoso;
