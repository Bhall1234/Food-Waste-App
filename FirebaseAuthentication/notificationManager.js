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

const scheduleNotification = async (title, body, seconds) => {
  console.log("Notification scheduled!");
  if (await requestNotificationPermission()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        seconds: seconds,
      },
    });
  }
};

export default {
  scheduleNotification,
};
