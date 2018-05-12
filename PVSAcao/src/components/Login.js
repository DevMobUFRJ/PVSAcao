import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modal';
import keys from '../config/keys';

const firebase = require('firebase');
require('firebase/firestore');
const logo = require('../imgs/pvsacao-simple.png');

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {email: '', password: '', isVisible: false};

        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
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

    registerUser() {
        //ainda não implementado
        var email = this.state.email;
        var password = this.state.password;

        const user = firebase.auth();

        user.createUserWithEmailAndPassword(email, password).catch(
            (erro) => {
                alert(erro.message);
            }
        );
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
        firestore.settings({timestampsInSnapshots: true});
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
        const {container, img, texto, VLogo, Cdados, TxtInput, botao, Txtbotao} = styles;
        return (
            <View style={container}>
                <Modal isVisible={this.state.isVisible} animationInTiming={1}>
                    <View style={{flex: 1, justifyContent: 'center', alignContent: 'center',}}>
                        <ActivityIndicator size='large' color='white'/>
                    </View>
                </Modal>
                <View style={VLogo}>
                    <Image style={img} source={logo}/>
                    <Text style={texto}>Pré Vestibular Social</Text>
                </View>

                <View style={Cdados}>
                    <TextInput style={TxtInput} placeholder="Email" keyboardType='email-address'
                               onChangeText={(e) => {
                                   this.setState({email: e});
                               }}
                    />
                    <TextInput style={TxtInput} placeholder="Senha" secureTextEntry
                               onChangeText={(s) => {
                                   this.setState({password: s});
                               }}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    style={botao}
                    onPress={
                        () => {
                            if (this.state.email == '') {
                                alert('Email vazio!');
                            } else {
                                this.loginUser();
                            }
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
        marginBottom: 100,
    },

    TxtInput: {},

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
        fontSize: 16,
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

});
