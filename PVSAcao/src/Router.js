import React from 'react';
import { Router, Scene, Stack, Actions } from 'react-native-router-flux';

import Login from './components/Login';
import HomeAdmin from './components/admin/HomeAdmin';
import HomeAluno from './components/aluno/HomeAluno';
import HomeMonitor from './components/monitor/HomeMonitor';
import PerguntaShow from './components/PerguntaShow';
import PerguntaDetails from './components/PerguntaDetails';

const Rotas = () => (
    <Router>
        <Stack key="root" >

            {/* COMMON */}
            <Scene key="login" component={Login} initial hideNavBar />
            <Scene
                sceneStyle={{ paddingTop: 50 }}
                key="perguntadetails" component={PerguntaDetails} hideNavBar={false} title="Informações"
                navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
                titleStyle={{ color: 'white' }}
                leftButtonIconStyle={{ tintColor: 'white' }}
            />

            {/* ALUNO */}
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="homealuno" component={HomeAluno} title="Minhas Perguntas" hideNavBar={false} 
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene
                sceneStyle={{ paddingTop: 50 }}
                key="perguntashow" component={PerguntaShow} hideNavBar={false}
                onRight={() => (Actions.perguntadetails())}
                rightButtonImage={require('./imgs/icons/ic_info_outline_white_24dp.png')}
                rightButtonStyle={{ resizeMode: 'contain', }}
                navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
                titleStyle={{ color: 'white' }}
                leftButtonIconStyle={{ tintColor: 'white' }}
            />

            {/* MONITOR */}
            <Scene 
            sceneStyle={{ paddingTop: 50 }}
            key="homemonitor" component={HomeMonitor} title="Perguntas" hideNavBar={false}
            navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
            titleStyle={{ color: 'white' }}
            leftButtonIconStyle={{ tintColor: 'white' }}
            />

            {/* ADMIN */}
            <Scene
                sceneStyle={{ paddingTop: 50 }}
                key="homeadmin" component={HomeAdmin} title="Administração" hideNavBar={false}
                navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
                titleStyle={{ color: 'white' }}
                leftButtonIconStyle={{ tintColor: 'white' }}
            />
        </Stack> 
    </Router>
);

export default Rotas;
