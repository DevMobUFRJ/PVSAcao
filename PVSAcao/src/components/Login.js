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
import * as firebase from "firebase";

const logo = require('../imgs/pvsacao-simple.png');

export default class Principal extends Component {
  render() {
    const { container, img, texto, VLogo, Cdados, TxtInput, botao, Txtbotao } = styles;
    return (
      <View style={container} >
        <View style={VLogo} >
          <Image style={img} source={logo} />
          <Text style={texto} >Pré Vestibular Social</Text>
        </View>

        <View style={Cdados} >
          <TextInput style={TxtInput} placeholder="Login" />
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

firebase.initializeApp({
    apiKey: process.env.PVS_FIREBASE_API_KEY || "***REMOVED***",
    authDomain: "pvs-acao.firebaseapp.com",
    databaseURL: "https://pvs-acao.firebaseio.com",
    projectId: "pvs-acao",
    storageBucket: "pvs-acao.appspot.com",
    messagingSenderId: process.env.PVS_SENDER_ID || ***REMOVED***
});

function register(email, password){
    try{
        firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log("Account created");
    } catch (error) {
        console.log(error.toString())
    }

}

function login(email, pass) {

    try {
        firebase.auth().signInWithEmailAndPassword(email, pass);
        console.log("Logged In!");

        // Navigate to the Home page

    } catch (error) {
        console.log(error.toString())
    }

}