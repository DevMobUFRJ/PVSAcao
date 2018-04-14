import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
export default class LoginAluno extends Component {
  render() {
    const { principal, perguntas, novaPergunta, txtBotao, botao, perguntasI, listRow, materiasI } = styles;
    return (  
        <View style={principal} tabLabel='RESPONDIDAS' >
        <ScrollableTabView renderTabBar={() => <ScrollableTabBar />} >
        
          <View style={perguntas} tabLabel='RESPONDIDAS' >
            <SectionList
              sections={[
              { data: ['Pergunta 1', 'Pergunta 2', 'Pergunta 3'] },
              ]}
              renderItem={({ item }) => (
              <View style={listRow} >
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { Actions.pergunta({ title: item }); }} >
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

          <View style={perguntas} tabLabel='AGUARDANDO' >
            <SectionList
              sections={[
              { data: ['Pergunta 4', 'Pergunta 5', 'Pergunta 6'] },
              ]}
              renderItem={({ item }) => (
              <View style={listRow} >
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { Actions.pergunta({ title: item }); }} >
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
