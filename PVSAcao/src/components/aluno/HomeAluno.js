import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SectionList,
    Alert,
    ActivityIndicator,
    TextInput,
    Picker
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView, { ScrollableTabBar,  } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal';
import keys from '../../config/keys';

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
            questionClass: 'biologia',
            tabPage: 0,
            emailMontitor: '',
        };
        this.newQuestion = this.newQuestion.bind(this);
        this.attQuestions = this.attQuestions.bind(this);
        this.getMonitorEmail = this.getMonitorEmail.bind(this);
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
        console.log('Entrou no metodo!');
        console.log('email do aluno é:', this.state.email);
        this.attQuestions();
    }

    attQuestions() {
        this.setState({ questionsA: [] });
        this.setState({ questionsW: [] });
        console.log('Iniciou a att das perguntas!');
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        const ref = firestore.collection('perguntas');
        const queryA = ref.where('aluno', '==', this.state.email).where('respondida', '==', true);
        const queryB = ref.where('aluno', '==', this.state.email).where('respondida', '==', false);

        queryA.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    const perguntaR = this.state.questionsA.concat(doc.data().titulo);
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
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        const ref = firestore.collection('perguntas');
        ref.add({
            aluno: this.state.email,
            materia: this.state.questionClass,
            monitor: ' ',
            respondida: false,
            titulo: this.state.questionTitle,
        })
            .then((doc) => {
                console.log('Adicionada pergunta com id:', doc.id);
                Alert.alert('Pergunta adicionada!');
                this.setState({ tabPage: 1 });
            })
            .catch((error) => {
                console.error('Erro ao adicionar pergunta:', error);
            });
        this.setState({ isVisible: false });
        this.attQuestions();
    }

    getMonitorEmail(titulo) {
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        const ref = firestore.collection('perguntas');
        const queryA = ref.where('aluno', '==', this.state.email).where('titulo', '==', titulo);
        queryA.get().then((querySnap) => {
            querySnap.forEach((doc) => {
                this.setState({ emailMontitor: doc.data().monitor });
            });
        });
        Actions.perguntashow({ title: titulo, emailAluno: this.state.email, emailMonitor: this.state.emailMontitor, userId: 0 });
    }

    render() {
        console.log('render chamado');
        if (!this.state.fetch) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' color="#616EB2" />
                </View>
            );
        }
        const { principal, perguntas, novaPergunta, txtBotao, botao, perguntasI, listRow, materiasI, modalTexts, modalInput, modalButtons, containerButtons } = styles;
        return (
            <View style={principal}>
                <Modal isVisible={this.state.isVisible} animationInTiming={300}>
                    <View
                    style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        backgroundColor: 'white',
                        height: 250
                    }}
                    >
                        <View style={modalTexts}>
                            <TextInput
                            style={modalInput} placeholder='Titulo da pergunta' 
                            onChangeText={(t) => {
                                this.setState({ questionTitle: t });
                            }} 
                            />
                            <Picker
                            style={modalInput}
                                mode='dropdown'
                                selectedValue={this.state.questionClass}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ questionClass: itemValue });
                                }}
                            >
                                <Picker.Item label='Biologia' value='biologia' />
                                <Picker.Item label='Matematica' value='matematica' />
                            </Picker>
                        </View>
                        <View style={containerButtons}>
                            <TouchableOpacity
                            style={modalButtons} activeOpacity={0.9}
                            onPress={() => this.setState({ isVisible: false })}
                            >
                                <Text style={{ color: 'white' }}>FECHAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={modalButtons} activeOpacity={0.9}
                            onPress={() => this.newQuestion()}
                            >
                                <Text style={{ color: 'white' }}>ENVIAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <ScrollableTabView page={this.state.tabPage} renderTabBar={() => <ScrollableTabBar />}>

                    <View style={perguntas} tabLabel='RESPONDIDAS'>
                        <SectionList
                            sections={[
                                { data: this.state.questionsA },
                            ]}
                            renderItem={({ item }) => (
                                <View style={listRow}>
                                    <TouchableOpacity
                                    style={{ flex: 1 }} activeOpacity={0.5} 
                                    onPress={() => {
                                        this.getMonitorEmail(item);
                                    }}
                                    >
                                        <View>
                                            <Text style={perguntasI}>{item}</Text>
                                            <Text style={materiasI}>Matéria</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index}
                        />
                    </View>

                    <View style={perguntas} tabLabel='AGUARDANDO'>
                        <SectionList
                            sections={[
                                { data: this.state.questionsW },
                            ]}
                            renderItem={({ item }) => (
                                <View style={listRow}>
                                    <TouchableOpacity
                                    style={{ flex: 1 }} activeOpacity={0.5} onPress={() => {
                                        this.getMonitorEmail(item);
                                    }}
                                    >
                                        <View>
                                            <Text style={perguntasI}>{item}</Text>
                                            <Text style={materiasI}>Matéria</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index}
                        />
                    </View>

                </ScrollableTabView>
                <View style={novaPergunta}>
                    <TouchableOpacity
                    activeOpacity={0.9} style={botao}
                                      onPress={() => (this.setState({ isVisible: true }))}
                    >
                        <Text style={txtBotao}>NOVA PERGUNTA</Text>
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

    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalButtons: {
        margin: 10,
        backgroundColor: '#616EB2',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: 80,
    },

    modalInput: {
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },

});
