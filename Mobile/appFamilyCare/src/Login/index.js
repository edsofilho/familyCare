import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import axios from "axios";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Erro", "Preencha todos os campos");
      return;
    }
    try {
      const res = await axios.post(
        "http://10.68.36.109/3mtec/apireact/login.php",
        { email: email, senha: senha }
      );

      if (res.data.status === "sucesso") {
        const tipo = res.data.tipo;
        const nome = res.data.nome;

        alert("Bem-Vindo", `Olá, ${nome}`);

        if (tipo === "usuario") {
          navigation.replace("Home");
        } else if (tipo === "idoso") {
          navigation.replace("HomeIdoso");
        }
      }
    } catch (error) {
      alert("Erro de conexão", error.message);
    }
  };

  const handleCadastro = () => {
    navigation.replace("Cadastro");
  };
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
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
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCadastro}>
        <Text style={styles.linkCadastro}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 30,
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
});
