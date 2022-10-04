import React, { useCallback } from 'react';

import { TextInput, TextInputProps } from './text-input';

type Format = 'DMY' | 'MDY' | 'YMD';

type Props = Omit<TextInputProps, 'format' | 'onChange' | 'value'> & {
  format?: Format;
  onChange?: (date: Date | null) => void;
  value: Date | null;
};

export function DateInput({ format = 'YMD', onChange, value, ...rest }: Props) {
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

  // Render
  return (
    <TextInput
      keyboardType="number-pad"
      placeholder={placeholders[format]}
      format={formats[format]}
      maxLength={10}
      {...rest}
      onChange={handleChange}
      value={value === null ? '' : toInput(value)}
    />
  );
}

const formats: Record<Format, string> = {
  DMY: '00/00/0000',
  MDY: '00/00/0000',
  YMD: '0000/00/00',
};

const placeholders: Record<Format, string> = {
  DMY: 'DD/MM/YYYY',
  MDY: 'MM/DD/YYYY',
  YMD: 'YYYY/MM/DD',
};

function toInput(date: Date) {
  return `${padNumber(date.getDate())}${padNumber(
    date.getMonth(),
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
  if (format === 'YMD') {
    return text.replace(/\//g, '-');
  }

  const [rest = '', yy = ''] = text.match(reSplit4) || [];

  const parts = rest.match(reSplit2) || [];

  if (format === 'DMY') {
    return `${parts[1]}-${parts[2]}-${yy}`;
  }

  if (format === 'MDY') {
    return `${parts[2]}-${parts[1]}-${yy}`;
  }

  return '0000-00-00';
}
