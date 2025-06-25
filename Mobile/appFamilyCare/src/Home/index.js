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
  const handleCadastrarIdoso = () => {
    navigation.replace('CadastrarIdoso');
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
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastrarIdoso}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="person-add-outline"
              size={28}
              color="#4CAF50"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cadastrarText}>Cadastrar Idoso</Text>
          </View>
        </TouchableOpacity>

        <View>
          <TouchableOpacity style={styles.Framelinks} onPress={handleInforma}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.alertaText}>Cláudio</Text>
              <Ionicons
                name="warning-outline"
                size={28}
                color="#ff0000"
                style={{ marginLeft: 8 }}
              />
            </View>
          </TouchableOpacity>

          <View>
            <TouchableOpacity style={styles.Framelinks} onPress={handleInforma}>
              <Text>Informações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Framelinks} onPress={handleMedi}>
              <Text>Medicamentos</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  cadastrarButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4CAF50",
    width: 200,
    alignItems: "center",
    marginBottom: 10,
  },
  cadastrarText: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
  },
  tituloCuidadores: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textoCuidadores: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  alertaLink: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ff0000",
    width: 200,
    alignItems: "center",
    marginBottom: 10,
  },
  alertaText: {
    color: "#ff0000",
    fontSize: 18,
    fontWeight: "bold",
  },
  Framelinks: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4CAF50",
    width: 200,
    alignItems: "center",
    marginBottom: 10,
  },
  linkText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  NomeCuidador: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  parteIdoso: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parteCuidadores: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
