import 'react-native';
import React from 'react';

import { render, screen } from '@testing-library/react-native';
import { UsernameInput } from './username-input';
import { fireChangeText } from './test-utils';

describe('UsernameInput', () => {
  test('onValueChange', () => {
    const handleChange = jest.fn();

    render(
      <UsernameInput
        placeholder="test"
        onValueChange={handleChange}
        value="john"
      />,
    );

    const el = screen.getByPlaceholderText('test');

    fireChangeText(el, 'john!');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireChangeText(el, 'john8');
    expect(handleChange).toHaveBeenCalledWith('john8');
  });
});
