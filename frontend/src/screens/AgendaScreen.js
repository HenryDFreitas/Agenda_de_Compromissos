import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function AgendaScreen({ navigation }) {
    const [compromissos, setCompromissos] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadCompromissos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/compromissos');
            setCompromissos(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                AsyncStorage.removeItem('token');
                navigation.replace('Login');
            } else {
                Alert.alert('Erro', 'Não foi possível carregar a agenda');
            }
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCompromissos();
        }, [])
    );

    const handleDelete = async (id) => {
        try {
            await api.delete(`/compromissos/${id}`);
            loadCompromissos();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir o compromisso.');
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity 
                        activeOpacity={1} 
                        onPress={() => navigation.navigate('EditCompromisso', { compromisso: item })}
                        style={styles.actionButton}
                    >
                        <Text style={styles.editText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity={1} 
                        onPress={() => handleDelete(item.id)}
                        style={styles.actionButton}
                    >
                        <Text style={styles.deleteText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {item.descricao ? <Text style={styles.cardText}>Descrição: {item.descricao}</Text> : null}
            <Text style={styles.cardText}>Início: {new Date(item.inicio).toLocaleString()}</Text>
            <Text style={styles.cardText}>Fim: {new Date(item.fim).toLocaleString()}</Text>
            <Text style={styles.cardText}>Status: {item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Agenda de Compromissos</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('CreateCompromisso')} style={styles.newButton}>
                        <Text style={styles.newButtonText}>+ Novo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={compromissos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                onRefresh={loadCompromissos}
                refreshing={loading}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum compromisso encontrado.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 30 // To account for status bar loosely
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginLeft: 10
    },
    logoutText: {
        fontWeight: 'bold'
    },
    headerButtons: {
        flexDirection: 'row'
    },
    newButton: {
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 5
    },
    newButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    cardActions: {
        flexDirection: 'row'
    },
    actionButton: {
        marginLeft: 15,
        paddingVertical: 5
    },
    editText: {
        color: '#007BFF',
        fontWeight: 'bold'
    },
    deleteText: {
        color: '#DC3545',
        fontWeight: 'bold'
    },
    cardText: {
        fontSize: 14,
        color: '#555'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#777'
    }
});
