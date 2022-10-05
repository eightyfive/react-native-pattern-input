import React, { useCallback, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { formatInput, patternize, unformat } from './services';

const KEY_BACKSPACE = 'Backspace';
const KEY_ENTER = 'Enter';

export type TextInputProps = Omit<RNTextInputProps, 'onChange' | 'value'> & {
  format?: string;
  onChange?: (text: string | null) => void;
  pattern?: string;
  value?: string | null;
};

export function TextInput({
  format: template,
  onChange,
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

  const handleKeyPress = useCallback(
    (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const { key } = ev.nativeEvent;

      let newInternalValue = internalValue;

      if (key === KEY_BACKSPACE) {
        newInternalValue = newInternalValue.slice(0, -1);
      } else if (key !== KEY_ENTER) {
        newInternalValue += key;
      }

      if (template) {
        // Force alphanum
        newInternalValue = unformat(newInternalValue);
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
    <RNTextInput {...rest} onKeyPress={handleKeyPress} value={displayValue} />
  );
}
