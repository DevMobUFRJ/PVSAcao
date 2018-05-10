import React, { Component } from 'react';
import { StyleSheet, } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Pergunta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAluno: this.props.emailAluno,
      emailMonitor: '',
      messages: [],
    };
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
          apiKey: process.env.PVS_FIREBASE_API_KEY || "***REMOVED***",
          authDomain: "pvs-acao.firebaseapp.com",
          databaseURL: "https://pvs-acao.firebaseio.com",
          projectId: "pvs-acao",
          storageBucket: "pvs-acao.appspot.com",
          messagingSenderId: process.env.PVS_SENDER_ID || ***REMOVED***
      });
    }

    const ref = firebase.firestore().collection('chats');
    const queryMessages = ref.where('aluno', '==', this.state.emailAluno).where('titulo', '==', this.props.title);

    queryMessages.get().then(
      (querySnap) => {
        querySnap.forEach((doc) => {
          console.log(doc.id, '=>', doc.data());
        });
      }      
    );

    this.setState({
      messages: [
        {          
          user: {
            id: 2,
            name: 'Jõaozinho',
            avatar: require('../imgs/pvsacao-simple.png'),
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {    
    return (  
        <GiftedChat placeholder='Escreva sua mensagem...' messages={this.state.messages} onSend={messages => this.onSend(messages)} user={{ id: 1 }} />
    );
  }
}

const styles = StyleSheet.create({
  
  
});
