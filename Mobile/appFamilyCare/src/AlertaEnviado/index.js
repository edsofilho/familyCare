import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

export default function AlertaEnviado({ navigation, route }) {
  const { user } = useUser();

  const handleVoltar = () => {
    if (route.params && route.params.idoso) {
      navigation.replace("HomeIdoso", { idoso: route.params.idoso });
    } else {
      navigation.replace("HomeIdoso");
    }
  };

  const handleVerAlertas = () => {
    if (route.params && route.params.idoso) {
      navigation.replace("Alertas", { 
        idoso: route.params.idoso,
        userType: 'idoso'
      });
    } else {
      navigation.replace("Alertas");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#27AE60" />
      </View>
      
      <Text style={styles.titulo}>Alerta Enviado!</Text>
      <Text style={styles.mensagem}>
        Seu alerta de SOS foi enviado com sucesso para os cuidadores.
      </Text>
      
      <Text style={styles.submensagem}>
        Eles foram notificados e devem entrar em contato em breve.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.botaoSecundario} onPress={handleVerAlertas}>
          <Ionicons name="alert-circle-outline" size={24} color="#2E86C1" />
          <Text style={styles.botaoSecundarioTexto}>Ver Alertas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botao} onPress={handleVoltar}>
          <Text style={styles.botaoTexto}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#27AE60",
    marginBottom: 20,
    textAlign: "center",
  },
  mensagem: {
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
    lineHeight: 24,
  },
  submensagem: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  botaoSecundario: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
  },
  botaoSecundarioTexto: {
    color: "#2E86C1",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  botao: {
    backgroundColor: "#EC1C24",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
