import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PhotoScreen from '../screens/PhotoScreen';
import notificationManager from '../notificationManager';

jest.mock('../notificationManager', () => ({
    scheduleNotification: jest.fn(),
  }));
  
test('schedules a notification when the item will expire in more than 2 days', async () => {
  // Set the current date and the expiry date for the test
  const currentDate = new Date();
  const expiryDate = new Date(currentDate);
  expiryDate.setDate(expiryDate.getDate() + 3);

  // Call the sendExpiringItemNotifications function with the test data
  await sendExpiringItemNotifications(currentDate, expiryDate);

  // Check if the notificationManager.scheduleNotification function was called with the correct arguments
  expect(notificationManager.scheduleNotification).toHaveBeenCalledWith(
    'Item Expiring Soon',
    'Item will expire in 2 days. Please consume or dispose of it.',
    expect.objectContaining({
      seconds: expect.any(Number),
      channelId: 'default',
    })
  );
});
