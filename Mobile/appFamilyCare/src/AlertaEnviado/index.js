import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AlertaEnviado({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.mensagem}>🚨 Alerta enviado com sucesso!</Text>
      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.replace("HomeIdoso")}
      >
        <Text style={styles.botaoTexto}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  mensagem: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#EC1C24",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 18,
  },
});
