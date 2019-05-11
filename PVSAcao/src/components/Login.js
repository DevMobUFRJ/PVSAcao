import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import keys from '../config/keys';

const firebase = require('firebase');
require('firebase/firestore');
const logo = require('../imgs/pvsacao-simple.png');

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {email: '', password: '', isVisible: false};

        this.loginUser = this.loginUser.bind(this);
        this.submitLoginForm = this.submitLoginForm.bind(this);
    }

    componentWillMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: keys.REACT_APP_PVS_FIREBASE_API_KEY,
                authDomain: "pvs-acao.firebaseapp.com",
                databaseURL: "https://pvs-acao.firebaseio.com",
                projectId: "pvs-acao",
                storageBucket: "pvs-acao.appspot.com",
                messagingSenderId: keys.REACT_APP_PVS_FIREBASE_SENDER_ID
            });
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({isVisible: true});
                var email = user.email;
                console.log("logado: " + email);
                this.loginFinalStep(email);
            } else {
                console.log("Não está logado");
            }
        });
    }

    submitLoginForm(){
        if (this.state.email === '') {
            Alert.alert('Email vazio!');
        } else {
            this.loginUser();
        }
    }

    loginUser() {
        this.setState({isVisible: true});
        var email = this.state.email;
        var password = this.state.password;
        const user = firebase.auth();

        user.signInWithEmailAndPassword(email, password).then(
            () => {
                this.loginFinalStep(email);
            }
        )
            .catch(
                (erro) => {
                    this.setState({isVisible: false});
                    msgErro = erro.message;
                    alert(msgErro);
                }
            );
    }

    loginFinalStep(email) {
        const firestore = firebase.firestore();
        var db = firestore.collection('usuarios').doc(email);
        var msgErro = '';

        db.get().then(
            (doc) => {
                if (doc.exists) {
                    //console.log(doc.data().tipo);
                    const tipo = doc.data().tipo;
                    this.setState({isVisible: false});

                    if (tipo == "aluno") {
                        console.log("Tipo de login é aluno!", email);
                        Actions.homealuno({email});
                    } else if (tipo == 'monitor') {
                        console.log("Tipo de login é monitor!");
                        Actions.homemonitor({email, materia: doc.data().materia});
                    } else if (tipo == 'admin') {
                        console.log("Tipo de login é admin!");
                        Actions.homeadmin({email});
                    }
                } else {
                    this.setState({isVisible: false});
                    alert('Email não encontrado!');
                }
            }
        ).catch(
            (erro) => {
                console.log(erro);
            }
        );
    }

    render() {
        const {container, img, texto, VLogo, Cdados, botao, inputSenha, Txtbotao, txtEsqSenha, devmob } = styles;
        return (
            <View style={container}>
                <Modal isVisible={this.state.isVisible} animationInTiming={1}>
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                        <ActivityIndicator size='large' color='white' />
                    </View>
                </Modal>
                <View style={VLogo}>
                    <Image style={img} source={logo} />
                    <Text style={texto}>Pré Vestibular Social</Text>
                    <Text style={devmob} onPress={ ()=>{ Linking.openURL('https://facebook.com/DevMobUFRJ/')} }>App desenvolvido por <Text style={{ textDecorationLine: 'underline' }}>DevMob UFRJ</Text></Text>
                </View>

                <View style={Cdados}>
                    <TextInput 
                        placeholder="Email" keyboardType='email-address' autoFocus
                        onChangeText={(e) => {
                            this.setState({ email: e });
                        }}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        blurOnSubmit={false}
                    />
                    <TextInput 
                        style={inputSenha} placeholder="Senha" secureTextEntry
                        onChangeText={(s) => {
                            this.setState({ password: s });
                        }}
                        ref={(input) => { this.secondTextInput = input; }}
                        onSubmitEditing={() => { this.submitLoginForm(); }}
                    />
                    <TouchableOpacity
                    activeOpacity={0.9}
                    style={txtEsqSenha}
                    onPress={
                        () => {
                            if (this.state.email === '') {
                                Alert.alert('Por favor, preencha seu email');
                            } else {
                                firebase.auth()
                                    .sendPasswordResetEmail(this.state.email).then(() => {
                                        console.log('Email de redefinição de senha enviado.');
                                        Alert.alert('Clique no link enviado ao seu email para mudar sua senha');
                                    }).catch((error) => {
                                        console.log(error);
                                        Alert.alert('Erro ao enviar email.');
                                    });
                                }
                            }
                        }
                    >
                    <Text style={[Txtbotao, { color: '#656565' }]}>Esqueci a senha</Text>
                </TouchableOpacity>
                </View>                

                <TouchableOpacity
                    activeOpacity={0.9}
                    style={botao}
                    onPress={
                        () => {
                            this.submitLoginForm();
                        }
                    }
                >
                    <Text style={Txtbotao}>ENTRAR</Text>
                </TouchableOpacity>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    Cdados: {
        margin: 30,
        marginBottom: 60,
    },

    VLogo: {
        marginTop: 20,
        alignItems: 'center',
    },

    img: {
        resizeMode: 'contain',
        height: 230,
        width: 230,
    },

    texto: {
        marginTop: -30,
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },

    botao: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#616EB2',
    },

    Txtbotao: {
        margin: 15,
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
    },

    txtEsqSenha: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: -10,
        marginBottom: 0,
    },

    devmob: {
        fontSize: 13,
        marginTop: 4,
    },

    inputSenha: {
        marginTop: 0,
        marginBottom: 0,
    }
});
