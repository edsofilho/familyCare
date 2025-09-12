import React, { useState, useEffect, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { useUser } from "../context/UserContext";
import api from "../services/api";
import { Ionicons } from '@expo/vector-icons';
const EMOJIS_POSSIVEIS = ["👴", "👵", "👨‍⚕️", "👩‍⚕️", "👨‍👩‍👧‍👦", "💊", "🏥", "❤️", "🤗", "👋"];
const EMOJI_PADRAO = "👤";

export default function Chat({ navigation }) {
  const { user, currentFamily } = useUser();
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [userEmojis, setUserEmojis] = useState({});
  const [carregando, setCarregando] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    if (user && currentFamily) {
      carregarMensagens();
      const interval = setInterval(() => {
        carregarMensagens();
        marcarComoLido();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [user, currentFamily]);

  const marcarComoLido = async () => {
    try {
      await api.post('/marcarMensagem.php', { 
        usuario: user.nome, 
        familia_id: currentFamily.id 
      });
    } catch (err) {
      console.log("Erro ao marcar como lido", err);
    }
  };

  const carregarMensagens = async () => {
    try {
      const res = await api.get('/listarMensagem.php', { 
        params: { familia_id: currentFamily.id, limit: 200 }
      });
      const msgs = Array.isArray(res.data) ? res.data : [];
      setMensagens(msgs);

      setUserEmojis((prev) => {
        const novoMapa = { ...prev };
        msgs.forEach((msg) => {
          if (msg && msg.usuario && !novoMapa[msg.usuario]) {
            const emoji = EMOJIS_POSSIVEIS[Math.floor(Math.random() * EMOJIS_POSSIVEIS.length)];
            novoMapa[msg.usuario] = emoji;
          }
        });
        return novoMapa;
      });
    } catch (err) {
      console.log("Erro ao buscar mensagens", err);
    }
  };

  const enviarMensagem = async () => {
    if (mensagem.trim() === "") return;
    
    setCarregando(true);
    try {
      await api.post('/enviarMensagem.php', { 
        usuario: user.nome,
        familia_id: currentFamily.id,
        mensagem: mensagem.trim()
      });
      setMensagem("");
      carregarMensagens();
    } catch (err) {
      console.log("Erro ao enviar mensagem", err);
      Alert.alert("Erro", "Não foi possível enviar a mensagem. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const formatarHora = (dataHora) => {
    if (!dataHora) return "";
    const date = new Date(dataHora);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatus = (status) => {
    if (status === "entregue") return "✅✅";
    if (status === "lido") return "✅👌";
    return "";
  };

  const obterNomeUsuario = (mensagem) => {
    // Se a mensagem tem nome_usuario, usa ele, senão usa o nome do usuário logado
    return mensagem.nome_usuario || user.nome;
  };

  if (!user || !currentFamily) {
    return (
      <View style={styles.container}>
        <Text style={styles.erroTexto}>
          Você precisa estar logado e em uma família para acessar o chat.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate(user.tipo === 'cuidador' ? 'HomeCuidador' : 'HomeIdoso')}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" ></Ionicons>
        </TouchableOpacity>
        <Text style={styles.titulo}>💬 Chat da Família</Text>
        <Text style={styles.subtitulo}>{currentFamily.nome}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={mensagens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isMe = item.usuario === user.nome;
          const nomeUsuario = item.usuario;
          
          return (
            <View
              style={[
                styles.msg,
                isMe ? styles.msgMinha : styles.msgOutro,
              ]}
            >
              {!isMe && (
                <Text style={styles.usuario}>
                  {userEmojis[item.usuario] || EMOJI_PADRAO} {nomeUsuario}
                </Text>
              )}
              <Text style={[styles.texto, isMe && styles.textoMinha]}>
                {item.mensagem}
              </Text>

              <View style={styles.linhaHora}>
                <Text style={[styles.hora, isMe && styles.horaMinha]}>
                  {formatarHora(item.data_hora)}
                </Text>
                {isMe && (
                  <Text
                    style={[
                      styles.status,
                      item.status === "lido" && styles.statusLido,
                    ]}
                  >
                    {renderStatus(item.status)}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem! 👋
            </Text>
          </View>
        }
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.inputMensagem}
          placeholder="Digite sua mensagem..."
          value={mensagem}
          onChangeText={setMensagem}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.botaoEnviar, carregando && styles.botaoEnviarDesabilitado]} 
          onPress={enviarMensagem}
          disabled={carregando || mensagem.trim() === ""}
        >
          {carregando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6ebf2",
    paddingTop: 40,
  },
  header: {
    padding: 15,
    backgroundColor: "#4a90e2",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    position: 'relative',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
  },
  botaoVoltarTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  subtitulo: {
    fontSize: 14,
    textAlign: "center",
    color: "#e6f3ff",
    marginTop: 5,
  },
  erroTexto: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 50,
    padding: 20,
  },
  msg: {
    maxWidth: "80%",
    marginVertical: 3,
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 10,
  },
  msgMinha: {
    backgroundColor: "#4a90e2",
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
  },
  msgOutro: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
    elevation: 2,
  },
  usuario: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#444",
    fontSize: 12,
  },
  texto: {
    color: "#000",
    fontSize: 15,
    lineHeight: 20,
  },
  textoMinha: {
    color: "#fff",
  },
  linhaHora: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  hora: {
    fontSize: 11,
    color: "#666",
    marginRight: 5,
  },
  horaMinha: {
    color: "#e6f3ff",
  },
  status: {
    fontSize: 12,
    color: "#666",
  },
  statusLido: {
    color: "#1e90ff",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputMensagem: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  botaoEnviar: {
    backgroundColor: "#4a90e2",
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  botaoEnviarDesabilitado: {
    backgroundColor: "#ccc",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});
