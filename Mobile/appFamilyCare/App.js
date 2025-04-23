import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'                                         

import Login from './src/Login';
import Cadastro from './src/Cadastro';
import Home from './src/Home'
import Informa from './src/Informa'
import Alerta from './src/Alertas'

const Stack = createNativeStackNavigator();

function SplashScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Simula o tempo de carregamento
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name='Alertas' component={Alerta}/>
        <Stack.Screen name='Informa' component={Informa}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  }
});
