import React, { useCallback, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { formatInput, isCharValid, patternize, unformat } from './services';

const KEY_BACKSPACE = 'Backspace';

export type TextInputProps = Omit<RNTextInputProps, 'onChange' | 'value'> & {
  format?: string;
  onChange?: (text: string | null) => void;
  onChangeEvent?: (ev: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  pattern?: string;
  value?: string | null;
};

export function TextInput({
  format: template,
  onChange,
  onChangeEvent,
  onChangeText,
  onKeyPress,
  pattern,
  value,
  ...rest
}: TextInputProps) {
  // Hooks
  const initialValue = value || '';

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
      if (!text) {
        setInternalValue('');
      }

      if (onChangeText) {
        onChangeText(text);
      }
    },
    [onChangeText],
  );

  const handleKeyPress = useCallback(
    (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const { key } = ev.nativeEvent;

      let newInternalValue = internalValue;

      if (key === KEY_BACKSPACE) {
        newInternalValue = newInternalValue.slice(0, -1);
      } else if (
        !template ||
        (template && isCharValid(key, template, internalValue.length))
      ) {
        newInternalValue += key;
      }

      if (newInternalValue !== internalValue) {
        if (onChange) {
          const newValue = template
            ? formatInput(newInternalValue, template)
            : newInternalValue;

          onChange(!re || (re && re.test(newValue)) ? newValue : null);
        }

        setInternalValue(newInternalValue);
      }

      if (onKeyPress) {
        onKeyPress(ev);
      }
    },
    [internalValue, onChange, onKeyPress, re, template],
  );

  // Render
  let displayValue;

  if (internalValue) {
    displayValue = template
      ? formatInput(internalValue, template)
      : internalValue;
  } else {
    displayValue = '';
  }

  return (
    <RNTextInput
      {...rest}
      onChange={onChangeEvent}
      onChangeText={handleChangeText}
      onKeyPress={handleKeyPress}
      value={displayValue}
    />
  );
}
