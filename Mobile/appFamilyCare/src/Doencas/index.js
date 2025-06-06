import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Doencas({ navigation }) {
  const [doencas, setDoencas] = useState([
    { id: "1", nome: "Hipertensão" },
    { id: "2", nome: "Diabetes Tipo 2" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [novaDoenca, setNovaDoenca] = useState("");

  const adicionarDoenca = () => {
    if (novaDoenca.trim() !== "") {
      const nova = {
        id: Date.now().toString(),
        nome: novaDoenca,
      };
      setDoencas([...doencas, nova]);
      setNovaDoenca("");
      setModalVisible(false);
    }
  };

  const handleVoltar = () => {
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={handleVoltar}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Doenças Registradas</Text>

      <FlatList
        data={doencas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.nome}>{item.nome}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle" size={50} color="#2E86C1" />
      </TouchableOpacity>

      {/* Modal de nova doença */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Doença</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da doença"
              value={novaDoenca}
              onChangeText={setNovaDoenca}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={adicionarDoenca}
            >
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  nome: {
    fontSize: 18,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#2E86C1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelar: {
    color: "#555",
    textAlign: "center",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  botaoVoltar: {
    backgroundColor: "#2E86C1",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
});
