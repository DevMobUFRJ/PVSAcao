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
import Modal from 'react-native-modal';
import keys from '../../config/keys';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const firebase = require('firebase');
require('firebase/firestore');

export default class ManageUsuarios extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fetch: false,
            userType: this.props.userType,
            users: [],
            isModalVisible: false,
            att: false,
            test: this.props.test
        };
        this.getUsers = this.getUsers.bind(this);
        this.removeAllUsers = this.removeAllUsers.bind(this);
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
        this.getUsers();
    }

    onSwipeDown() {
        this.getUsers();
    }

    getUsers() {
        this.setState({ fetch: false });
        this.setState({ users: [] });
        console.log('Pegando usuarios');
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        const ref = firestore.collection('usuarios');
        const queryUsers = ref.where('tipo', '==', this.state.userType);

        queryUsers.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    this.setState({ users: this.state.users.concat(Object.assign({ email: doc.id }, doc.data())) });
                });
                this.setState({ fetch: true });
            }
        );
    }

    removeAllUsers() {
        console.log('Deletando todos os usuarios do tipo: ', this.state.userType);
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        const ref = firestore.collection('usuarios');
        const queryUsers = ref.where('tipo', '==', this.state.userType);

        queryUsers.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {                    
                    ref.doc(doc.id).delete().then(() => {
                        console.log('Deletado o usuario: ', doc.nome);
                    });
                });
                this.setState({ fetch: true });
                this.setState({ users: [] });
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
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        return (
                        
            <View style={styles.principal}>               
                <Modal isVisible={this.state.isModalVisible} animationInTiming={300}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignContent: 'center',
                            backgroundColor: 'white', 
                            height: 200,
                            borderRadius: 5
                        }}
                    >
                        <View style={styles.modalTexts}>
                            <Text style={styles.modalTexts} >
                                Tem certeza que deseja remover TODOS
                                os usuários do tipo {this.state.userType}?
                            </Text>
                        </View>
                        <View style={styles.containerButtons}>
                            <TouchableOpacity
                                style={styles.modalButtons} activeOpacity={0.9}
                                onPress={() => this.setState({ isModalVisible: false })}
                            >
                                <Text style={{ color: 'white' }}>FECHAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtons} activeOpacity={0.9}
                                onPress={() => this.removeAllUsers()}
                            >
                                <Text style={{ color: 'white' }}>APAGAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.perguntas}>
                    <GestureRecognizer
                        onSwipeDown={(state) => this.onSwipeDown(state)}
                        config={config}
                    >
                    <SectionList
                        sections={[
                            { data: this.state.users },
                        ]}
                        renderItem={({ item }) => (
                            <View style={styles.listRow}>
                                <TouchableOpacity
                                    style={{ flex: 1 }} activeOpacity={0.5}
                                    onPress={() => {
                                        Actions.deletarusuario({ userType: this.state.userType, userName: item.nome, userEmail: item.email, userTurma: item.turma, userMateria: item.materia });
                                    }}
                                >
                                    <View>
                                        <Text style={styles.perguntasI}>{ item.nome }</Text>
                                        <Text style={styles.materiasI}>{ item.email }</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => index}
                    />
                    </GestureRecognizer>
                </View>

                <View style={styles.novaPergunta}>
                    <TouchableOpacity
                        activeOpacity={0.9} style={[styles.botao, styles.botaoBg1]}
                        onPress={() => {
                            Actions.criarusuario({ userType: this.state.userType });
                        }}
                    >
                        <Text style={styles.txtBotao}>
                            NOVO { this.state.userType.toUpperCase() }
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9} style={[styles.botao, styles.botaoBg2]}
                        onPress={() => (this.setState({ isModalVisible: true }))}
                    >
                        <Text style={styles.txtBotao}>APAGAR TODOS</Text>
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
        flex: 1,
        flexDirection: 'row'
    },

    botao: {
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row'
    },

    botaoBg1: {
        backgroundColor: '#09af00'
    },

    botaoBg2: {
        backgroundColor: '#c33d26'
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

    modalTexts: {
        margin: 10
    }

});
