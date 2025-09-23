import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Configurar como as notificações devem ser tratadas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
  }

  // Registrar para receber notificações push
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2E86C1',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permissão para notificações negada');
        return null;
      }
      
      try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        this.expoPushToken = token;
        console.log('Token de notificação:', token);
        
        // Salvar token no AsyncStorage
        await AsyncStorage.setItem('expoPushToken', token);
        
        return token;
      } catch (error) {
        console.error('Erro ao obter token de notificação:', error);
        return null;
      }
    } else {
      console.log('Deve usar um dispositivo físico para notificações push');
      return null;
    }
  }

  // Enviar token para o servidor
  async sendTokenToServer(userId, userType) {
    try {
      if (!this.expoPushToken) {
        console.log('Token não disponível');
        return false;
      }

      const response = await api.post('/registerPushToken.php', {
        userId: userId,
        userType: userType,
        pushToken: this.expoPushToken,
        platform: Platform.OS
      });

      if (response.data.success) {
        console.log('Token enviado com sucesso para o servidor');
        return true;
      } else {
        console.log('Erro ao enviar token:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Erro ao enviar token para servidor:', error);
      return false;
    }
  }

  // Mostrar notificação local
  async showLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data,
          sound: 'default',
        },
        trigger: null, // Mostrar imediatamente
      });
    } catch (error) {
      console.error('Erro ao mostrar notificação local:', error);
    }
  }

  // Configurar listener para notificações recebidas
  addNotificationReceivedListener(listener) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Configurar listener para quando o usuário toca na notificação
  addNotificationResponseReceivedListener(listener) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Remover listeners
  removeNotificationSubscription(subscription) {
    Notifications.removeNotificationSubscription(subscription);
  }

  // Obter token salvo
  async getStoredToken() {
    try {
      const token = await AsyncStorage.getItem('expoPushToken');
      if (token) {
        this.expoPushToken = token;
        return token;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter token salvo:', error);
      return null;
    }
  }

  // Limpar token
  async clearToken() {
    try {
      await AsyncStorage.removeItem('expoPushToken');
      this.expoPushToken = null;
    } catch (error) {
      console.error('Erro ao limpar token:', error);
    }
  }

  // Verificar se as notificações estão habilitadas
  async areNotificationsEnabled() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  // Solicitar permissões novamente
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }
}

// Criar instância única do serviço
const notificationService = new NotificationService();

export default notificationService;

