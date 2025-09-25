import { Alert } from 'react-native';

class NotificationService {
  constructor() {
    // Nada a inicializar
  }

  // Método vazio para manter compatibilidade
  async registerForPushNotificationsAsync() {
    console.log('Notificações push não suportadas nesta versão');
    return null;
  }

  // Método vazio para manter compatibilidade
  async sendTokenToServer() {
    console.log('Envio de token desativado');
    return false;
  }

  // Mostrar alerta nativo
  async showLocalNotification(title, body) {
    Alert.alert(title, body);
  }

  // Método vazio para manter compatibilidade
  async scheduleLocalNotification(title, body, date, data = {}) {
    console.log('Notificação agendada:', { title, body, date, data });
    return 'dummy-notification-id';
  }
  
  // Método vazio para manter compatibilidade
  async cancelScheduledNotification(notificationId) {
    console.log('Notificação cancelada:', notificationId);
    return true;
  }
  
  // Método vazio para manter compatibilidade
  async cancelAllScheduledNotifications() {
    console.log('Todas as notificações foram canceladas');
    return true;
  }

  // Método vazio para manter compatibilidade
  addNotificationReceivedListener(listener) {
    console.log('Listener de notificação adicionado');
    return { remove: () => {} };
  }

  // Método vazio para manter compatibilidade
  addNotificationResponseReceivedListener(listener) {
    console.log('Listener de resposta de notificação adicionado');
    return { remove: () => {} };
  }

  // Método vazio para manter compatibilidade
  removeNotificationSubscription() {
    console.log('Subscription de notificação removida');
  }
}

// Criar instância única do serviço
const notificationService = new NotificationService();

export default notificationService;
