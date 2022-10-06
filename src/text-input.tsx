import React, { useCallback, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { formatInput, isCharValid, patternize, unformat } from './services';

const KEY_BACKSPACE = 'Backspace';

export type TextInputProps = RNTextInputProps & {
  format?: string;
  onValueChange?: (text: string | null) => void;
  pattern?: string;
};

export function TextInput({
  format: template,
  onValueChange,
  onChangeText,
  onKeyPress,
  pattern,
  value: valueProp,
  ...rest
}: TextInputProps) {
  // Hooks
  const initialValue = valueProp || '';

  const [value, setValue] = useState(
    template ? formatInput(unformat(initialValue), template) : initialValue,
  );

  const [internalValue, setInternalValue] = useState(
    template ? unformat(initialValue) : initialValue,
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
      if (template && !text) {
        setValue('');
        setInternalValue('');
      }

      if (!template && re && onValueChange) {
        onValueChange(re.test(text) ? text : null);
      }

      if (onChangeText) {
        onChangeText(text);
      }
    },
    [onChangeText, onValueChange, re, template],
  );

  const handleKeyPress = useCallback(
    (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (template) {
        const { key } = ev.nativeEvent;

        let newInternalValue = internalValue;

        if (key === KEY_BACKSPACE) {
          newInternalValue = newInternalValue.slice(0, -1);
        } else if (
          key.length === 1 &&
          isCharValid(key, template, internalValue.length)
        ) {
          newInternalValue += key;
        }

        if (newInternalValue !== internalValue) {
          const newValue = template
            ? formatInput(newInternalValue, template)
            : newInternalValue;

          if (re && onValueChange) {
            onValueChange(re.test(newValue) ? newValue : null);
          }

          setValue(newValue);
          setInternalValue(newInternalValue);
        }
      }

      if (onKeyPress) {
        onKeyPress(ev);
      }
    },
    [internalValue, template, onKeyPress, re, onValueChange],
  );

  // Render
  return (
    <RNTextInput
      {...rest}
      onChangeText={handleChangeText}
      onKeyPress={handleKeyPress}
      value={re ? value : valueProp}
    />
  );
}
