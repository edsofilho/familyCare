import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const idososExemplo = [
  { nome: "Cláudio" },
  { nome: "Maria" },
  { nome: "João" },
];

export default function Home({ navigation }) {
  const [idosos] = useState(idososExemplo);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <ScrollView style={{ flex: 1, backgroundColor: '#F4F6FB' }} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
      <Text style={styles.NomeCuidador}>Olá, Getulio</Text>
      <View style={{ height: 8 }} />
      <Carousel
        style={styles.carousel}
        width={width * 0.9}
        height={270}
        data={idosos}
        scrollAnimationDuration={600}
        onSnapToItem={setCurrentIndex}
        renderItem={({ item }) => (
          <View style={styles.carouselCard}>
            <Text style={styles.nomeIdoso}>{item.nome}</Text>
            <TouchableOpacity style={styles.alertaLink} onPress={handleAlertas}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="alert-circle" size={24} color="#D35400" style={{ marginRight: 8 }} />
                <Text style={styles.alertaText}>Alertas</Text>
              </View>
            </TouchableOpacity>
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
        )}
      />
      <View style={styles.carouselIndicators}>
        {idosos.map((_, idx) => (
          <View
            key={idx}
            style={[styles.carouselDot, currentIndex === idx && styles.carouselDotActive]}
          />
        ))}
      </View>
      <View style={{ height: 32 }} />
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
      <View style={styles.parteCuidadores}>
        <Text style={styles.tituloCuidadores}>Cuidadores:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollCuidadores} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.listaCuidadores}>
            <View style={styles.cuidadorItem}>
              <Text style={styles.textoCuidadores} numberOfLines={1} ellipsizeMode="tail">Getulio</Text>
              <TouchableOpacity style={styles.contatoButton} onPress={() => {/* ação de contato */}}>
                <Ionicons name="call" size={20} color="#2E86C1" />
              </TouchableOpacity>
            </View>
            <View style={styles.cuidadorItem}>
              <Text style={styles.textoCuidadores} numberOfLines={1} ellipsizeMode="tail">Ramon</Text>
              <TouchableOpacity style={styles.contatoButton} onPress={() => {/* ação de contato */}}>
                <Ionicons name="call" size={20} color="#2E86C1" />
              </TouchableOpacity>
            </View>
            <View style={styles.cuidadorItem}>
              <Text style={styles.textoCuidadores} numberOfLines={1} ellipsizeMode="tail">Eunice</Text>
              <TouchableOpacity style={styles.contatoButton} onPress={() => {/* ação de contato */}}>
                <Ionicons name="call" size={20} color="#2E86C1" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.cadastrarCuidadorButton} onPress={() => navigation.navigate('CadastroCuidador')}>
          <Ionicons name="person-add-outline" size={22} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.cadastrarCuidadorText}>Cadastrar Cuidador</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 30,
  },
  carousel: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 8,
    marginTop: 0,
    marginBottom: 0,
  },
  carouselCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2E86C1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },
  nomeIdoso: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
    letterSpacing: 1,
  },
  alertaLink: {
    backgroundColor: "#FFF3CD",
    borderColor: "#F1C40F",
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    width: 200,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#F1C40F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  alertaText: {
    color: "#B9770E",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  Framelinks: {
    backgroundColor: "#5DADE2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: 200,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#5DADE2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 3,
    elevation: 1,
  },
  linkText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  cadastrarButton: {
    backgroundColor: "#2E86C1",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 18,
    width: 240,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#2E86C1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  cadastrarText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  parteCuidadores: {
    backgroundColor: "#fff",
    width: "92%",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#2E86C1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  tituloCuidadores: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#154360",
    letterSpacing: 0.5,
  },
  textoCuidadores: {
    fontSize: 16,
    color: '#34495E',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  logoutButton: {
    backgroundColor: "#C0392B",
    paddingVertical: 13,
    paddingHorizontal: 34,
    borderRadius: 32,
    elevation: 5,
    marginBottom: 10,
    shadowColor: "#C0392B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  NomeCuidador: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#154360",
    marginBottom: 22,
    letterSpacing: 1,
    textShadowColor: '#BFC9CA',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  listaCuidadores: {
    width: '100%',
    marginTop: 8,
    marginBottom: 10,
  },
  cuidadorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  contatoButton: {
    backgroundColor: '#EAF2F8',
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
  },
  cadastrarCuidadorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E86C1',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 8,
    alignSelf: 'center',
  },
  cadastrarCuidadorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  carouselDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D6DBDF',
    marginHorizontal: 4,
  },
  carouselDotActive: {
    backgroundColor: '#2E86C1',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  scrollCuidadores: {
    width: '100%',
    marginTop: 8,
    marginBottom: 10,
  },
});
