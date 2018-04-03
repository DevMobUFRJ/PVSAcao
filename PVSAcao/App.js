import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
} from 'react-native';

const logo = require('./src/imgs/pvsacao-simple.png');

export default class App extends Component {
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

        <TouchableHighlight style={botao} >
          <Text style={Txtbotao} >ENTRAR</Text>
        </TouchableHighlight>
      
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
      marginBottom: 200,
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
      height: 30,
      alignItems: 'center',
      backgroundColor: '#616EB2',
    },

    Txtbotao: {
      marginTop: 5,
      fontWeight: 'bold',
      fontSize: 14,
      color: 'white',
    },
  
});
