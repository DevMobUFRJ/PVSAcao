import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import constantes from '../config/constants';
import keys from '../config/keys';

const alunoI = require('../imgs/icons/ic_people_black_24dp.png');
const turmaI = require('../imgs/icons/ic_school_black_24dp.png');
const monitorI = require('../imgs/icons/ic_person_black_24dp.png');
const firebase = require('firebase');
require('firebase/firestore');

export default class PerguntaDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chat: constantes.currentChat.data(),
            aluno: '',
            monitor: '',
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

        firestore.collection('usuarios').doc(this.state.chat.aluno).get().then(
            (doc) => {
                if (doc.exists) {
                    this.setState({ aluno: doc.data() });
                }
            }
        );

        if (this.state.chat.monitor !== '') {
            firestore.collection('usuarios').doc(this.state.chat.monitor).get().then(
                (doc) => {
                    if (doc.exists) {
                        this.setState({ monitor: doc.data() });
                    }
                }
            );
        } else {
            this.setState({ monitor: 'Sem monitor' });
        }
    }

    duvidaSolucionada() {
        constantes.currentPergunta.ref.update({ respondida: true });
        constantes.currentChat.ref.update({ respondida: true });
        Alert.alert('Sucesso', 'Pergunta resolvida!',
    [{ text: 'OK',
            onPress: () => {
                Actions.pop();
                Actions.pop();
            } }, {}, {}],
            { cancelable: false }
        );
    }


    render() {
        const { container, aluno, nomeA, nomeB, monitor, textos, botoes, botaoS, textosB,
            icons, monitorA } = styles;

        let perguntaRespondidaJsx = '';

        if(constantes.currentPergunta.data().respondida){
            perguntaRespondidaJsx =
                <View>
                    <Text
                        style={{ alignSelf: 'center',
                            fontWeight: 'bold',
                            color: 'black',
                            marginBottom: 20,
                            fontSize: 16 }}
                    >
                        Dúvida solucionada!</Text>
                </View>;
        } else {
            perguntaRespondidaJsx =
                <View>
                    <Text
                        style={{ alignSelf: 'center',
                            fontWeight: 'bold',
                            color: 'black',
                            marginBottom: 20,
                            fontSize: 16 }}
                        >
                            A dúvida já foi solucionada?</Text>
                        <View style={botoes}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={botaoS}
                            onPress={() => this.duvidaSolucionada()}
                        >
                            <Text style={textosB}>SIM</Text>
                        </TouchableOpacity>
                    </View>
                </View>;
        }

        return (
            <View style={container}>
                <View style={aluno}>
                    <Text>Aluno</Text>
                    <View style={nomeA}>
                        <Image source={alunoI} style={icons} />
                        <Text style={textos}>{ this.state.aluno.nome }</Text>
                    </View>

                    <View style={nomeB}>
                        <Image source={turmaI} style={icons} />
                        <Text style={textos}>Turma { this.state.aluno.turma }</Text>
                    </View>
                </View>

                <View style={monitor}>
                    <Text>Monitor</Text>
                    <View style={monitorA}>
                        <Image source={monitorI} style={icons} />
                        <Text style={textos}>
                            { this.state.monitor.nome }
                        </Text>
                    </View>
                </View>

                <View style={monitor}>
                    <Text style={{ fontSize: 16 }}>Pergunta: { this.state.chat.titulo }</Text>
                    <Text style={{ fontSize: 16 }}>Matéria: { this.state.chat.materia }</Text>
                </View>

                {perguntaRespondidaJsx}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignContent: 'center',
    },

    aluno: {
        margin: 10,
        borderBottomColor: '#d9dbde',
        borderBottomWidth: 1
    },

    nomeA: {
        marginTop: 10,
        flexDirection: 'row',
    },

    nomeB: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
    },

    monitor: {
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
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },

    botaoS: {
        borderRadius: 1,
        justifyContent: 'center',
        height: 40,
        width: 100,
        marginRight: 5,
        backgroundColor: '#55C24A',
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
