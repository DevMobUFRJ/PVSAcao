import React from 'react';
import Image from 'react-native';
import { Router, Scene, Stack, Actions } from 'react-native-router-flux';

import Principal from './components/Principal';
import LoginAluno from './components/LoginAluno';
import LoginMonitor from './components/LoginMonitor';
import Pergunta from './components/Pergunta';
import InfoPergunta from './components/InfoPergunta';

const Rotas = () => (
    <Router>
        <Stack key="root" >
            <Scene key="principal" component={Principal} initial hideNavBar />
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="loginaluno" component={LoginAluno} title="Minhas Perguntas" hideNavBar={false} 
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="loginmonitor" component={LoginMonitor} title="Minhas Perguntas" hideNavBar={false} 
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="pergunta" component={Pergunta} hideNavBar={false} 
            onRight={() => (Actions.infopergunta())}
            rightButtonImage={require('./imgs/ic_info_outline_white_24dp.png')}
            rightButtonStyle={{ resizeMode: 'contain', }}
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="infopergunta" component={InfoPergunta} hideNavBar={false} title="Informações"             
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />           
        </Stack> 
    </Router>
);

export default Rotas;
