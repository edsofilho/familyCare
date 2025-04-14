import React from 'react';
import { StyleSheet,Text,View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigato } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Splash from './src/Splash';
import Login from './src/Login';
import Home from './src/Home';




export default function App() {
  return (
    <View style={styles.container}>
      <Text>PENIS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
