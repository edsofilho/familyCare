import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { useUser } from '../context/UserContext';
import { authAPI } from '../../services/api';
import notificationService from '../services/notificationService';

export default function Login({ navigation }) {
  const userContext = useUser();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoLogin, setTipoLogin] = useState("cuidador"); // "cuidador" ou "idoso"

  const handleLogin = useCallback(async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    try {
      let res;
      if (tipoLogin === "idoso") {
        res = await authAPI.loginIdoso(email, senha);
      } else {
        res = await authAPI.login(email, senha);
      }
      if (res.data.success || res.data.status === "sucesso") {
        const userData = {
          id: res.data.id || res.data.user?.id,
          nome: res.data.nome || res.data.user?.nome,
          email: res.data.email || res.data.user?.email,
          telefone: res.data.telefone || res.data.user?.telefone,
          tipo: res.data.tipo || res.data.user?.tipo,
          idade: res.data.idade || res.data.user?.idade,
          sexo: res.data.sexo || res.data.user?.sexo,
          altura: res.data.altura || res.data.user?.altura,
          peso: res.data.peso || res.data.user?.peso,
          condicoes: res.data.condicoes || res.data.user?.condicoes
        };
        if (userContext && userContext.login) {
          userContext.login(userData);
          if ((res.data.familia || res.data.user?.familia) && userContext.setFamily) {
            const familia = res.data.familia || res.data.user?.familia;
            userContext.setFamily(familia);
          }
          
          // Registrar token de notificação após login bem-sucedido
          try {
            const token = await notificationService.registerForPushNotificationsAsync();
            if (token) {
              await notificationService.sendTokenToServer(userData.id, userData.tipo);
            }
          } catch (error) {
            console.error('Erro ao registrar notificações:', error);
          }
          
          Alert.alert("Bem-Vindo", `Olá, ${userData.nome}`);
          if (userData.tipo === "idoso") {
            const idosoData = {
              id: userData.id,
              nome: userData.nome,
              email: userData.email,
              telefone: userData.telefone,
              idade: userData.idade,
              sexo: userData.sexo,
              altura: userData.altura,
              peso: userData.peso,
              condicoes: userData.condicoes || []
            };
            navigation.replace("HomeIdoso", { idoso: idosoData });
          } else {
            navigation.replace("HomeCuidador");
          }
        } else {
          Alert.alert("Erro", "Problema com o contexto do usuário");
        }
      } else {
        Alert.alert("Erro", res.data.message || res.data.mensagem || "Usuário ou senha inválidos");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", "Erro ao conectar com o servidor");
    }
  }, [email, senha, tipoLogin, userContext, navigation]);

  const handleCadastro = () => {
    navigation.replace("Cadastro");
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      {/* Seletor de tipo de login */}
      <View style={styles.tipoLoginContainer}>
        <TouchableOpacity 
          style={[styles.tipoLoginButton, tipoLogin === "cuidador" && styles.tipoLoginButtonActive]}
          onPress={() => setTipoLogin("cuidador")}
        >
          <Text style={[styles.tipoLoginText, tipoLogin === "cuidador" && styles.tipoLoginTextActive]}>
            Cuidador
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tipoLoginButton, tipoLogin === "idoso" && styles.tipoLoginButtonActive]}
          onPress={() => setTipoLogin("idoso")}
        >
          <Text style={[styles.tipoLoginText, tipoLogin === "idoso" && styles.tipoLoginTextActive]}>
            Idoso
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        placeholderTextColor="#999"
      ></TextInput>
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>
          Entrar como {tipoLogin === "idoso" ? "Idoso" : "Cuidador"}
        </Text>
      </TouchableOpacity>
      {tipoLogin === "cuidador" && (
        <TouchableOpacity onPress={handleCadastro}>
          <Text style={styles.linkCadastro}>Cadastrar</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 48,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
    minHeight: '100%',
  },
  text: {
    fontSize: 24,
  },
  logo: {
    width: 200,
    height: 200,
    alignItems: "center",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  botao: {
    backgroundColor: "#2E86C1",
    width: "100%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkCadastro: {
    marginTop: 20,
    color: "#2E86C1",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  tipoLoginContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tipoLoginButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoLoginButtonActive: {
    backgroundColor: '#2E86C1',
  },
  tipoLoginText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipoLoginTextActive: {
    color: '#fff',
  },
});
