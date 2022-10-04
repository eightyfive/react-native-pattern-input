import 'react-native';
import React, { ReactComponentElement, ReactElement } from 'react';

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
      <TextInput pattern="\d\d\d" placeholder="test" onChange={handleChange} />,
    );

    const el = screen.getByPlaceholderText('test');

    fireOnChange(el, '');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireOnChange(el, '12');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireOnChange(el, '123');
    expect(handleChange).toHaveBeenCalledWith('123');
  });

  test('format', () => {
    const handleChange = jest.fn();

    render(
      <TextInput
        format="0000-00-00"
        placeholder="test"
        onChange={handleChange}
        value="1970"
      />,
    );

    const el = screen.getByPlaceholderText('test');
    expect(el.props.value).toBe('1970-');

    fireOnChange(el, '');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireOnChange(el, '1970-0');
    expect(handleChange).toHaveBeenCalledWith(null);

    fireOnChange(el, '1970-01-01');
    expect(handleChange).toHaveBeenCalledWith('1970-01-01');
  });
});

function fireOnChange(el: ReactTestInstance, text: string) {
  fireEvent(el, 'onChange', { nativeEvent: { text } });
}
