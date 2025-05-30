import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

export default function Medi({ navigation }) {
  const [remedios, setRemedios] = useState([
    { id: "1", nome: "Paracetamol", horario: "08:00", tomado: false },
    { id: "2", nome: "Losartana", horario: "12:00", tomado: false },
  ]);

  const onChangeHora = (event, selectedDate) => {
    setMostrarRelogio(false);
    if (selectedDate) {
      setHoraSelecionada(selectedDate);
      const hora = selectedDate.getHours().toString().padStart(2, "0");
      const minuto = selectedDate.getMinutes().toString().padStart(2, "0");
      setNovoHorario(`${hora}:${minuto}`);
    }
  };

  const [mostrarRelogio, setMostrarRelogio] = useState(false);
  const [horaSelecionada, setHoraSelecionada] = useState(new Date());

  const handleVoltar = () => {
    navigation.replace("Home");
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoHorario, setNovoHorario] = useState("");

  const toggleTomado = (id) => {
    const novos = remedios.map((r) =>
      r.id === id ? { ...r, tomado: !r.tomado } : r
    );
    setRemedios(novos);
  };

  const adicionarRemedio = () => {
    if (novoNome.trim() && novoHorario.trim()) {
      const novo = {
        id: Date.now().toString(),
        nome: novoNome,
        horario: novoHorario,
      };
      fetch("http://10.68.36.109/3mtec/apireact/addRemedio.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novo),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.status === "sucesso") {
            const novoComId = {
              id: Date.now().toString(),
              ...novo,
              tomado: false,
            };
            setRemedios([...remedios, novoComId]);
            setNovoNome("");
            setNovoHorario("");
            setModalVisible(false);
          }
          else {
            alert(json.mensagem || "Erro ao salvar remédio");
          }
        })
        .catch((error) => {
          alert("Erro de conexão: " + error.message);
        });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.nomeRemedio}>{item.nome}</Text>
        <Text style={styles.horario}>Horário: {item.horario}</Text>
      </View>
      <Checkbox
        value={item.tomado}
        onValueChange={() => toggleTomado(item.id)}
        tintColors={{ true: "#2E86C1", false: "#aaa" }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={handleVoltar}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.titulo}>Medicamentos do dia</Text>

      <FlatList
        data={remedios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle" size={50} color="#2E86C1" />
      </TouchableOpacity>

      {/* Modal de cadastro de novo remédio */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Remédio</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do remédio"
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <TouchableOpacity
              onPress={() => setMostrarRelogio(true)}
              style={styles.input}
            >
              <Text
                style={{ fontSize: 16, color: novoHorario ? "#000" : "#888" }}
              >
                {novoHorario || "Selecione o horário"}
              </Text>
            </TouchableOpacity>
            {mostrarRelogio && (
              <DateTimePicker
                value={horaSelecionada}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeHora}
              />
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={adicionarRemedio}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nomeRemedio: {
    fontSize: 18,
    fontWeight: "bold",
  },
  horario: {
    fontSize: 16,
    color: "#555",
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
  botaoVoltar: {
    top: 40,
    left: 20,
    backgroundColor: "#2E86C1",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
