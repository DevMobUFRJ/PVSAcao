import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

const alunoI = require('../imgs/icons/ic_people_black_24dp.png');
const turmaI = require('../imgs/icons/ic_school_black_24dp.png');
const monitorI = require('../imgs/icons/ic_person_black_24dp.png');

export default class InfoPergunta extends Component {
  render() {
    const { container, aluno, nomeA, monitor, textos, botoes, botaoS, botaoN, textosB, icons, monitorA } = styles;
    return (
      <View style={container} >
        <View style={aluno} >
            <Text>Aluno</Text>
            <View style={nomeA}>
                <Image source={alunoI} style={icons} />
                <Text style={textos} >Nome do Aluno</Text>
            </View>

            <View style={nomeA}>
                <Image source={turmaI} style={icons} />
                <Text style={textos} >Turma</Text>
            </View>
        </View>

        <View style={monitor}>
            <Text>Monitor</Text>
            <View style={monitorA}>            
                <Image source={monitorI} style={icons} />
                <Text style={textos} >Nome do Monitor</Text>
            </View>
        </View>  

        <Text style={{ alignSelf: 'center', fontWeight: 'bold', color: 'black', marginBottom: 30, fontSize: 16 }} >Sua dúvida foi solucionada?</Text>

        <View style={botoes}>
            <TouchableOpacity activeOpacity={0.6} style={botaoS} ><Text style={textosB} >SIM</Text></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} style={botaoN} ><Text style={textosB} >NÃO</Text></TouchableOpacity>
        </View>

      </View>
      
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignContent: 'center',
        justifyContent: 'center',
    },

    aluno: {
        flex: 2,
        margin: 10,
        lineHeight: 30,
        borderBottomColor: '#9BAAAD',
        borderBottomWidth: 1,
    },

    nomeA: {
        marginTop: 10,
        flexDirection: 'row',
    },
    
    monitor: {
        flex: 7,
        margin: 10,
    },

    monitorA: {  
        marginTop: 10,      
        flexDirection: 'row',
    },

    textos: {
        fontWeight: 'bold',
        marginLeft: 25,
    },

    botoes: {
        flex: 2,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },

    botaoS: {   
        borderRadius: 1, 
        justifyContent: 'center',   
        height: 30,
        width: 100,
        marginRight: 5,
        backgroundColor: '#55C24A',
    },

    botaoN: {
        borderRadius: 1,
        justifyContent: 'center',
        height: 30,
        width: 100,
        marginLeft: 5,
        backgroundColor: '#FF4745',
    },

    textosB: {
        color: '#FFF',
        alignSelf: 'center',
    },

    icons: {
        resizeMode: 'contain',
        height: 20,
        width: 20,
    },
    
  
});
