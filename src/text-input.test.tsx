import 'react-native';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from './text-input';

describe('TextInput', () => {
  test('onChangeText', () => {
    const handleChangeText = jest.fn();

    render(<TextInput placeholder="test" onChangeText={handleChangeText} />);

    const textInput = screen.getByPlaceholderText('test');

    fireEvent.changeText(textInput, 'some text');

    expect(handleChangeText).toBeCalledWith('some text');
  });

  test('onChange', () => {
    const handleChange = jest.fn();

    render(
      <TextInput pattern="\d\d\d" placeholder="test" onChange={handleChange} />,
    );

    const textInput = screen.getByPlaceholderText('test');

    fireEvent(textInput, 'onChange', {
      nativeEvent: { text: '12' },
    });

    expect(handleChange).toHaveBeenCalledWith(null);

    fireEvent(textInput, 'onChange', {
      nativeEvent: { text: '123' },
    });

    expect(handleChange).toHaveBeenCalledWith('123');
  });
});
