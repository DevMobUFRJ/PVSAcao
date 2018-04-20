import React from 'react';
import { Router, Scene, Stack, Actions } from 'react-native-router-flux';

import Login from './components/Login';
import HomeAluno from './components/aluno/HomeAluno';
import HomeMonitor from './components/monitor/HomeMonitor';
import PerguntaCreate from './components/PerguntaCreate';
import PerguntaShow from './components/PerguntaShow';

const Rotas = () => (
    <Router>
        <Stack key="root" >
            <Scene key="login" component={Login} initial hideNavBar />
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="homealuno" component={HomeAluno} title="Minhas Perguntas" hideNavBar={false} 
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="homemonitor" component={HomeMonitor} title="Minhas Perguntas" hideNavBar={false} 
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="perguntacreate" component={PerguntaCreate} hideNavBar={false} 
            onRight={() => (Actions.perguntashow())}
            rightButtonImage={require('./imgs/icons/ic_info_outline_white_24dp.png')}
            rightButtonStyle={{ resizeMode: 'contain', }}
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="perguntashow" component={PerguntaShow} hideNavBar={false} title="Informações"             
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />           
        </Stack> 
    </Router>
);

export default Rotas;
