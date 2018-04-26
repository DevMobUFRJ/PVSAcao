import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import firebase from "firebase";

const logo = require('../imgs/pvsacao-simple.png');

export default class Principal extends Component {

  constructor(props) {
    super(props);

    this.state = { email: '', senha: ''};

    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  componentWillMount() {
    firebase.initializeApp({
      apiKey: process.env.PVS_FIREBASE_API_KEY || "***REMOVED***",
      authDomain: "pvs-acao.firebaseapp.com",
      databaseURL: "https://pvs-acao.firebaseio.com",
      projectId: "pvs-acao",
      storageBucket: "pvs-acao.appspot.com",
      messagingSenderId: process.env.PVS_SENDER_ID || ***REMOVED***
  });
  }

  registerUser() {
    var email = 'emailteste@gmail.com';
    var senha = 'senhateste123';

    const user = firebase.auth();

    user.createUserWithEmailAndPassword(email, senha).catch(
      (erro) => {
        alert(erro.message);
      }
    );
  }

  loginUser() {
    var email = this.state.email;
    var senha = this.state.senha;

    //alert(this.state.senha);
    
    const user = firebase.auth();
    var msgErro = '';

    user.signInWithEmailAndPassword(email, senha).then(
      () => {
        Actions.homealuno();
      }
    )
    .catch(
      (erro) => {
        msgErro = erro.message;
        alert(msgErro);
      }
    );
  }

  render() {
    const { container, img, texto, VLogo, Cdados, TxtInput, botao, Txtbotao } = styles;
    return (
      <View style={container} >
        <View style={VLogo} >
          <Image style={img} source={logo} />
          <Text style={texto} >Pré Vestibular Social</Text>
        </View>

        <View style={Cdados} >
          <TextInput style={TxtInput} placeholder="Email" onChangeText={(e) => {this.setState({ email: e});}} />
          <TextInput style={TxtInput} placeholder="Senha" secureTextEntry onChangeText={(s) => {this.setState({ senha: s});}} />
        </View>

        <TouchableOpacity
          activeOpacity={0.9} 
          style={botao}
          onPress={() => { this.loginUser(); /*Actions.homealuno();*/ }}
        >
          <Text style={Txtbotao} >ENTRAR</Text>
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

    TxtInput: {

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
