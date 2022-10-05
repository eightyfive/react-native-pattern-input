import React from 'react';
import { TextInput, TextInputProps } from './text-input';

export type UsernameInputProps = TextInputProps;

export function UsernameInput(props: UsernameInputProps) {
  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      pattern="[\w-]+"
      placeholder="Username"
      {...props}
    />
  );
}
