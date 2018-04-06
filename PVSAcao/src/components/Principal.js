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
          onPress={() => { Actions.loginaluno(); }}
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
