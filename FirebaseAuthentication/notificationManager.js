import * as Notifications from 'expo-notifications';

const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('No notification permissions granted!');
    console.log("No notification permissions granted!");
    return false;
  }
  return true;
};

const scheduleNotification = async (content) => {
  console.log("Notification scheduled!");
  if (await requestNotificationPermission()) {
    await Notifications.scheduleNotificationAsync({
      content: content,
      trigger: {
        seconds: 1,
      },
    });
  }
};

export default {
  scheduleNotification,
};
