import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Check for the notification permissions
const requestNotificationPermission = async () => {

  if (Platform.OS !== 'web') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No notification permissions granted!');
      return false;
    }
  } else {
    alert('Must use a physical device for Push Notifications');
    return false;
  }

  return true;
};

// Schedule the notification
const scheduleNotification = async (title, body, trigger) => {
  if (await requestNotificationPermission()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: trigger,
    });
  }
};

export default {
  scheduleNotification,
};
