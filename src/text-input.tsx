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
  ...rest
}: TextInputProps) {
  // Hooks
  const initialValue = rest.value || '';

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
        let newValue = template
          ? formatInput(newInternalValue, template)
          : newInternalValue;

        if (onValueChange) {
          if (re) {
            const isOldValid = re.test(value);
            const isNewValid = re.test(newValue);

            const hasChanged = isNewValid !== isOldValid;

            if (isNewValid || hasChanged) {
              onValueChange(newValue || null);
            }
          } else {
            onValueChange(newValue || null);
          }
        }

        setValue(newValue);
        setInternalValue(newInternalValue);
      }

      if (onKeyPress) {
        onKeyPress(ev);
      }
    },
    [internalValue, template, onKeyPress, re, value, onValueChange],
  );

  // Render
  return (
    <RNTextInput
      {...rest}
      onChangeText={handleChangeText}
      onKeyPress={handleKeyPress}
      value={value}
    />
  );
}
