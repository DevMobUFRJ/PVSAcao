import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { Actions } from 'react-native-router-flux/index';
import { Button } from 'react-native-elements';

export default class HomeAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: this.props.email
        };
    }

    render() {
        return (
            <View style={styles.main}>
                <Button
                    raised
                    large
                    rightIcon={{name: 'school'}}
                    title='Gerenciar Alunos'
                    buttonStyle={[styles.button, styles.bg1]}
                    onPress={() => {
                        Actions.manageusuarios({ userType: 'aluno' });
                    }}
                />
                <Button
                    raised
                    large
                    rightIcon={{name: 'user-circle', type: 'font-awesome'}}
                    title='Gerenciar Monitores'
                    buttonStyle={[styles.buttonMargin, styles.bg2]}
                    onPress={() => {
                        Actions.manageusuarios({ userType: 'monitor' });
                    }}
                />
                <Button
                    raised
                    large
                    rightIcon={{name: 'help'}}
                    title='Gerenciar Perguntas'
                    buttonStyle={[styles.buttonMargin, styles.bg3]}
                    onPress={() => {
                        Actions.manageperguntas();
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    bg1: {
        backgroundColor: '#00d1dc'
    },
    bg2: {
        backgroundColor: '#00a4dc'
    },
    bg3: {
        backgroundColor: '#0062d2'
    },
    buttonMargin: {
        marginTop: 15
    }
});
