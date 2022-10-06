import React, { useCallback, useMemo, useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { formatInput, handleBwd, handleFwd, patternize } from './services';

export type TextInputProps = RNTextInputProps & {
  format?: string;
  onValueChange?: (text: string | null) => void;
  pattern?: string;
};

export function TextInput({
  format: template,
  onValueChange,
  onChangeText,
  pattern,
  value: valueProp,
  ...rest
}: TextInputProps) {
  // Hooks
  const initialValue = valueProp || '';

  const [value, setValue] = useState(
    template ? formatInput(initialValue, template) : initialValue,
  );

  const re = useMemo(
    () =>
      template || pattern
        ? new RegExp(`^${template ? patternize(template) : pattern}$`)
        : null,
    [pattern, template],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      let newValue;

      if (text && template) {
        newValue =
          text.length < value.length
            ? handleBwd(text, value, template)
            : handleFwd(text, value, template);
      } else {
        newValue = text;
      }

      if (newValue !== value) {
        if (onValueChange) {
          if (re) {
            onValueChange(re.test(newValue) ? newValue : null);
          } else {
            onValueChange(newValue);
          }
        }

        setValue(newValue);
      }

      if (onChangeText) {
        onChangeText(text);
      }
    },
    [onChangeText, onValueChange, re, template, value],
  );

  // Render
  return (
    <RNTextInput {...rest} onChangeText={handleChangeText} value={value} />
  );
}
