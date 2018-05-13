import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux/index';

export default class HomeAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: this.props.email
        };
    }

    componentWillMount() {
    }

    render() {
        return (
            <View style={styles.main}>
                <View style={[styles.row, styles.bg1]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.button}
                        onPress={() => {
                            Actions.manageusuarios({ userType: 'aluno' });
                        }}
                    >
                        <Text style={styles.buttonTxt}>Gerenciar Alunos</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.row, styles.bg2]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.button}
                        onPress={() => {
                            Actions.manageusuarios({ userType: 'monitor' });
                        }}
                    >
                        <Text style={styles.buttonTxt}>Gerenciar Monitores</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.row, styles.bg3]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.button}
                        onPress={() => (this.setState({isVisible: true}))}
                    >
                        <Text style={styles.buttonTxt}>Gerenciar Perguntas</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    bg1: {
        backgroundColor: '#dd6060'
    },
    bg2: {
        backgroundColor: '#ceaa33'
    },
    bg3: {
        backgroundColor: '#719Ed2'
    },
    button: {
    },
    buttonTxt: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
    }
});
