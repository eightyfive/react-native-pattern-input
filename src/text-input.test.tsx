import 'react-native';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from './text-input';
import { ReactTestInstance } from 'react-test-renderer';

describe('TextInput', () => {
  test('onChangeText', () => {
    const handleChangeText = jest.fn();

    render(<TextInput placeholder="test" onChangeText={handleChangeText} />);

    const textInput = screen.getByPlaceholderText('test');

    fireEvent.changeText(textInput, 'some text');

    expect(handleChangeText).toBeCalledWith('some text');
  });

  test('pattern', () => {
    const handleChange = jest.fn();

    render(
      <TextInput
        pattern="\d\d\d"
        placeholder="test"
        onChange={handleChange}
        value="1"
      />,
    );

    const el = screen.getByPlaceholderText('test');

    fireKeyPress(el, '2');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireKeyPress(el, '3');
    expect(handleChange).toHaveBeenCalledWith('123');
  });

  test('format', () => {
    const handleChange = jest.fn();

    render(
      <TextInput
        format="9999-99-99"
        placeholder="test"
        onChange={handleChange}
        value="1970"
      />,
    );

    const el = screen.getByPlaceholderText('test');
    expect(el.props.value).toBe('1970-');

    // 197
    fireKeyPress(el, 'Backspace');
    expect(el.props.value).toBe('197');
    expect(handleChange).toHaveBeenCalledWith(null);

    // 1979
    fireKeyPress(el, '9');
    expect(el.props.value).toBe('1979-');
    expect(handleChange).toHaveBeenCalledWith(null);

    // 19790
    fireKeyPress(el, '0');
    expect(el.props.value).toBe('1979-0');
    expect(handleChange).toHaveBeenCalledWith(null);

    // 197901
    fireKeyPress(el, '1');
    expect(el.props.value).toBe('1979-01-');
    expect(handleChange).toHaveBeenCalledWith(null);

    // 19790
    fireKeyPress(el, 'Backspace');
    expect(el.props.value).toBe('1979-0');
    expect(handleChange).toHaveBeenCalledWith(null);

    // 197908
    fireKeyPress(el, '8');
    expect(el.props.value).toBe('1979-08-');
    expect(handleChange).toHaveBeenCalledWith(null);

    // 1979080
    fireKeyPress(el, '0');
    expect(el.props.value).toBe('1979-08-0');
    expect(handleChange).toHaveBeenCalledWith(null);

    // 19790801
    fireKeyPress(el, '1');
    expect(el.props.value).toBe('1979-08-01');
    expect(handleChange).toHaveBeenCalledWith('1979-08-01');
  });

  test('format + pattern (ignore)', () => {
    const handleChange = jest.fn();

    render(
      <TextInput
        format="9999-99-99"
        pattern="\d\d-\d\d"
        placeholder="test"
        onChange={handleChange}
        value="19-70-12"
      />,
    );

    const el = screen.getByPlaceholderText('test');
    expect(el.props.value).toBe('1970-12-');

    fireKeyPress(el, '3');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireKeyPress(el, '1');
    expect(handleChange).toHaveBeenCalledWith('1970-12-31');
  });
});

function fireKeyPress(el: ReactTestInstance, key: string) {
  fireEvent(el, 'onKeyPress', { nativeEvent: { key } });
}
