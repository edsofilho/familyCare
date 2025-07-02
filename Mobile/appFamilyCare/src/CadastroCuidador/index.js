import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { cuidadorAPI, api } from '../services/api';

export default function CadastroCuidador({navigation}) {
    const { user, currentFamily } = useUser();
    const [termoBusca, setTermoBusca] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buscando, setBuscando] = useState(false);

    const buscarUsuarios = async () => {
        if (!termoBusca.trim()) {
            Alert.alert('Erro', 'Digite um nome ou email para buscar');
            return;
        }
        if (!user?.id) {
            Alert.alert('Erro', 'Usuário não encontrado');
            return;
        }
        setBuscando(true);
        try {
            const res = await cuidadorAPI.search(termoBusca.trim(), user.id);
            if (res.data.status === 'sucesso') {
                const usuariosEncontrados = res.data.usuarios || [];
                setUsuarios(usuariosEncontrados);
            } else {
                Alert.alert('Erro', res.data.mensagem);
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao buscar usuários: ' + (error.response?.data?.mensagem || error.message));
        } finally {
            setBuscando(false);
        }
    };

    const enviarConvite = async (cuidador) => {
        if (!currentFamily) {
            Alert.alert('Erro', 'Nenhuma família selecionada');
            return;
        }
        if (!user?.id) {
            Alert.alert('Erro', 'Usuário não encontrado');
            return;
        }
        if (!cuidador?.id) {
            Alert.alert('Erro', 'Cuidador inválido');
            return;
        }
        const familiaId = currentFamily.id;
        const usuarioId = user.id;
        const cuidadorId = cuidador.id;
        setLoading(true);
        try {
            const res = await cuidadorAPI.sendInvite(familiaId, usuarioId, cuidadorId);
            if (res.data.status === 'sucesso') {
                Alert.alert('Sucesso', 'Convite enviado com sucesso!');
                setUsuarios([]);
                setTermoBusca('');
            } else {
                Alert.alert('Erro', res.data.mensagem);
            }
        } catch (error) {
            if (error.response) {
                Alert.alert('Erro', 'Erro ao enviar convite: ' + JSON.stringify(error.response.data));
            } else {
                Alert.alert('Erro', 'Erro ao enviar convite: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const renderUsuario = ({ item }) => {
        if (!item || !item.id) {
            return null;
        }
        return (
            <View style={styles.usuarioCard}>
                <View style={styles.usuarioInfo}>
                    <Text style={styles.usuarioNome}>{item.nome || 'Nome não informado'}</Text>
                    <Text style={styles.usuarioEmail}>{item.email || 'Email não informado'}</Text>
                    <Text style={styles.usuarioTelefone}>{item.telefone || 'Telefone não informado'}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.botaoConvite, loading && styles.botaoDisabled]}
                    onPress={() => enviarConvite(item)}
                    disabled={loading}
                >
                    <Ionicons name="person-add" size={20} color="#fff" />
                    <Text style={styles.textoBotaoConvite}>Convidar</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
                <Text style={styles.textoBotao}>Voltar</Text>
            </TouchableOpacity>
            
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.titulo}>Convidar Cuidador</Text>
            <Text style={styles.subtitulo}>Família: {currentFamily?.nome}</Text>
            
            <View style={styles.buscaContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Buscar por nome ou email"
                    value={termoBusca}
                    onChangeText={setTermoBusca}
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                />
                <TouchableOpacity 
                    style={[styles.botaoBuscar, buscando && styles.botaoDisabled]}
                    onPress={buscarUsuarios}
                    disabled={buscando}
                >
                    {buscando ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="search" size={20} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>

            {usuarios.length > 0 && (
                <View style={styles.resultadosContainer}>
                    <Text style={styles.resultadosTitulo}>Resultados da busca:</Text>
                    <FlatList
                        data={usuarios}
                        renderItem={renderUsuario}
                        keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}

            {usuarios.length === 0 && termoBusca && !buscando && (
                <View style={styles.semResultados}>
                    <Ionicons name="search-outline" size={48} color="#ccc" />
                    <Text style={styles.semResultadosTexto}>Nenhum usuário encontrado</Text>
                </View>
            )}

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitulo}>Como funciona?</Text>
                <Text style={styles.infoTexto}>
                    • Digite o nome ou email do cuidador{"\n"}
                    • O sistema buscará usuários cadastrados{"\n"}
                    • Envie um convite para adicionar à família{"\n"}
                    • O cuidador receberá uma notificação
                </Text>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: '5%',
        paddingVertical: 30,
        minHeight: '100%',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E86C1',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitulo: {
        fontSize: 15,
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        height: 48,
        backgroundColor: '#f1f1f1',
        borderRadius: 24,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#333',
    },
    botaoVoltar: {
        backgroundColor: '#2E86C1',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    buscaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    botaoBuscar: {
        backgroundColor: '#2E86C1',
        padding: 12,
        borderRadius: 24,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoDisabled: {
        backgroundColor: '#ccc',
    },
    botaoTeste: {
        backgroundColor: '#27AE60',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 16,
        alignSelf: 'center',
    },
    resultadosContainer: {
        width: '100%',
        marginBottom: 16,
    },
    resultadosTitulo: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#2E86C1',
        marginBottom: 8,
    },
    usuarioCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    usuarioInfo: {
        flex: 1,
    },
    usuarioNome: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    usuarioEmail: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    usuarioTelefone: {
        fontSize: 13,
        color: '#666',
    },
    botaoConvite: {
        backgroundColor: '#2E86C1',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textoBotaoConvite: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    semResultados: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    semResultadosTexto: {
        color: '#666',
        fontSize: 15,
        marginTop: 8,
    },
    infoContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2E86C1',
    },
    infoTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E86C1',
        marginBottom: 8,
    },
    infoTexto: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
}); 