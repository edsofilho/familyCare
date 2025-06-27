import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroCuidador({navigation}) {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const handleCadastro = async () => {
        if (senha !== confirmarSenha) {
        alert('As senhas não coincidem')
        return;
    }

    try {
        const res = await axios.post('http://10.68.36.109/3mtec/apireact/addCuidador.php', {nome, telefone, email,senha});
         if (res.data.sucesso) {
            navigation.replace('Login');
         }
         else{
            alert(res.data.mensagem || 'Erro ao cadastrar');
         }
        }
         catch (error) {
            alert('Erro de conexão' +  error.message);
         }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
                <Text style={styles.textoBotao}>Voltar</Text>
            </TouchableOpacity>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.titulo}>Cadastro de Cuidador</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                placeholder="Telefone"
                keyboardType='phone-pad'
                value={telefone}
                onChangeText={setTelefone}
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#999"
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

            <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
                <Text style={styles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#fff'
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: 30,
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
    botao: {
        backgroundColor: '#2E86C1',
        width: '100%',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    botaoVoltar: {
        backgroundColor: '#2E86C1',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E86C1',
        marginBottom: 16,
    },
    textoBotaoVoltar: {
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