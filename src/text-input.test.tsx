import 'react-native';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from './text-input';

describe('TextInput', () => {
  test('fires onChangeText normally', () => {
    const handleChangeText = jest.fn();

    render(<TextInput testID="text-input" onChangeText={handleChangeText} />);

    const textInput = screen.getByTestId('text-input');

    fireEvent.changeText(textInput, 'some text');

    expect(handleChangeText).toBeCalledWith('some text');
  });
});
