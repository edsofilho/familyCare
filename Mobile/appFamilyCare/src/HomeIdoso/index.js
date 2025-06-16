import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

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
    fetch("http://10.68.36.109/3mtec/apireact/addAlerta.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeIdoso: "João da Silva",
        tipo: "Queda",
        dataQueda: new Date().toISOString()
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.sucesso === true) {
          navigation.replace("AlertaEnviado");
        } else {
          Alert.alert("Erro", json.mensagem || "Erro ao salvar alerta");
        }
      })
      .catch((error) => {
        Alert.alert("Erro", "Erro ao conectar com o servidor. Verifique sua conexão.");
      });
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
});
