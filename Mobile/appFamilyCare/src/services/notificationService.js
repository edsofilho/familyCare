import { Alert } from 'react-native';

const notificationService = {
  showLocalNotification: (title, body) => {
    Alert.alert(title, body);
  },
  // Métodos vazios para manter compatibilidade
  registerForPushNotificationsAsync: async () => null,
  sendTokenToServer: async () => false,
  scheduleLocalNotification: async () => 'dummy-notification-id',
  cancelScheduledNotification: async () => true,
  cancelAllScheduledNotifications: async () => true,
  addNotificationReceivedListener: () => ({ remove: () => {} }),
  addNotificationResponseReceivedListener: () => ({ remove: () => {} }),
  removeNotificationSubscription: () => {}
};

export default notificationService;
