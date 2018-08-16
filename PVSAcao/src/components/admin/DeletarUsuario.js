import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Picker,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import keys from '../../config/keys';
import constantes from '../../config/constants';

const firebase = require('firebase');
require('firebase/firestore');

export default class DeletarUsuario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userType: this.props.userType,
            nome: this.props.userName,
            email: this.props.userEmail,
            materia: '',
            turma: this.props.userTurma,
            conexao: '',
            ocupado: false
        };
        this.removeUser = this.removeUser.bind(this);
    }

    componentWillMount() {
        try {
            this.setState({
                conexao: firebase.initializeApp({
                    apiKey: keys.REACT_APP_PVS_FIREBASE_API_KEY,
                    authDomain: 'pvs-acao.firebaseapp.com',
                    databaseURL: 'https://pvs-acao.firebaseio.com',
                    projectId: 'pvs-acao',
                    storageBucket: 'pvs-acao.appspot.com',
                    messagingSenderId: keys.REACT_APP_PVS_FIREBASE_SENDER_ID
                }, 'segundaconexao')
            });
        } catch (err) {
            this.setState({ conexao: firebase.app('segundaconexao') });
        }
    }

    removeUser() {
        console.log('Deletando o usuario!');
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        const ref = firestore.collection('usuarios');
        const queryUsers = ref.where('tipo', '==', this.state.userType).where('nome', '==', this.state.nome);

        queryUsers.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    if (doc.id == this.state.email) {
                        ref.doc(doc.id).delete().then(() => {
                            alert('Usuario deletado');
                            console.log('Usuario deletado');
                            Actions.pop();
                        });
                    }
                });
            }
        );
    }

    atualizarUsuario() {
        console.log('Atualizando o usuario!');
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        const ref = firestore.collection('usuarios');
        const queryUsers = ref.where('tipo', '==', this.state.userType).where('nome', '==', this.state.nome);

        queryUsers.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    if (doc.id == this.state.email) {
                        ref.doc(doc.id).update({
                            nome: this.state.nome,
                            turma: this.state.turma
                        });
                        console.log('Usuario atualizado');
                        alert('Usuario atualizado!');
                    }
                });
            }
        );
    }


    render() {
        return (
            <View style={styles.principal}>
                <Modal isVisible={this.state.ocupado} animationInTiming={1}>
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                        <ActivityIndicator size='large' color='white' />
                    </View>
                </Modal>
                <View>
                    <Text style={styles.tituloCampo}>Nome:</Text>
                    <TextInput         
                        defaultValue={this.state.userName}               
                        style={styles.entradaTexto}
                        onChangeText={(novoNome) => this.setState({ nome: novoNome })}
                        value={this.state.nome}
                    />
                    <Text style={styles.tituloCampo}>Email:</Text>
                    <TextInput
                        style={styles.entradaTexto}
                        onChangeText={(novoEmail) => this.setState({ email: novoEmail })}
                        keyboardType='email-address'
                        value={this.state.email}
                    />
                    {this.state.userType.toLowerCase() === 'aluno' &&
                        <View>
                            <Text style={styles.tituloCampo}>Turma:</Text>
                            <TextInput
                                style={styles.entradaTexto}
                                onChangeText={(novaTurma) => this.setState({ turma: novaTurma })}
                                value={this.state.turma}
                            />
                        </View>
                    }
                    {this.state.userType.toLowerCase() === 'monitor' &&
                        <View>
                            <Text style={styles.tituloCampo}>Materia:</Text>
                            <Picker
                                style={styles.entradaTexto}
                                mode='dropdown'
                                selectedValue={this.state.materia}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ materia: itemValue });
                                }}
                            >
                                {
                                    constantes.materias.map(
                                        (materia) =>
                                        <Picker.Item label={materia.nome} value={materia.value} />
                                    )
                                }
                            </Picker>
                        </View>
                    }
                    { !this.state.ocupado &&
                       <View style={styles.viewBtns} >
                            <TouchableOpacity
                                style={[styles.botao, { backgroundColor: '#09af00' }]}
                                activeOpacity={0.9}
                                onPress={
                                    () => {
                                        this.atualizarUsuario();
                                    }
                                }
                            >
                                <Text style={styles.txtBotao}>ATUALIZAR</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botao, { backgroundColor: '#c33d26' }] }
                                activeOpacity={0.9}
                                onPress={
                                    () => {
                                        this.removeUser();
                                    }
                                }
                            >
                                <Text style={styles.txtBotao}>DELETAR</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    principal: {
        flex: 1,
        backgroundColor: 'white',
    },

    tituloCampo: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },

    entradaTexto: {
        marginLeft: 10,
        marginRight: 10
    },

    botao: {
        margin: 10,
        height: 50,
        width: 90,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    txtBotao: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
    },

    viewBtns: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },

});
