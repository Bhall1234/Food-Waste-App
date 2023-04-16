import { render, fireEvent, waitFor } from '@testing-library/react-native';

import FoodDatabaseScreen from '../screens/FoodDatabaseScreen';

// Mock the auth and firestore modules
jest.mock('firebase/app', () => {
  const auth = {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  };

  const firestore = {
    collection: jest.fn(),
    onSnapshot: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
  };

  return { getAuth: () => auth, getFirestore: () => firestore };
});

// Write your tests below

describe('FoodDatabaseScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<FoodDatabaseScreen />);
    expect(getByPlaceholderText('Search virtual pantry...')).toBeTruthy();
  });

  // Add more tests here
});