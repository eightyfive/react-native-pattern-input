import { ReactTestInstance } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

export function fireChangeText(el: ReactTestInstance, text: string) {
  fireEvent.changeText(el, text);
}
