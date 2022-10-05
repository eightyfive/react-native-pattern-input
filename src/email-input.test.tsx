import 'react-native';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { EmailInput } from './email-input';
import { ReactTestInstance } from 'react-test-renderer';

describe('EmailInput', () => {
  test('onValueChange', () => {
    const handleChange = jest.fn();

    render(
      <EmailInput
        placeholder="test"
        onValueChange={handleChange}
        value="john@example."
      />,
    );

    const el = screen.getByPlaceholderText('test');

    fireKeyPress(el, 'o');
    expect(handleChange).not.toHaveBeenCalled();

    fireKeyPress(el, 'r');
    expect(handleChange).toHaveBeenCalledWith('john@example.or');

    fireKeyPress(el, 'g');
    expect(handleChange).toHaveBeenCalledWith('john@example.org');
  });
});

function fireKeyPress(el: ReactTestInstance, key: string) {
  fireEvent(el, 'onKeyPress', { nativeEvent: { key } });
}
