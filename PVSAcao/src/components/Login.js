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

    this.registerUser = this.registerUser.bind();
    this.registerUser = this.registerUser.bind();
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
    var email = 'emailteste@gmail.com';
    var senha = 'senhateste123';
    
    const user = firebase.auth();

    user.signInWithEmailAndPassword(email, senha).catch(
      (erro) => {
        alert(erro.message);
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
          <TextInput style={TxtInput} placeholder="Email" />
          <TextInput style={TxtInput} placeholder="Senha" secureTextEntry />
        </View>

        <TouchableOpacity
          activeOpacity={0.9} 
          style={botao}
          onPress={() => { Actions.homealuno(); }}
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
