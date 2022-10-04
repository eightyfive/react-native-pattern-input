import React from 'react';
import { TextInput, TextInputProps } from './text-input';

export function EmailInput(props: TextInputProps) {
  return (
    <TextInput
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect={false}
      keyboardType="email-address"
      pattern="[\w-\.]+@([\w-]+\.)+[\w-]{2,4}"
      placeholder="Email"
      textContentType="emailAddress"
      {...props}
    />
  );
}
