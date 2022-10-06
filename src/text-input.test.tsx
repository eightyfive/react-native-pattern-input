import 'react-native';
import React from 'react';

import { render, screen } from '@testing-library/react-native';
import { TextInput } from './text-input';
import { fireChangeText } from './test-utils';

describe('TextInput', () => {
  test('pattern', () => {
    const handleChange = jest.fn();

    render(
      <TextInput
        pattern="\d\d\d"
        placeholder="test"
        onValueChange={handleChange}
        value="1"
      />,
    );

    const el = screen.getByPlaceholderText('test');

    fireChangeText(el, '12');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireChangeText(el, '123');
    expect(handleChange).toHaveBeenCalledWith('123');
  });

  test('format', () => {
    const handleChange = jest.fn();

    render(
      <TextInput
        format="0000-00-00"
        placeholder="test"
        onValueChange={handleChange}
        value="1979"
      />,
    );

    const el = screen.getByPlaceholderText('test');
    expect(el.props.value).toBe('1979-');

    fireChangeText(el, '1970-0');
    expect(el.props.value).toBe('1970-0');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireChangeText(el, '1970-08-0');
    expect(el.props.value).toBe('1970-08-0');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireChangeText(el, '1970-08-01');
    expect(el.props.value).toBe('1970-08-01');
    expect(handleChange).toHaveBeenCalledWith('1970-08-01');
  });

  test('format + pattern (ignore)', () => {
    const handleChange = jest.fn();

    render(
      <TextInput
        format="0000-00-00"
        pattern="\d\d-\d\d"
        placeholder="test"
        onValueChange={handleChange}
        value="19-70-12"
      />,
    );

    const el = screen.getByPlaceholderText('test');
    expect(el.props.value).toBe('1970-12-');

    fireChangeText(el, '1970-12-3');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireChangeText(el, '1970-12-31');
    expect(handleChange).toHaveBeenCalledWith('1970-12-31');
  });
});
