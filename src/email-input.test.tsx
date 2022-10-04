import 'react-native';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { EmailInput } from './email-input';
import { ReactTestInstance } from 'react-test-renderer';

describe('EmailInput', () => {
  test('onChange', () => {
    const handleChange = jest.fn();

    render(<EmailInput placeholder="test" onChange={handleChange} />);

    const el = screen.getByPlaceholderText('test');

    fireOnChange(el, '');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireOnChange(el, 'john@');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireOnChange(el, 'john@exmaple.org');
    expect(handleChange).toHaveBeenCalledWith('john@exmaple.org');
  });
});

function fireOnChange(el: ReactTestInstance, text: string) {
  fireEvent(el, 'onChange', { nativeEvent: { text } });
}
