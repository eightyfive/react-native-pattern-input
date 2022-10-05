import React from 'react';
import { TextInput, TextInputProps } from './text-input';

export type EmailInputProps = TextInputProps;

export function EmailInput(props: EmailInputProps) {
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
