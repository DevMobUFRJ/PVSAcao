import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GiftedChat, Actions } from 'react-native-gifted-chat';
import keys from '../config/keys';
import constantes from '../config/constants';

const firebase = require('firebase');
require('firebase/firestore');

export default class PerguntaShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAluno: this.props.emailAluno,
      emailMonitor: this.props.emailMonitor,
      titulo: this.props.title,
      materia: this.props.materia,
      messages: [],
      fetch: false,
      messageId: '',
      userId: this.props.userId,
    };

    this.attMsgs = this.attMsgs.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.onSend = this.onSend.bind(this);
    this.mostrarDetalhes = this.mostrarDetalhes.bind(this);
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
    const t = firestore.collection('chats').where('aluno', '==', this.state.emailAluno).where('titulo', '==', this.state.titulo);
    t.get().then(
      (querySnap) => {
        if (querySnap.docs.length === 0) {
          firebase.firestore().collection('chats').add({
            aluno: this.state.emailAluno,
            materia: this.state.materia,
            monitor: this.state.emailMonitor,
            titulo: this.state.titulo,
          }).then((doc) => {
              firestore.collection('chats').doc(doc.id).collection('messages').add({
                _id: 1,
                createdAt: new Date(),
                text: this.state.titulo,
                user: {
                  _id: 0,
                },
              });
            }
          );  
          this.attMsgs();        
        } else {
          //Atualiza a constante "currentChat" para ser utilizada caso clique em "informações" da pergunta.
          constantes.currentChat = querySnap.docs[0].data();
          console.log(querySnap.docs[0].data());

          querySnap.forEach((doc) => {
            console.log(doc.id, '->', doc.data());
            this.setState({ messageId: doc.id });
            const db = firestore.collection('chats').doc(doc.id).collection('messages');             
              db.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {                
                  if (change.type === 'added' && this.state.fetch === true) {
                    console.log('Adicionado:', change.doc.data());
                    if (change.doc.data().user_id !== this.state.userId) {
                      this.onReceive(change.doc.data().text);
                    }
                  }
                  if (change.type === 'modified') {
                    console.log('Modificado:', change.doc.data());
                  }
                  if (change.type === 'removed') {
                    console.log('Removido:', change.doc.data());
                  }
                });
              });                      
            db.orderBy('createdAt', 'desc').get()
            .then(
              (snap) => {
                snap.forEach((vai) => {
                  //console.log(vai.id, '->', vai.data());
                  const timestamp = vai.data().createdAt;    
                  const date = new Date(timestamp.toDate());
                  //console.log('data?', date);
                  const message = this.state.messages.concat({
                    _id: vai.id,
                    text: vai.data().text,
                    createdAt: date,
                    user: vai.data().user,
                  });
                  this.setState({ messages: message });                
                });
                this.setState({ fetch: true });
                console.log('Fetch ficou true');
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
    //console.log(this.state.messages);

    const ref = firebase.firestore().collection('chats').doc(this.state.messageId).collection('messages');
    messages.forEach(element => {
      //console.log(element.user._id);
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

  onReceive(text) {
    var user2 = 0;
    if (this.state.userId === 1) {
      user2 = 0;
    } else {
      user2 = 1;
    }
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 100000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: user2,
          },
        }),
      };
    });
    console.log('Recebida mensagem:', text);
  }

  attMsgs() {    
    this.setState({ messages: [] });    
    const firestore = firebase.firestore();
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
                //console.log(vai.id, '->', vai.data());
                const timestamp = vai.data().createdAt;    
                const date = new Date(timestamp.toDate());
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

  mostrarDetalhes() {
    Actions.PerguntaDetails({ materia: this.state.materia });
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
