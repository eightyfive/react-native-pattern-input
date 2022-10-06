import 'react-native';
import React from 'react';

import { render, screen } from '@testing-library/react-native';
import { DateInput } from './date-input';
import { fireChangeText } from './test-utils';

describe('DateInput', () => {
  test('onValueChange', () => {
    const handleChange = jest.fn();

    render(
      <DateInput
        format="YMD"
        placeholder="test"
        onValueChange={handleChange}
        value={new Date(2022, 11, 30)}
      />,
    );

    const el = screen.getByPlaceholderText('test');
    expect(el.props.value).toBe('2022/12/30');

    fireChangeText(el, '2022/12/3');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireChangeText(el, '2022/12/31');
    expect(handleChange).toHaveBeenCalledWith(new Date(2022, 11, 31));
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
