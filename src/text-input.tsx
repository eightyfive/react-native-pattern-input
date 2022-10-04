import React, { useCallback, useMemo } from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputChangeEventData,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import {
  format as formatValue,
  patternize,
  unformat as unformatValue,
} from 'format-pattern';

export type TextInputProps = Omit<RNTextInputProps, 'onChange' | 'value'> & {
  format?: string;
  onChange?: (text: string | null) => void;
  pattern?: string;
  unformat?: boolean;
  value?: string | null;
};

export function TextInput({
  format: template,
  onChange,
  pattern,
  unformat = false,
  value,
  ...rest
}: TextInputProps) {
  // Hooks
  const re = useMemo(
    () =>
      pattern
        ? new RegExp(`/^${pattern}$/`)
        : template
        ? patternize(template)
        : null,
    [pattern, template],
  );

  const handleChange = useCallback(
    (ev: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const { text } = ev.nativeEvent;

      if (onChange) {
        if (re) {
          onChange(
            re.test(text) ? (unformat ? unformatValue(text) : text) : null,
          );
        } else {
          onChange(text);
        }
      }
    },
    [onChange, re, unformat],
  );

  // Render
  let text;

  if (value === null) {
    text = '';
  } else if (value) {
    text = template ? formatValue(value, template) : value;
  } else {
    text = undefined;
  }

  return <RNTextInput {...rest} onChange={handleChange} value={text} />;
}
