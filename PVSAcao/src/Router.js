import React from 'react';
import { Router, Scene, Stack } from 'react-native-router-flux';

import Principal from './components/Principal';
import LoginAluno from './components/LoginAluno';

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
        </Stack> 
    </Router>
);

export default Rotas;
