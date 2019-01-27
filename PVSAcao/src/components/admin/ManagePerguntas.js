import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SectionList,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal';
import keys from '../../config/keys';

const firebase = require('firebase');
require('firebase/firestore');

export default class ManagePerguntas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fetch: false,
            userType: this.props.userType,
            perguntas: [],
            isModalVisible: false
        };
        this.getPerguntas = this.getPerguntas.bind(this);
        this.removeAllPerguntas = this.removeAllPerguntas.bind(this);
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
        this.getPerguntas();
    }

    getPerguntas() {
        console.log('Pegando perguntas');
        const firestore = firebase.firestore();
        const ref = firestore.collection('perguntas');

        ref.get().then(
            (querySnap) => {
                if (querySnap.docs.length === 0) {
                    Alert.alert('Sem perguntas!');
                    this.setState({ fetch: true });
                } else {
                    querySnap.forEach((doc) => {
                        this.setState({ 
                            perguntas: this.state.perguntas.concat(Object.assign({ email: doc.aluno }, doc.data())) 
                        });
                        console.log(doc.data());
                    });
                    this.setState({ fetch: true });
                }
            }
        );
    }

    removeAllPerguntas() {
        this.setState({ fetch: false });
        console.log('Deletando todas as perguntas');
        const firestore = firebase.firestore();
        const ref = firestore.collection('perguntas');

        ref.get().then(
            (querySnap) => {
                querySnap.forEach((doc) => {
                    this.setState({ perguntas: [] });
                    ref.doc(doc.id).delete().then(() => {
                        console.log('Deletada pergunta:', doc.titulo);
                    });
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
                   <View  
                        style={styles.modalTexts}                        
                   >
                       <Text style={styles.modalTexts} >
                           Tem certeza que deseja remover todas
                           as perguntas?
                       </Text>
                   </View>
                   <View style={styles.containerButtons}>
                       <TouchableOpacity
                            style={styles.modalButtons} activeOpacity={0.9}
                            onPress={() => this.setState({ isModalVisible: false})}
                       >
                            <Text style={{ color: 'white' }}>FECHAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButtons} activeOpacity={0.9}
                            onPress={() => this.removeAllPerguntas()}
                        >
                            <Text style={{ color: 'white' }}>APAGAR</Text>
                            </TouchableOpacity>
                   </View>
                   </View>
               </Modal>

               <View style={styles.perguntas}>
                   <SectionList
                        sections={[
                            { data: this.state.perguntas },
                        ]}
                        renderItem={({ item }) => (
                            <View style={styles.listRow}>
                                <TouchableOpacity
                                    style={{ flex: 1 }} activeOpacity={0.5}
                                >
                                    <View>
                                        <Text style={styles.primario} > {item.titulo} </Text>
                                            <View style={styles.secundario} >
                                                <Text style={styles.materiasJ} > {item.aluno} </Text>
                                                <Text style={styles.materiasI} > {item.materia} </Text>
                                            </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => index}
                   />
               </View>
            
               <View style={styles.novaPergunta}>                   
                    <TouchableOpacity
                        activeOpacity={0.9} style={[styles.botao, styles.botaoBg2]}
                        onPress={() => {this.setState({ isModalVisible: true })}}
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

    primario: {
        color: 'black',
        fontSize: 14,
        marginLeft: 20,
        marginTop: 5,
        backgroundColor: 'white',
    },

    secundario: {
        flexDirection: 'row'
    },

    materiasI: {
        color: '#9BAAAD',
        fontSize: 12,
        marginLeft: 20,
        borderLeftWidth: 1,
        paddingLeft: 20        
    },

    materiasJ: {
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
        borderRadius: 3,
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
