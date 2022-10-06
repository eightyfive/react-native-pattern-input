const RE_ALPHA = /[A-Za-z]/;
const RE_ALPHANUM = /[A-Za-z0-9]/;
const RE_NUM = /[0-9]/;
const RE_RESERVED = /[0aA]/;
const RE_ESCAPE = /([\W_])/g;

export function unformat(text: string) {
  return text.replace(RE_ESCAPE, '');
}

export function formatInput(input: string, template: string) {
  if (!input) {
    return '';
  }

  let index = 0;
  let value = '';

  for (const templateChar of template) {
    if (!RE_RESERVED.test(templateChar)) {
      value += templateChar;
      continue;
    }

    if (index === input.length) {
      break;
    }

    const inputChar = input.charAt(index);

    if (!isCharValid(inputChar, template, index)) {
      break;
    }

    value += inputChar;
    index++;
  }

  return value;
}

export function isCharValid(
  inputChar: string,
  template: string,
  index: number,
) {
  const templateChar = unformat(template).charAt(index);

  return (
    (templateChar === '0' && RE_NUM.test(inputChar)) ||
    (templateChar === 'a' && RE_ALPHA.test(inputChar)) ||
    (templateChar === 'A' && RE_ALPHANUM.test(inputChar))
  );
}

export function patternize(template: string) {
  const tmpl = template.replace(RE_ESCAPE, '\\$1');

  let pattern = '';

  for (const char of tmpl) {
    if (!RE_RESERVED.test(char)) {
      pattern += char;
    } else if (char === '0') {
      pattern += '\\d';
    } else if (char === 'a') {
      pattern += '[A-Za-z]';
    } else if (char === 'A') {
      pattern += '[A-Za-z\\d]';
    }
  }

  return pattern;
}
