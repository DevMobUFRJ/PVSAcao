import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Picker,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';

import keys from '../../config/keys';
import constantes from '../../config/constants';

const firebase = require('firebase');
require('firebase/firestore');

export default class CriarUsuario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userType: this.props.userType,
            nome: '',
            email: '',
            materia: 'Biologia',
            turma: '',
            conexao: '',
            ocupado: false
        };
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


    salvarUsuario() {
        this.setState({ ocupado: true });
        this.registrarUsuarioParaAutenticacao();
    }

    registrarUsuarioParaAutenticacao() {
        const email = this.state.email;
        const password = 'pvs123';

        const user = this.state.conexao.auth();

        user.createUserWithEmailAndPassword(email, password)
            .then(
                () => {
                    //Sucesso no registro de autenticação
                    this.registrarDadosDoUsuario();
                }
            )
            .catch(
            (erro) => {
                this.setState({ ocupado: false });
                alert('Erro durante o cadastro do usuário: ', erro.message);
            }
        );
    }


    registrarDadosDoUsuario() {
        const usuarios = firebase.firestore().collection('usuarios');
        const novoUsuario = {
            nome: this.state.nome,
            tipo: this.state.userType.toLowerCase()
        };

        if (this.state.userType.toLowerCase() === 'aluno') {
            novoUsuario.turma = this.state.turma;
        } else if (this.state.userType.toLowerCase() === 'monitor') {
            novoUsuario.materia = this.state.materia;
        }

        usuarios.doc(this.state.email).set(novoUsuario)
            .then(
                () => {
                    alert('Usuario criado com sucesso! Email registrado: ', this.state.email);
                    this.setState({ ocupado: false });
                    Actions.pop();
                }
            )
            .catch(
                (erro) => {
                    alert('Erro na segunda etapa de cadastro: ', erro.message);
                    this.setState({ ocupado: false });
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
                        <TouchableOpacity
                            style={styles.botao}
                            activeOpacity={0.9}
                            onPress={
                                () => {
                                    this.salvarUsuario();
                                }
                            }
                        >
                            <Text style={styles.txtBotao}>REGISTRAR</Text>
                        </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#616EB2',
    },

    txtBotao: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
    },

});
