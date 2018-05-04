import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SectionList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

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
            materiasA: []
        };
    }

    componentWillMount() {

        if(!firebase.apps.length) {
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
        const queryUnanswered = ref.where('respondida', '==', false).where("materia", "==", this.state.materia);
        const queryAnswered = ref.where('monitor', '==', this.state.email).where('respondida', '==', true);

        queryUnanswered.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    const perguntaR = this.state.unansweredQuestions.concat(doc.data().titulo);
                    this.setState({ unansweredQuestions: perguntaR });
                });
                console.log(this.state.unansweredQuestions);
                this.setState({ fetch: true });
                console.log(this.state.fetch);
            }
        );

        queryAnswered.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    const perguntaE = this.state.answeredQuestions.concat(doc.data().titulo);
                    this.setState({ answeredQuestions: perguntaE });
                });
                console.log(this.state.answeredQuestions);
                this.setState({ fetch: true });
                console.log(this.state.fetch);
            }
        );
    }

    render() {
        if (!this.state.fetch) { return <Text>CARREGANDO</Text>; }
        const { principal, perguntas, novaPergunta, txtBotao, botao, perguntasI, listRow, materiasI } = styles;
        return (
            <View style={principal} >
                <ScrollableTabView renderTabBar={() => <ScrollableTabBar />} >

                    <View style={perguntas} tabLabel='AGUARDANDO RESPOSTA' >
                        <SectionList
                            sections={[
                                { data: this.state.unansweredQuestions },
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

                    <View style={perguntas} tabLabel='RESPONDIDAS' >
                        <SectionList
                            sections={[
                                { data: this.state.answeredQuestions },
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
