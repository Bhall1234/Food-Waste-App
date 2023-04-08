import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

test('renders login screen', () => {
  const { getByText } = render(<LoginScreen />);
  expect(getByText('Your Login Text')).toBeDefined();
});
