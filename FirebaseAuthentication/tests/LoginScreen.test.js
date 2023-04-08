import React from 'react';
import renderer from 'react-test-renderer';
import LoginScreen from '../screens/LoginScreen';

test('renders login screen', () => {
  const { getByText } = renderer(<LoginScreen />);
  expect(getByText('Your Login Text')).toBeDefined();
});
