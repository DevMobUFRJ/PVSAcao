import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
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
      titulo: this.props.title,
      messages: [],
      fetch: false,
      messageId: '',
      userId: this.props.userId,
    };

    this.attMsgs = this.attMsgs.bind(this);
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

    this.setState({
      messages: [        
      ],
    });

    const firestore = firebase.firestore();
    firestore.settings({ timestampsInSnapshots: true });
    const t = firestore.collection('chats').where('aluno', '==', this.state.emailAluno).where('titulo', '==', this.state.titulo);
    t.get().then(
      (querySnap) => {
        if (querySnap.docs.length === 0) {
          console.log('vazio');
          firebase.firestore().collection('chats').add({
            aluno: this.state.emailAluno,
            materia: '', //add depois
            monitor: this.state.emailMonitor,
            titulo: this.state.titulo,
          }).then((doc) => {
              console.log('adicionado no vazio:', doc.id);
              firestore.collection('chats').doc(doc.id).collection('messages').add({
                _id: 1,
                createdAt: new Date(),
                text: 'Início do chat',
                system: true,
              });
            }
          );  
          this.attMsgs();        
        } else {
          console.log('Não vazio');
          querySnap.forEach((doc) => {
            console.log(doc.id, '->', doc.data());
            this.setState({ messageId: doc.id });
            firestore.collection('chats').doc(doc.id).collection('messages').orderBy('createdAt', 'desc').get()
            .then(
              (snap) => {
                snap.forEach((vai) => {
                  console.log(vai.id, '->', vai.data());
                  var timestamp = vai.data().createdAt;    
                  var date = new Date(timestamp.toDate());
                  console.log('data?', date);
                  const message = this.state.messages.concat({
                    _id: vai.id,
                    text: vai.data().text,
                    createdAt: date,
                    user: vai.data().user,
                  });
                  this.setState({ messages: message });
                  console.log('aqui as msgs:', this.state.messages);                  
                });
                this.setState({ fetch: true });
              } 
            );
          }); 
          }
        }
    );
  }  

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
    console.log(this.state.messages);
    const ref = firebase.firestore().collection('chats').doc(this.state.messageId).collection('messages');

    messages.forEach(element => {
      console.log(element.user._id);
      ref.add({
        text: element.text,
        user: element.user,
        _id: element._id,
        user_id: element.user._id,
        createdAt: element.createdAt,
      })
      .then((doc) => {
        console.log('adicionada mensagem com id', doc.id);
      });
    });    
  }

  attMsgs() {        
    const firestore = firebase.firestore();
    firestore.settings({ timestampsInSnapshots: true });
    const t = firestore.collection('chats').where('aluno', '==', this.state.emailAluno).where('titulo', '==', this.state.titulo);
    t.get().then(
      (querySnap) => {
        querySnap.forEach((doc) => {
          console.log(doc.id, '->', doc.data());
          this.setState({ messageId: doc.id });
          firestore.collection('chats').doc(doc.id).collection('messages').get()
          .then(
            (snap) => {
              snap.forEach((vai) => {
                console.log(vai.id, '->', vai.data());
                var timestamp = vai.data().createdAt;    
                var date = new Date(timestamp.toDate());
                if (vai.data().user_id == 0 || vai.data().user_id == 1) {
                  const message = this.state.messages.concat({
                    _id: vai.id,
                    text: vai.data().text,
                    createdAt: date,
                    user: vai.data().user,
                  });
                  this.setState({ messages: message });
                } else {
                const message = this.state.messages.concat({
                  _id: vai.id,
                  text: vai.data().text,
                  createdAt: date,
                  user: vai.data().user,
                });
                this.setState({ messages: message });
              }                
              });
            }
          );
        });
        this.setState({ fetch: true });
      }
    );
  }

  render() {  
    if (!this.state.fetch) {
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size='large' color="#616EB2" />
          </View>
      );
  }  
    return (  
        <GiftedChat placeholder='Escreva sua mensagem...' messages={this.state.messages} 
        onSend={messages => this.onSend(messages)} user={{ _id: this.state.userId }} 
        />
    );
  }
}

const styles = StyleSheet.create({
  
  
});
