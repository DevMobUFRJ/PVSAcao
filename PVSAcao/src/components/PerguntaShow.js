import React, { Component } from 'react';
import { StyleSheet, } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import keys from '../config/keys';

const firebase = require('firebase');
require('firebase/firestore');

export default class PerguntaShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAluno: this.props.emailAluno,
      emailMonitor: this.props.emailMonitor,
      messages: [],
    };
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
          apiKey: keys.REACT_APP_PVS_FIREBASE_API_KEY,
          authDomain: 'pvs-acao.firebaseapp.com',
          databaseURL: 'https://pvs-acao.firebaseio.com',
          projectId: 'pvs-acao',
          storageBucket: 'pvs-acao.appspot.com',
          messagingSenderId: keys.REACT_APP_PVS_FIREBASE_SENDER_ID
      });
    }

    const firestore = firebase.firestore();
    firestore.settings({ timestampsInSnapshots: true });
    const ref = firestore.collection('chats');

    if (this.state.emailAluno) {
      const queryMessages = ref
      .where('aluno', '==', this.state.emailAluno).where('titulo', '==', this.props.title);
      queryMessages.get().then(
        (querySnap) => {
          querySnap.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
          });
        }      
      );
    }

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
        <GiftedChat placeholder='Escreva sua mensagem...' messages={this.state.messages} 
        onSend={messages => this.onSend(messages)} user={{ id: 1 }} 
        />
    );
  }
}

const styles = StyleSheet.create({
  
  
});
