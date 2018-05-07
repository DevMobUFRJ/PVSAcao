import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Button,
  ActivityIndicator,
  TextInput,
  Picker
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal';
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
      materiasA: [],
      isVisible: false,
      questionTitle: '',
      questionClass: 'biologia'
     };
     this.newQuestion = this.newQuestion.bind(this);
     this.attQuestions = this.attQuestions.bind(this);
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
    console.log('email do aluno é:', this.state.email);
    this.attQuestions();   
  }

  attQuestions() {
    this.setState({ questionsA: [] });
    this.setState({ questionsW: [] });
    console.log('Iniciou a att das perguntas!');
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
  
  newQuestion() {
    const ref = firebase.firestore().collection('perguntas');
    ref.add({
      aluno: this.state.email,
      materia: this.state.questionClass, 
      monitor: ' ', 
      respondida: false,
      titulo: this.state.questionTitle,
    })
    .then((doc) => {
      console.log('Adicionada pergunta com id:', doc.id);
    })
    .catch((error) => {
      console.error('Erro ao adicionar pergunta:', error);
    });        
    this.setState({ isVisible: false });
    this.attQuestions();
  }  

  render() {
    console.log('render chamado');
    if (!this.state.fetch) { 
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
          <ActivityIndicator size='large' color="#616EB2" />
        </View>
      ); 
    }    
    const { principal, perguntas, novaPergunta, txtBotao, botao, perguntasI, listRow, materiasI, modalTexts } = styles;
    return (  
        <View style={principal} >
        
        <Modal isVisible={this.state.isVisible} animationInTiming={300} >
          <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'white' }} >
            <View style={modalTexts}>
              <TextInput placeholder='Titulo' onChangeText={(t) => { this.setState({ questionTitle: t }); }} />
              <Picker mode='dropdown' 
                selectedValue={this.state.questionClass} 
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ questionClass: itemValue });
                }} 
              >
                <Picker.Item label='Biologia' value='biologia' />
                <Picker.Item label='Matematica' value='matematica' />
              </Picker>
            </View>
            <Button onPress={() => this.newQuestion()} title='Enviar' />
            <Button onPress={() => this.setState({ isVisible: false })} title='Fechar' />
          </View>
        </Modal>        
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
            <TouchableOpacity activeOpacity={0.9} style={botao} onPress={() => (this.setState({ isVisible: true }))} >
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
