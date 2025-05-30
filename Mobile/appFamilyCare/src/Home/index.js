import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home({ navigation }) {
  const handleLogout = () => {
    navigation.replace("Login");
  };
  const handleInforma = () => {
    navigation.replace("Informa");
  };
  const handleAlertas = () => {
    navigation.replace("Alertas");
  };
  const handleMedi = () => {
    navigation.replace("Medi");
  };
  const handleDoencas = () => {
    navigation.replace("Doencas");
  };
  
  // const handleTratamentos = () => {
  //   navigation.replace('Tratamentos');
  // };
  // const handleHistorico = () => {
  //   navigation.replace('Historico');
  // };

  return (
    <View style={styles.container}>
      <View style={styles.parteIdoso}>
        <Text style={styles.NomeCuidador}>Olá, Getulio</Text>
        <TouchableOpacity style={styles.alertaLink} onPress={handleAlertas}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.alertaText}>Cláudio</Text>
            <Ionicons
              name="warning-outline"
              size={28}
              color="#ff0000"
              style={{ marginLeft: 8 }}
            />
          </View>

          <View>
            <TouchableOpacity style={styles.Framelinks} onPress={handleInforma}>
              <Text>Informações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Framelinks} onPress={handleMedi}>
              <Text>Medicamentos</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.Framelinks} onPress={handleDoencas}>
              <Text>Doenças</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.parteCuidadores}>
        <Text style={styles.tituloCuidadores}>Cuidadores:</Text>
        <Text style={styles.textoCuidadores}>Getulio</Text>
        <Text style={styles.textoCuidadores}>Ramon</Text>
        <Text style={styles.textoCuidadores}>Eunice</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
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
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  NomeCuidador: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  parteIdoso: {
    width: "90%",
    padding: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 20,
  },
  Framelinks: {
    backgroundColor: "#2E86C1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  parteCuidadores: {
    width: "90%",
    backgroundColor: "#dff0f7",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  textoCuidadores: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  alertaLink: {
    marginVertical: 1,
    // alignItems: 'center',
  },
  alertaText: {
    color: "#ff0000",
    fontSize: 30,
    fontWeight: "bold",
  },
  tituloCuidadores: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
