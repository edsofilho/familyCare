import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function HomeIdoso({ navigation }) {
  const [alertaAtivo, setAlertaAtivo] = useState(false);
  const [corDeFundo, setCorDeFundo] = useState("#fff");
  const [contador, setContador] = useState(5);
  const [intervalId, setIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [contadorIntervalId, setContadorIntervalId] = useState(null);

  const iniciarAlerta = () => {
    setAlertaAtivo(true);
    setContador(5);

    // Começa a piscar a tela
    const intervalo = setInterval(() => {
      setCorDeFundo((prev) => (prev === "#fff" ? "#ec1c24" : "#fff"));
    }, 500);
    setIntervalId(intervalo);

<<<<<<< HEAD
    const contagem = setInterval(() => {
      setContador((prev) => prev - 1);
    }, 1000);
    setContadorIntervalId(contagem);
=======
    const contadorInterval = setInterval(() => {
      setContador((prev) => prev - 1);
    }, 1000);
>>>>>>> c2ed29dc846bcbf3477bc5bfd7ddf2cf29ad75ba

    // Após 5 segundos, envia o alerta automaticamente
    const timeout = setTimeout(() => {
      clearInterval(contadorInterval);
      pararAlerta(); // para o piscar
      enviarAlerta(); // envia o alerta
    }, 5000);
    setTimeoutId(timeout);
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const pararAlerta = () => {
    setAlertaAtivo(false);
    setCorDeFundo("#fff");
    setContador(5);
    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);
    if (contadorIntervalId) clearInterval(contadorIntervalId);
  };

  const enviarAlerta = () => {
    fetch("http://10.68.36.109/3mtec/apireact/addAlerta.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome_idoso: "João da Silva",
        localizacao: "Rua das Flores, 123",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "sucesso") {
          Alert.alert("Sucesso", "Alerta enviado com sucesso!");
        } else {
          Alert.alert("Erro", json.mensagem || "Erro desconhecido.");
        }
      })
      .catch((error) => {
        Alert.alert("Erro de conexão", error.message);
      });
  };

<<<<<<< HEAD
  const corTextoDinamico = corDeFundo === "#ec1c24" ? "#fff" : "#ec1c24";
=======
  const corDoTexto = corDeFundo === "#fff" ? "#EC1C24" : "#fff";
>>>>>>> c2ed29dc846bcbf3477bc5bfd7ddf2cf29ad75ba

  return (
    <View style={[styles.container, { backgroundColor: corDeFundo }]}>
      {!alertaAtivo ? (
        <TouchableOpacity style={styles.sosButton} onPress={iniciarAlerta}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      ) : (
        <>
<<<<<<< HEAD
          <Text style={[styles.contagem, { color: corTextoDinamico }]}>
            Enviando alerta em {contador} segundo{contador !== 1 ? "s" : ""}...
          </Text>
=======
          <Text style={[styles.contagem, { color: corDoTexto }]}>Enviando alerta em {contador} segundo{contador !== 1 ? "s" : ""}...</Text>
>>>>>>> c2ed29dc846bcbf3477bc5bfd7ddf2cf29ad75ba
          <TouchableOpacity style={styles.cancelarButton} onPress={pararAlerta}>
            <Text style={styles.cancelarText}>Cancelar Alerta</Text>
          </TouchableOpacity>
        </>
      )}
      {/* <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity> */}
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
  llogoutButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginTop: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
