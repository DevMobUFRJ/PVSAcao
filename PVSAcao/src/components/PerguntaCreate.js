import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView
} from 'react-native';

export default class Pergunta extends Component {
  render() {
    const { chat, txtInput, principal, bottomchat, btnEnviar, imgEnviar } = styles;
    return (  
        <View style={principal} >
          <View style={chat} />
          
          <KeyboardAvoidingView behavior='height' style={bottomchat}>
            <TextInput style={txtInput} underlineColorAndroid="white" />
            <TouchableOpacity style={btnEnviar} >
              <Image style={imgEnviar} source={require('../imgs/icons/ic_send_white_24dp.png')} />
            </TouchableOpacity>
          </KeyboardAvoidingView>

        </View>
    );
  }
}

const styles = StyleSheet.create({

  principal: {
    flex: 1,
    backgroundColor: '#D6FBFF',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  chat: {
    flex: 10,
  },

  bottomchat: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 1,
  },

  txtInput: {
    flex: 10,
    backgroundColor: 'white',
    borderRadius: 50,  
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },

  imgEnviar: {
    resizeMode: 'contain',
    width: 30,
    height: 30
  },
  
  btnEnviar: {
    flex: 1,
    backgroundColor: '#3A4A9F',
    borderRadius: 100,
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginTop: 5,
    alignItems: 'center',
  },
  
});
