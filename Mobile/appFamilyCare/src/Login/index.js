import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = () => {
        if (email.toLowerCase() === 'idoso.com') {
            navigation.replace('HomeIdoso');
          } else {
            navigation.replace('Home');
          }
    };

    const handleCadastro = () => {
        navigation.replace('Cadastro');
    }
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/logo.png')}
                style={styles.logo} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#999" />
                    

    
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    placeholderTextColor="#999"></TextInput>

            <TouchableOpacity style={styles.botao}
                onPress={handleLogin}>
                <Text style={styles.textoBotao}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleCadastro} >
                <Text style={styles.linkCadastro}>Cadastrar</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 30,
    },
    text: {
        fontSize: 24,
    },
    logo: {
        width: 200,
        height: 200,
        alignItems: 'center',
        marginBottom: 40
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
    linkCadastro: {
        marginTop: 20,
        color: '#2E86C1',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
