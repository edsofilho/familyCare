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
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastrarIdoso}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="person-add-outline"
              size={28}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cadastrarText}>Cadastrar Idoso</Text>
          </View>
        </TouchableOpacity>

        <View>

          <View>
            <TouchableOpacity style={styles.Framelinks} onPress={handleInforma}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="information-circle-outline"
                  size={28}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
              
              <Text style={styles.linkText}>Informações</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Framelinks} onPress={handleMedi}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="medkit-outline"
                  size={28}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.linkText}>Medicamentos</Text>
              </View>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 30,
  },

  parteIdoso: {
    alignItems: "center",
    width: "100%",
  },

  NomeCuidador: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },

  alertaLink: {
    backgroundColor: "#2980B9",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 220,
    alignItems: "center",
    marginBottom: 12,
  },

  alertaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  cadastrarButton: {
    backgroundColor: "#2E86C1",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 220,
    alignItems: "center",
    marginBottom: 12,
  },

  cadastrarText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  Framelinks: {
    backgroundColor: "#2E86C1",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 220,
    alignItems: "center",
    marginBottom: 12,
  },

  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  parteCuidadores: {
    backgroundColor: "#D6EAF8",
    width: "90%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  tituloCuidadores: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#154360",
  },

  textoCuidadores: {
    fontSize: 16,
    marginBottom: 4,
    color: "#34495E",
  },

  logoutButton: {
    backgroundColor: "#C0392B",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 4,
    marginBottom: 10,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
