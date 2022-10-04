import 'react-native';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { DateInput } from './date-input';
import { ReactTestInstance } from 'react-test-renderer';

describe('DateInput', () => {
  test('onChange', () => {
    const handleChange = jest.fn();

    render(
      <DateInput format="YMD" placeholder="test" onChange={handleChange} />,
    );

    const el = screen.getByPlaceholderText('test');

    fireOnChange(el, '');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireOnChange(el, '2022');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireOnChange(el, '2022/10/04');
    expect(handleChange).toHaveBeenCalledWith(new Date(2022, 9, 4));
  });

  test('separator', () => {
    render(
      <DateInput
        format="DMY"
        separator="-"
        placeholder="test"
        value={new Date(1970, 11, 1)}
      />,
    );

    const el = screen.getByPlaceholderText('test');
    expect(el.props.value).toBe('01-12-1970');
  });
});

function fireOnChange(el: ReactTestInstance, text: string) {
  fireEvent(el, 'onChange', { nativeEvent: { text } });
}
