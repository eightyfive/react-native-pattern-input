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
      if (onValueChange) {
        if (template) {
          if (!text) {
            setValue('');
            onValueChange(null);
          } else {
            const newValue =
              text.length < value.length
                ? handleBwd(text, value, template)
                : handleFwd(text, value, template);

            if (newValue !== value) {
              onValueChange(re?.test(newValue) ? newValue : null);

              setValue(newValue);
            }
          }
        } else if (re) {
          onValueChange(re.test(text) ? text : null);
        } else {
          onValueChange(text);
        }
      }

      if (onChangeText) {
        onChangeText(text);
      }
    },
    [onChangeText, onValueChange, re, template, value],
  );

  // Render
  return (
    <RNTextInput
      {...rest}
      onChangeText={handleChangeText}
      value={re ? value : valueProp}
    />
  );
}
