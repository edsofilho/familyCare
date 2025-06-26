import React, { useState, useEffect } from "react"; // Adicionando os imports necessários
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function Alerta({ navigation }) {
  const [alertas, setAlertas] = useState([]); // Definindo o estado para os alertas

  useEffect(() => {
    listarAlertas();
  }, []); // Carrega os alertas quando o componente for montado

  async function listarAlertas() {
    try {
      const res = await axios.get(
        "http://10.68.36.109/3mtec/apireact/listarAlertas.php"
      );
      if (res.data && res.data.alertas) {
        setAlertas(res.data.alertas);
      } else {
        Alert.alert("Erro", "Não foi possível carregar os alertas");
      }
    } catch (error) {
      console.error("Erro ao listar alertas:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor. Verifique sua conexão.");
    }
  }
  const handleHome = () => {
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={handleHome}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {alertas.length > 0 ? (
          alertas.map((alerta) => (
            <View key={alerta.id} style={styles.alerta}>
              <Text style={styles.alertaText}>Idoso: {alerta.nomeIdoso}</Text>
              <Text style={styles.alertaText}>Tipo: {alerta.tipo}</Text>
              <Text style={styles.alertaText}>Data: {alerta.dataQueda}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.semAlertas}>Nenhum alerta encontrado.</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.botaoAtualizar} onPress={listarAlertas}><Text style={styles.textoBotao}>Atualizar</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  alerta: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    width: "100%",
  },
  alertaText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },
  semAlertas: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  botaoVoltar: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: "#2E86C1",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  botaoAtualizar: {
    flexDirection: 'row',
    backgroundColor: '#2E86C1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoVoltar: {
    backgroundColor: "#2E86C1",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },

});
