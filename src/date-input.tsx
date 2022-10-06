import React, { useCallback, useMemo } from 'react';

import { TextInput, TextInputProps } from './text-input';

type Format = 'DMY' | 'MDY' | 'YMD' | 'YDM';

export type DateInputProps = Omit<
  TextInputProps,
  'format' | 'pattern' | 'onValueChange' | 'value'
> & {
  format: Format;
  onValueChange?: (date: Date | null) => void;
  separator?: string;
  value?: Date | null;
};

export function DateInput({
  format,
  onValueChange,
  separator = '/',
  value,
  ...rest
}: DateInputProps) {
  // Hooks
  const handleChange = useCallback(
    (text: string | null) => {
      if (onValueChange) {
        onValueChange(text ? toDate(text, format) : null);
      }
    },
    [format, onValueChange],
  );

  const template = useMemo(
    () => getTemplate(format, separator),
    [format, separator],
  );

  // Render
  return (
    <TextInput
      keyboardType="number-pad"
      format={template}
      maxLength={10}
      placeholder={getPlaceholder(format, separator)}
      {...rest}
      onValueChange={handleChange}
      value={
        value === null ? '' : value ? toValue(value, format, separator) : value
      }
    />
  );
}

function getTemplate(format: Format, separator: string) {
  if (format === 'DMY') {
    return ['00', '00', '0000'].join(separator);
  }

  if (format === 'MDY') {
    return ['00', '00', '0000'].join(separator);
  }

  if (format === 'YDM') {
    return ['0000', '00', '00'].join(separator);
  }

  if (format === 'YMD') {
    return ['0000', '00', '00'].join(separator);
  }

  // Never happens
  return '';
}

function getPlaceholder(format: Format, separator: string) {
  if (format === 'DMY') {
    return ['DD', 'MM', 'YYYY'].join(separator);
  }

  if (format === 'MDY') {
    return ['MM', 'DD', 'YYYY'].join(separator);
  }

  if (format === 'YDM') {
    return ['YYYY', 'DD', 'MM'].join(separator);
  }

  if (format === 'YMD') {
    return ['YYYY', 'MM', 'DD'].join(separator);
  }

  // Never happens
  return '';
}

function toValue(date: Date, format: Format, separator: string) {
  const dd = padNumber(date.getDate());
  const mm = padNumber(date.getMonth() + 1);
  const yy = date.getFullYear();

  if (format === 'DMY') {
    return [dd, mm, yy].join(separator);
  }

  if (format === 'MDY') {
    return [mm, dd, yy].join(separator);
  }

  if (format === 'YDM') {
    return [yy, dd, mm].join(separator);
  }

  if (format === 'YMD') {
    return [yy, mm, dd].join(separator);
  }

  // Never happens
  return '';
}

function padNumber(value: number) {
  return value.toString().padStart(2, '0');
}

const reISO8601 = /^([1-2]\d\d\d)-([0-1]\d)-([0-3]\d)$/;

function toDate(text: string, format: Format) {
  const iso = toISO8601(text, format);

  const parts = iso.match(reISO8601);

  if (!parts) {
    return null;
  }

  const yy = Number(parts[1]);
  const mm = Number(parts[2]);
  const dd = Number(parts[3]);

  const isInvalid = !yy || !mm || !dd || dd > 31 || mm > 12;

  if (isInvalid) {
    return null;
  }

  return new Date(yy, mm - 1, dd);
}

const reSplit4 = /.{1,4}/g;
const reSplit2 = /.{1,2}/g;

function toISO8601(text: string, format: Format) {
  const value = text.replace(/[\W_]/g, '');

  let parts = value.match(reSplit4) || [];

  let yy;
  let rest;

  if (format === 'YMD' || format === 'YDM') {
    yy = parts[0];
    rest = parts[1];
  } else {
    rest = parts[0];
    yy = parts[1];
  }

  const md = rest.match(reSplit2) || [];

  let mm;
  let dd;

  if (format === 'YMD') {
    mm = md[0];
    dd = md[1];
  }

  if (format === 'YDM') {
    dd = md[0];
    mm = md[1];
  }

  if (format === 'DMY') {
    mm = md[0];
    dd = md[1];
  }

  if (format === 'MDY') {
    mm = md[0];
    dd = md[1];
  }

  return `${yy || '0000'}-${mm || '00'}-${dd || '00'}`;
}
