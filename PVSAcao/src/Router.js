import React from 'react';
import { Router, Scene, Stack } from 'react-native-router-flux';

import Principal from './components/Principal';
import LoginAluno from './components/LoginAluno';

const Rotas = () => (
    <Router sceneStyle={{}} >
        <Stack key="root" >
            <Scene key="principal" component={Principal} initial hideNavBar />
            <Scene key="loginaluno" component={LoginAluno} title="Minhas Perguntas" hideNavBar={false} />
        </Stack> 
    </Router>
);

export default Rotas;
