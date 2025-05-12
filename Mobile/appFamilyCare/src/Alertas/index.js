import React, { useState, useEffect } from 'react';  // Adicionando os imports necessários
import { View, Text, StyleSheet, ScrollView, Alert, Button } from 'react-native';
import axios from 'axios';

export default function Alerta({ navigation }) {
    const [alertas, setAlertas] = useState([]);  // Definindo o estado para os alertas

    useEffect(() => {
        listarAlertas();
    }, []);  // Carrega os alertas quando o componente for montado

    async function listarAlertas() {
         try {
      const res = await axios.get('http://10.68.36.109/3mtec/apireact/listarAlertas.php');
      if (res.data.status === 'sucesso') {
        setAlertas(res.data.alertas);  // Atualiza o estado com os alertas retornados
      } else {
        Alert.alert('Nenhum alerta encontrado');
      }
    } catch (error) {
      console.error('Erro ao listar alertas:', error);
      Alert.alert('Erro de conexão:', error.message);
    }
  };

    return (
        <View style={styles.container}>
            <ScrollView>
                {alertas.length > 0 ? (
                    alertas.map((alerta) => (
                        <View key={alerta.id} style={styles.alerta}>
                            <Text style={styles.alertaText}>Idoso: {alerta.nomeIdoso}</Text>
                            <Text style={styles.alertaText}>Tipo: {alerta.tipo}</Text>
                            <Text style={styles.alertaText}>Data: {alerta.data}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.semAlertas}>Nenhum alerta encontrado.</Text>
                )}
            </ScrollView>
            <Button title='Atualizar' onPress= {listarAlertas}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alerta: {
        padding: 20,
        marginBottom: 15,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        width: '100%',
    },
    alertaText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 5,
    },
    semAlertas: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
    },
});
