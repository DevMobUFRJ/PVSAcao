import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

const firebase = require('firebase');
require('firebase/firestore');

export default class HomeAluno extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      fetch: false,
      email: this.props.email,
      questionsA: [],
      questionsW: [],
      materiasA: []
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
    console.log('Entrou no metodo!');
    const ref = firebase.firestore().collection('perguntas');
    const queryA = ref.where('aluno', '==', this.state.email).where('respondida', '==', true);
    const queryB = ref.where('aluno', '==', this.state.email).where('respondida', '==', false);

    queryA.get().then(
      (querySnap) => {
        querySnap.forEach((doc) => {
          console.log(doc.id, '=>', doc.data());
          const perguntaR = this.state.questionsA.concat(doc.data().titulo);
          //const matR = this.state.questionsA.concat(doc.data().materia);
          //this.setState({ materiasA: matR });
          this.setState({ questionsA: perguntaR });
        });
        console.log(this.state.questionsA);
        this.setState({ fetch: true });
        console.log(this.state.fetch);
      }      
    );

    queryB.get().then(
      (querySnap) => {
        querySnap.forEach((doc) => {
          console.log(doc.id, '=>', doc.data());
          const perguntaE = this.state.questionsW.concat(doc.data().titulo);
          this.setState({ questionsW: perguntaE });
        });
        console.log(this.state.questionsW);
        this.setState({ fetch: true });
        console.log(this.state.fetch);
      }
    );
  } 

  render() {
    if (!this.state.fetch) { 
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
          <ActivityIndicator size='large' color="#616EB2" />
        </View>
      ); 
    }
    const { principal, perguntas, novaPergunta, txtBotao, botao, perguntasI, listRow, materiasI } = styles;
    return (  
        <View style={principal} >
        <ScrollableTabView renderTabBar={() => <ScrollableTabBar />} >

          <View style={perguntas} tabLabel='RESPONDIDAS' >
            <SectionList
              sections={[
              { data: this.state.questionsA },
              ]}
              renderItem={({ item }) => (
              <View style={listRow} >
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { Actions.perguntacreate({ title: item }); }} >
                      <View >                  
                          <Text style={perguntasI}>{item}</Text>
                          <Text style={materiasI}>Matéria</Text>                  
                      </View>
                  </TouchableOpacity>
              </View>
              )}
              keyExtractor={(item, index) => index}
            />             
          </View>

          <View style={perguntas} tabLabel='AGUARDANDO' >
            <SectionList
              sections={[
              { data: this.state.questionsW },
              ]}
              renderItem={({ item }) => (
              <View style={listRow} >
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { Actions.perguntacreate({ title: item }); }} >
                      <View >                  
                          <Text style={perguntasI}>{item}</Text>
                          <Text style={materiasI} >Matéria</Text>                  
                      </View>
                  </TouchableOpacity>
              </View>
              )}
              keyExtractor={(item, index) => index}
            />             
          </View>

      </ScrollableTabView>   
          <View style={novaPergunta} >
            <TouchableOpacity activeOpacity={0.9} style={botao} onPress={() => (Alert.alert('Cria nova pergunta.'))} >
              <Text style={txtBotao} >NOVA PERGUNTA</Text>
              </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({    
  principal: {
    flex: 1,
    backgroundColor: 'white',
  },

  perguntas: {
    flex: 10,
    marginTop: 5,
  },

  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  btnPergunta: {
    flex: 1,
  },

  perguntasI: {
    color: 'black',
    fontSize: 14,
    marginLeft: 20,
    marginTop: 5,
    backgroundColor: 'white',
  },

  materiasI: {
    color: '#9BAAAD',
    fontSize: 12,
    marginLeft: 20,
  },

  novaPergunta: {
    flex: 0.1,
  },

  botao: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#616EB2',
  },

  txtBotao: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
  },
  
});
