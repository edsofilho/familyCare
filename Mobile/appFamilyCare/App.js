import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './src/context/UserContext';

import Login from './src/Login';
import Cadastro from './src/Cadastro';
import HomeCuidador from './src/HomeCuidador';
import HomeIdoso from './src/HomeIdoso';
import EntrarFamilia from './src/EntrarFamilia';
import CadastrarIdoso from './src/CadastrarIdoso';
import CadastroCuidador from './src/CadastroCuidador';
import Solicitacoes from './src/Solicitacoes';
import ConectarColeteCare from './src/ConectarColeteCare';
import Alertas from './src/Alertas';
import AlertaEnviado from './src/AlertaEnviado';
import Medicacao from './src/Medicacao';
import Tratamentos from './src/Tratamentos';
import Doencas from './src/Doencas';
import Historico from './src/Historico';
import Informacoes from './src/Informacoes';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="HomeCuidador" component={HomeCuidador} />
          <Stack.Screen name="HomeIdoso" component={HomeIdoso} />
          <Stack.Screen name="EntrarFamilia" component={EntrarFamilia} />
          <Stack.Screen name="CadastrarIdoso" component={CadastrarIdoso} />
          <Stack.Screen name="CadastroCuidador" component={CadastroCuidador} />
          <Stack.Screen name="Solicitacoes" component={Solicitacoes} />
          <Stack.Screen name="ConectarColeteCare" component={ConectarColeteCare} />
          <Stack.Screen name="Alertas" component={Alertas} />
          <Stack.Screen name="AlertaEnviado" component={AlertaEnviado} />
          <Stack.Screen name="Medicacao" component={Medicacao} />
          <Stack.Screen name="Tratamentos" component={Tratamentos} />
          <Stack.Screen name="Doencas" component={Doencas} />
          <Stack.Screen name="Historico" component={Historico} />
          <Stack.Screen name="Informacoes" component={Informacoes} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
