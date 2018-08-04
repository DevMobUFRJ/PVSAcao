import React from 'react';
import { Router, Scene, Stack, Actions } from 'react-native-router-flux';

import Login from './components/Login';
import HomeAdmin from './components/admin/HomeAdmin';
import HomeAluno from './components/aluno/HomeAluno';
import HomeMonitor from './components/monitor/HomeMonitor';
import PerguntaShow from './components/PerguntaShow';
import PerguntaDetails from './components/PerguntaDetails';
import ManageUsuarios from './components/admin/ManageUsuarios';
import CriarUsuario from './components/admin/CriarUsuario';
import ManagePerguntas from './components/admin/ManagePerguntas';

const Rotas = () => (
    <Router>
        <Stack key="root" >

            {/* COMMON */}
            <Scene
                key="login" component={Login} initial hideNavBar
            />
            <Scene
                sceneStyle={{ paddingTop: 50 }}
                title="Informações"
                key="perguntadetails" component={PerguntaDetails} hideNavBar={false}
                navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
                titleStyle={{ color: 'white' }}
                leftButtonIconStyle={{ tintColor: 'white' }}
            />

            {/* ALUNO */}
            <Scene 
                sceneStyle={{ paddingTop: 50 }}
                title="Minhas Perguntas"
                key="homealuno" component={HomeAluno} hideNavBar={false}
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
            <Scene
                sceneStyle={{ paddingTop: 50 }}
                key="manageusuarios" component={ManageUsuarios} title="Gerenciar Usuarios" hideNavBar={false}
                navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
                titleStyle={{ color: 'white' }}
                leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene
                sceneStyle={{ paddingTop: 50 }}
                key="criarusuario" component={CriarUsuario} title="Criar Usuario" hideNavBar={false}
                navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
                titleStyle={{ color: 'white' }}
                leftButtonIconStyle={{ tintColor: 'white' }}
            />
            <Scene
                sceneStyle={{ paddingTop: 50 }}
                key="manageperguntas" component={ManagePerguntas} title="Gerenciar Perguntas" hideNavBar={false}
                navigationBarStyle={{ backgroundColor: '#3A4A9F' }}
                titleStyle={{ color: 'white' }}
                leftButtonIconStyle={{ tintColor: 'white' }}
            />
        </Stack> 
    </Router>
);

export default Rotas;
