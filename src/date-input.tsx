import React, { useCallback, useMemo } from 'react';

import { TextInput, TextInputProps } from './text-input';

const FORMAT_YEAR = '9999';
const FORMAT_MONTH = '19';
const FORMAT_DAY = '39';

type Format = 'DMY' | 'MDY' | 'YMD' | 'YDM';

type Props = Omit<
  TextInputProps,
  'format' | 'pattern' | 'onChange' | 'value'
> & {
  format: Format;
  onChange?: (date: Date | null) => void;
  separator?: string;
  value?: Date | null;
};

export function DateInput({
  format,
  onChange,
  separator = '/',
  value,
  ...rest
}: Props) {
  // Hooks
  const handleChange = useCallback(
    (text: string | null) => {
      if (onChange) {
        if (text === null) {
          onChange(null);
        } else {
          onChange(toDate(text, format));
        }
      }
    },
    [format, onChange],
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
      {...rest}
      onChange={handleChange}
      value={value === null ? '' : value ? toInput(value) : value}
    />
  );
}

function getTemplate(format: Format, separator: string) {
  if (format === 'DMY') {
    return [FORMAT_DAY, FORMAT_MONTH, FORMAT_YEAR].join(separator);
  }

  if (format === 'MDY') {
    return [FORMAT_MONTH, FORMAT_DAY, FORMAT_YEAR].join(separator);
  }

  if (format === 'YDM') {
    return [FORMAT_YEAR, FORMAT_DAY, FORMAT_MONTH].join(separator);
  }

  if (format === 'YMD') {
    return [FORMAT_YEAR, FORMAT_MONTH, FORMAT_DAY].join(separator);
  }

  return ['99', '99', '9999'].join(separator);
}

function toInput(date: Date) {
  return `${padNumber(date.getDate())}${padNumber(
    date.getMonth() + 1,
  )}${date.getFullYear()}`;
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
