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
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal';
import keys from '../../config/keys';
import constantes from '../../config/constants';

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
        this.validateNewQuestion = this.validateNewQuestion.bind(this);
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
        this.attQuestions();
    }  

    getMonitorEmail(titulo, materia) {
        const firestore = firebase.firestore();
        const ref = firestore.collection('perguntas');
        const queryA = ref.where('aluno', '==', this.state.email).where('titulo', '==', titulo);
        queryA.get().then((querySnap) => {
            querySnap.forEach((doc) => {
                this.setState({ emailMontitor: doc.data().monitor });
            });
        });
        Actions.perguntashow({ title: titulo,
            materia: this.state.questionClass,
            emailAluno: this.state.email,
            emailMonitor: this.state.emailMontitor,
            userId: 0 });
    }

    newQuestion() {
        if (!this.validateNewQuestion()) {
            return;
        }

        const firestore = firebase.firestore();
        const ref = firestore.collection('perguntas');
        ref.add({
            aluno: this.state.email,
            materia: this.state.questionClass,
            monitor: ' ',
            respondida: false,
            titulo: this.state.questionTitle,
        })
            .then((doc) => {
                Alert.alert('Pergunta adicionada!');
                this.setState({ tabPage: 1 });
            })
            .catch((error) => {
                console.error('Erro ao adicionar pergunta:', error);
            });
        this.setState({ isVisible: false });
        this.attQuestions();
    }

    validateNewQuestion() {
        return !(this.state.questionTitle.length < 2);
    }

    attQuestions() {
        this.setState({ questionsA: [] });
        this.setState({ questionsW: [] });

        const firestore = firebase.firestore();
        const ref = firestore.collection('perguntas');
        const queryA = ref.where('aluno', '==', this.state.email).where('respondida', '==', true);
        const queryB = ref.where('aluno', '==', this.state.email).where('respondida', '==', false);

        queryA.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    const perguntaR = this.state.questionsA.concat(doc);
                    this.setState({ questionsA: perguntaR });
                });
                this.setState({ fetch: true });
            }
        );

        queryB.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    const perguntaE = this.state.questionsW.concat(doc);
                    this.setState({ questionsW: perguntaE });
                });
                this.setState({ fetch: true });
            }
        );
    }


    render() {
        if (!this.state.fetch) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' color="#616EB2" />
                </View>
            );
        }
        const { principal, perguntas, novaPergunta, txtBotao, botao, perguntasI, listRow, materiasI,
            modalTexts, modalWrapper, modalInput, modalButtons, containerButtons } = styles;
        return (
            <View style={principal}>
                <Modal isVisible={this.state.isVisible} animationInTiming={300}>
                    <View style={modalWrapper} >
                        <View style={modalTexts}>
                            <Text>Pergunta</Text>
                            <TextInput
                                style={modalInput}
                                placeholder='Digite sua dúvida...'
                                onChangeText={(t) => {
                                    this.setState({ questionTitle: t });
                                }}
                            />
                            <Text>Disciplina</Text>
                            <Picker
                                style={modalInput}
                                mode='dropdown'
                                selectedValue={this.state.questionClass}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ questionClass: itemValue });
                                }}
                            >
                                {
                                    constantes.materias.map((materia) =>
                                        <Picker.Item label={materia.nome} value={materia.value} />
                                    )
                                }
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
                <ScrollableTabView
                    page={this.state.tabPage}
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    <View style={perguntas} tabLabel='ATIVAS'>
                        <SectionList
                            sections={[
                                { data: this.state.questionsW },
                            ]}
                            renderItem={({ item }) => (
                                <View style={listRow}>
                                    <TouchableOpacity
                                        style={{ flex: 1 }} activeOpacity={0.5}
                                        onPress={() => {
                                            constantes.currentPergunta = item;
                                            this.getMonitorEmail(item.data().titulo,
                                                item.data().materia);
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
                                { data: this.state.questionsA },
                            ]}
                            renderItem={({ item }) => (
                                <View style={listRow}>
                                    <TouchableOpacity
                                    style={{ flex: 1 }} activeOpacity={0.5} 
                                    onPress={() => {
                                        constantes.currentPergunta = item;
                                        this.getMonitorEmail(item.data().titulo,
                                            item.data().materia);
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

    modalTexts: {
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
        flex: 1
    },

    modalButtons: {
        margin: 5,
        padding: 3,
        backgroundColor: '#616EB2',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: 80,
        flex: 1,
    },

    modalInput: {
        marginBottom: 10,
    },

    modalWrapper: {
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 8,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        height: 230,
    }

});
