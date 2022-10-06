import 'react-native';
import React from 'react';

import { render, screen } from '@testing-library/react-native';
import { EmailInput } from './email-input';
import { fireChangeText } from './test-utils';

describe('EmailInput', () => {
  test('onValueChange', () => {
    const handleChange = jest.fn();

    render(
      <EmailInput
        placeholder="test"
        onValueChange={handleChange}
        value="john@example"
      />,
    );

    const el = screen.getByPlaceholderText('test');

    fireChangeText(el, 'john@example.');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireChangeText(el, 'john@example.or');
    expect(handleChange).toHaveBeenCalledWith('john@example.or');

    fireChangeText(el, 'john@example.org');
    expect(handleChange).toHaveBeenCalledWith('john@example.org');
  });
});
