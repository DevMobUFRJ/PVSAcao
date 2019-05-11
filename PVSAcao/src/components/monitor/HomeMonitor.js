import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SectionList,
    ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import keys from '../../config/keys';
import constantes from '../../config/constants';

const firebase = require('firebase');
require('firebase/firestore');

export default class HomeMonitor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fetch: false,
            email: this.props.email,
            materia: this.props.materia,
            unansweredQuestions: [],
            answeredQuestions: [],
            materiasA: [],
            perguntaAluno: ''
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
        const ref = firestore.collection('perguntas');
        const queryUnanswered = ref.where('respondida', '==', false).where('materia', '==', this.state.materia);
        const queryAnswered = ref.where('monitor', '==', this.state.email).where('respondida', '==', true);

        queryUnanswered.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    const perguntaR = this.state.unansweredQuestions.concat(doc);
                    this.setState({ unansweredQuestions: perguntaR });
                });
                this.setState({ fetch: true });
            }
        );

        queryAnswered.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    const perguntaE = this.state.answeredQuestions.concat(doc);
                    this.setState({ answeredQuestions: perguntaE });
                });
                this.setState({ fetch: true });
            }
        );
    }

    acharAluno(titulo) {
        const firestore = firebase.firestore();
        const ref = firestore.collection('perguntas');
        const queryA = ref.where('titulo', '==', titulo);
        if (this.state.perguntaAluno === '') {
            queryA.get().then(
                (querySnap) => {
                    querySnap.forEach((doc) => {
                        this.setState({ perguntaAluno: doc.data().aluno });
                        Actions.perguntashow({ title: titulo,
                            materia: this.state.materia,
                            emailMonitor: this.state.email,
                            emailAluno: this.state.perguntaAluno,
                            userId: 1 });
                    });
                }
            );            
        } else {
            Actions.perguntashow({ title: titulo,
                emailMonitor: this.state.email,
                materia: this.state.materia,
                emailAluno: this.state.perguntaAluno,
                userId: 1 });
        }      
    }

    render() {
        if (!this.state.fetch) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' color="#616EB2" />
                </View>
            );
        }
        const { principal, perguntas, perguntasI, listRow, materiasI } = styles;
        return (
            <View style={principal}>
                <ScrollableTabView renderTabBar={() => <ScrollableTabBar />}>

                    <View style={perguntas} tabLabel='ATIVAS'>
                        <SectionList
                            sections={[
                                { data: this.state.unansweredQuestions },
                            ]}
                            renderItem={({ item }) => (
                                <View style={listRow}>
                                    <TouchableOpacity
                                    activeOpacity={0.9} onPress={() => {
                                        constantes.currentPergunta = item;
                                        this.acharAluno(item.data().titulo);
                                    }}
                                    >
                                        <View>
                                            <Text style={perguntasI}>{item.data().titulo}</Text>
                                            <Text style={materiasI}>{item.data().materia}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index}
                        />
                    </View>

                    <View style={perguntas} tabLabel='SOLUCIONADAS'>
                        <SectionList
                            sections={[
                                { data: this.state.answeredQuestions },
                            ]}
                            renderItem={({ item }) => (
                                <View style={listRow}>
                                    <TouchableOpacity
                                    activeOpacity={0.9} onPress={() => {
                                        constantes.currentPergunta = item;
                                        this.acharAluno(item.data().titulo);
                                    }}
                                    >
                                        <View>
                                            <Text style={perguntasI}>{item.data().titulo}</Text>
                                            <Text style={materiasI}>{item.data().materia}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index}
                        />
                    </View>

                </ScrollableTabView>
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
