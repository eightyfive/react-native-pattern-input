import 'react-native';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { UsernameInput } from './username-input';
import { ReactTestInstance } from 'react-test-renderer';

describe('UsernameInput', () => {
  test('onValueChange', () => {
    const handleChange = jest.fn();

    render(
      <UsernameInput
        placeholder="test"
        onValueChange={handleChange}
        value="j"
      />,
    );

    const el = screen.getByPlaceholderText('test');

    fireKeyPress(el, 'o');
    expect(handleChange).toHaveBeenCalledWith('jo');

    fireKeyPress(el, '!');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireKeyPress(el, 'Backspace');
    expect(handleChange).toHaveBeenCalledWith('jo');

    fireKeyPress(el, '8');
    expect(handleChange).toHaveBeenCalledWith('jo8');
  });
});

function fireKeyPress(el: ReactTestInstance, key: string) {
  fireEvent(el, 'onKeyPress', { nativeEvent: { key } });
}
