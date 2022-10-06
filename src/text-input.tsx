import React, { useCallback, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { formatInput, isCharValid, patternize, unformat } from './services';

const KEY_BACKSPACE = 'Backspace';

export type TextInputProps = Omit<RNTextInputProps, 'value'> & {
  format?: string;
  onValueChange?: (text: string | null) => void;
  pattern?: string;
  value?: string | null;
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
      if (!re) {
        setValue(text);
      } else if (!text) {
        setValue('');
        setInternalValue('');
      }

      if (onChangeText) {
        onChangeText(text);
      }
    },
    [onChangeText, re],
  );

  const handleKeyPress = useCallback(
    (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (re) {
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
          const newValue = template
            ? formatInput(newInternalValue, template)
            : newInternalValue;

          if (onValueChange) {
            if (re) {
              const isOldValid = re.test(value);
              const isNewValid = re.test(newValue);

              const hasChanged = isNewValid !== isOldValid;

              if (isNewValid) {
                onValueChange(newValue);
              } else if (hasChanged) {
                onValueChange(null);
              }
            } else {
              onValueChange(newValue || null);
            }
          }

          setValue(newValue);
          setInternalValue(newInternalValue);
        }
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
