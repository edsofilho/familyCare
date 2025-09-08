import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { authAPI } from '../../services/api';
import { useUser } from '../context/UserContext';

export default function Cadastro({navigation}) {
    const { login } = useUser();

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [codigoFamilia, setCodigoFamilia] = useState('');

    const handleCadastro = async () => {
        if (!nome || !telefone || !email || !senha) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }
        try {
            const userData = {
                nome,
                telefone,
                email,
                senha,
                tipo: "cuidador"
            };
            const res = await authAPI.register(userData);
            if (res.data.success || res.data.status === "sucesso") {
                Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
                navigation.navigate("Login");
            } else {
                Alert.alert("Erro", res.data.message || res.data.mensagem || "Erro no cadastro");
            }
        } catch (error) {
            Alert.alert("Erro de conexão", "Erro ao conectar com o servidor");
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.titulo}>Cadastro de Cuidador</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={nome}
                onChangeText={setNome}
                placeholderTextColor="#999"
                autoCapitalize="words"
            />

            <MaskedTextInput
                style={styles.input}
                placeholder="Telefone"
                keyboardType='phone-pad'
                value={telefone}
                onChangeText={setTelefone}
                placeholderTextColor="#999"
                mask="(99) 99999-9999"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#999"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                placeholder="Código da família (opcional)"
                value={codigoFamilia}
                onChangeText={setCodigoFamilia}
                placeholderTextColor="#999"
                autoCapitalize="characters"
            />

            <Text style={styles.infoText}>
                Deixe o código em branco para criar uma nova família
            </Text>

            <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
                <Text style={styles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.linkLogin}>Já tem conta? Entrar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scrollContentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E86C1',
        marginBottom: 20,
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f1f1f1',
        borderRadius: 25,
        paddingHorizontal: 16,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    botao: {
        backgroundColor: '#2E86C1',
        width: '100%',
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkLogin: {
        marginTop: 20,
        color: '#2E86C1',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});