import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

export default function CreateCompromissoScreen({ navigation }) {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [status, setStatus] = useState('AGENDADO');

    const handleCreate = async () => {
        try {
            // Conversão básica das datas escritas pelo usuário (ex: 2024-06-15 14:00) para formato ISO aceito pelo Backend
            // Se o usuário já escrever no formato certinho, o Date() vai aceitar também
            const inicioDate = new Date(inicio);
            const fimDate = new Date(fim);

            await api.post('/compromissos', { 
                titulo, 
                descricao, 
                inicio: inicioDate.toISOString(), 
                fim: fimDate.toISOString(), 
                status: status.toUpperCase() 
            });
            
            // Limpa os campos para o próximo cadastro
            setTitulo('');
            setDescricao('');
            setInicio('');
            setFim('');
            setStatus('AGENDADO');

            navigation.navigate('Agenda');
        } catch (error) {
            Alert.alert('Erro', error.response?.data?.erro || 'Erro ao criar compromisso. Verifique os dados e datas.');
            // Fallback for web
            if (error.response?.data?.erro) {
                console.log(error.response.data.erro);
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Novo Compromisso</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Agenda')} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>
            </View>
            
            <TextInput
                style={styles.input}
                placeholder="Título"
                value={titulo}
                onChangeText={setTitulo}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Início (ex: 2024-12-31 10:00)"
                value={inicio}
                onChangeText={setInicio}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Fim (ex: 2024-12-31 11:00)"
                value={fim}
                onChangeText={setFim}
            />

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="AGENDADO" value="AGENDADO" />
                    <Picker.Item label="CONCLUIDO" value="CONCLUIDO" />
                    <Picker.Item label="CANCELADO" value="CANCELADO" />
                </Picker>
            </View>
            
            <TouchableOpacity activeOpacity={1} style={styles.button} onPress={handleCreate}>
                <Text style={styles.buttonText}>Salvar Compromisso</Text>
            </TouchableOpacity>
        </ScrollView>
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
        marginTop: 30
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5
    },
    backText: {
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        borderRadius: 5,
        overflow: 'hidden'
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 0,
        outline: 'none'
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 40
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
