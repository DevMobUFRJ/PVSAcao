import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Picker,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
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
            materia: '',
            turma: '',
            conexao: ''
        };
    }

    componentWillMount() {
        this.setState({ conexao: firebase.initializeApp({
                apiKey: keys.REACT_APP_PVS_FIREBASE_API_KEY,
                authDomain: 'pvs-acao.firebaseapp.com',
                databaseURL: 'https://pvs-acao.firebaseio.com',
                projectId: 'pvs-acao',
                storageBucket: 'pvs-acao.appspot.com',
                messagingSenderId: keys.REACT_APP_PVS_FIREBASE_SENDER_ID
            },'segundaconexao') });
    }


    salvarUsuario(){
        console.log("Salvar usuario metodo");
        console.log(this.state);
        this.registrarUsuarioParaAutenticacao();
    }

    registrarUsuarioParaAutenticacao() {
        const email = this.state.email;
        const password = 'pvs123';

        const user = this.state.conexao.auth();

        user.createUserWithEmailAndPassword(email, password)
            .then(
                () => {
                    console.log('Sucesso no registro de autenticação.');
                    this.registrarDadosDoUsuario();
                }
            )
            .catch(
            (erro) => {
                alert('Erro durante o cadastro do usuário: ' + erro.message);
            }
        );
    }


    registrarDadosDoUsuario(){
        const usuarios = firebase.firestore().collection('usuarios');
        let novoUsuario = {
            nome: this.state.nome,
            tipo: this.state.userType.toLowerCase()
        };

        if(this.state.userType.toLowerCase() === 'aluno'){
            novoUsuario.turma = this.state.turma;
        } else if (this.state.userType.toLowerCase() === 'monitor'){
            novoUsuario.materia = this.state.materia;
        }

        usuarios.doc(this.state.email).set(novoUsuario)
            .then(
                () => {
                    console.log('Registro completo');
                    alert('Usuario criado com sucesso! Email registrado: ' + this.state.email);
                    Actions.pop();
                }
            )
            .catch(
                (erro) => {
                    console.log('Erro nos dados do usuario');
                    alert('Erro na segunda etapa de cadastro: ' + erro.message);
                }
            );
    }


    render() {
        return (
            <View style={styles.principal}>
                <View>
                    <Text>Nome:</Text>
                    <TextInput
                        onChangeText={(novoNome) => this.setState({ nome: novoNome })}
                        value={this.state.nome}
                    />
                    <Text>Email:</Text>
                    <TextInput
                        onChangeText={(novoEmail) => this.setState({ email: novoEmail })}
                        keyboardType='email-address'
                        value={this.state.email}
                    />
                    {this.state.userType.toLowerCase() === 'aluno' &&
                        <View>
                            <Text>Turma:</Text>
                            <TextInput
                                onChangeText={(novaTurma) => this.setState({ turma: novaTurma })}
                                value={this.state.turma}
                            />
                        </View>
                    }
                    {this.state.userType.toLowerCase() === 'monitor' &&
                        <View>
                            <Text>Materia:</Text>
                            <Picker
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

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={
                            () => {
                                this.salvarUsuario();
                            }
                        }
                    >
                        <Text>ENTRAR</Text>
                    </TouchableOpacity>
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
});
