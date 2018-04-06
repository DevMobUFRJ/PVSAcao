import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Alert,
} from 'react-native';
import Swipeout from 'react-native-swipeout';

const direita = [
  {
    text: 'Excluir',
    onPress: () => { Alert.alert('Exclui pergunta'); },
    type: 'delete',
  }
];

export default class LoginAluno extends Component {
  render() {
    const { principal, perguntas, novaPergunta, txtBotao, botao, perguntasI, perguntasH, listRow, materiasI, containerP } = styles;
    return (       
        <View style={principal}>
          <View style={perguntas} >
            <SectionList
              sections={[
              { title: 'Respondidas', data: ['Pergunta 1', 'Pergunta 2', 'Pergunta 3'] },
              { title: 'Aguardando Resposta', data: ['Pergunta 4'] },
              ]}
              renderItem={({ item }) => (
              <View style={listRow} >
              
                <Swipeout right={direita} backgroundColor='white' style={containerP} >
                    <View >                  
                        <Text style={perguntasI}>{item}</Text>
                        <Text style={materiasI} >Matéria</Text>                  
                    </View>
                </Swipeout>
              </View>
              )}
              renderSectionHeader={({ section }) => <Text style={perguntasH}>{section.title}</Text>}
              keyExtractor={(item, index) => index}
            />             
          </View>

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

  containerP: {
    flex: 1,    
  },

  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  txtDelete: {
    color: 'black',
  },

  btnDelete: {
    fontSize: 14,
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 20,
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

  perguntasH: {
    lineHeight: 30,
    borderBottomColor: '#9BAAAD',
    borderBottomWidth: 1,
    color: '#9BAAAD',
    fontSize: 16,
    marginLeft: 10,
  },

  novaPergunta: {
    flex: 1,
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
