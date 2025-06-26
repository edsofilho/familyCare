import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeIdoso({ navigation }) {
  const [alertaAtivo, setAlertaAtivo] = useState(false);
  const [corDeFundo, setCorDeFundo] = useState("#fff");
  const [contador, setContador] = useState(5);
  const [intervalId, setIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [contadorIntervalId, setContadorIntervalId] = useState(null);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      if (contadorIntervalId) clearInterval(contadorIntervalId);
    };
  }, [intervalId, timeoutId, contadorIntervalId]);

  const handleConectarColeteCare = () => {
    navigation.replace("ConectarColeteCare");
  };

  const iniciarAlerta = () => {
    setAlertaAtivo(true);
    setContador(5);



    const intervalo = setInterval(() => {
      setCorDeFundo((prev) => (prev === "#fff" ? "#ec1c24" : "#fff"));
    }, 500);
    setIntervalId(intervalo);

    const contagem = setInterval(() => {
      setContador((prev) => prev - 1);
    }, 1000);
    setContadorIntervalId(contagem);

    const timeout = setTimeout(() => {
      clearInterval(contagem);
      pararAlerta();
      enviarAlerta();
    }, 5000);
    setTimeoutId(timeout);
  };

  const pararAlerta = () => {
    setAlertaAtivo(false);
    setCorDeFundo("#fff");
    setContador(5);
    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);
    if (contadorIntervalId) clearInterval(contadorIntervalId);
    setIntervalId(null);
    setTimeoutId(null);
    setContadorIntervalId(null);
  };

  const enviarAlerta = () => {
    try {
      const dataAtual = new Date();
      // Formata a data para o formato dd/mm/yyyy HH:mm:ss
      const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      fetch("http://10.68.36.109/3mtec/apireact/addAlerta.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          nomeIdoso: "João da Silva",
          tipo: "Queda",
          dataQueda: dataFormatada,
          localizacao: "Local não especificado",
          descricao: "Alerta de SOS ativado pelo idoso"
        }),
        timeout: 10000 // 10 segundos de timeout
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          if (json.sucesso) {
            navigation.replace("AlertaEnviado");
          } else {
            Alert.alert(
              "Erro",
              `Erro ao salvar o alerta:\n${json.mensagem || "Erro desconhecido"}`
            );
          }
        })
        .catch((error) => {
          console.error('Erro:', error);
          Alert.alert(
            "Erro",
            "Erro ao salvar o alerta. Por favor, verifique:\n" +
            "- Sua conexão com a internet\n" +
            "- Se o servidor está rodando\n" +
            "- Se o banco de dados está acessível\n" +
            "Detalhes: " + error.message
          );
        });
    } catch (error) {
      console.error('Erro interno:', error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
      );
    }
  };

  const corTextoDinamico = corDeFundo === "#ec1c24" ? "#fff" : "#ec1c24";

  return (
    <View style={[styles.container, { backgroundColor: corDeFundo }]}>
      {!alertaAtivo ? (
        <TouchableOpacity style={styles.sosButton} onPress={iniciarAlerta}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={[styles.contagem, { color: corTextoDinamico }]}>
            Enviando alerta em {contador} segundo{contador !== 1 ? "s" : ""}...
          </Text>
          <TouchableOpacity style={styles.cancelarButton} onPress={pararAlerta}>
            <Text style={styles.cancelarText}>Cancelar Alerta</Text>
          </TouchableOpacity>
        </>
      )}
      {!alertaAtivo && (
        <View style={{ position: 'absolute', bottom: 30, width: '100%', alignItems: 'center' }}>
          <TouchableOpacity style={styles.conectarButton} onPress={() => navigation.replace('ConectarColeteCare')}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="bluetooth-outline" size={28} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.conectarText}>Conectar ColeteCare</Text>
            </View>
          </TouchableOpacity>
          <View style={{ height: 24 }} />
          <TouchableOpacity style={styles.sairButton} onPress={() => navigation.replace('Login')}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="exit-outline" size={28} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.conectarText}>Sair</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
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
  sosButton: {
    backgroundColor: "#EC1C24",
    paddingVertical: 60,
    paddingHorizontal: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sosText: {
    color: "#fff",
    fontSize: 100,
    fontWeight: "bold",
  },
  contagem: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelarButton: {
    backgroundColor: "#555",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
  },
  cancelarText: {
    color: "#fff",
    fontSize: 20,
  },
  sairButton: {
    backgroundColor: '#2E86C1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  conectarButton: {
    backgroundColor: '#2E86C1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  conectarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
