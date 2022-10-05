const RE_ALPHA = /[A-Za-z]/;
const RE_ALPHANUM = /[A-Za-z0-9]/;
const RE_NUM = /[0-9]/;
const RE_RESERVED = /[0-9aA]/;
const RE_ESCAPE = /([\W_])/g;

export function unformat(text: string) {
  return text.replace(RE_ESCAPE, '');
}

export function format(text: string, template: string) {
  const input = unformat(text);

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

    const isValid =
      (RE_NUM.test(templateChar) &&
        RE_NUM.test(inputChar) &&
        Number(inputChar) <= Number(templateChar)) ||
      (templateChar === 'a' && RE_ALPHA.test(inputChar)) ||
      (templateChar === 'A' && RE_ALPHANUM.test(inputChar));

    if (!isValid) {
      break;
    }

    value += inputChar;
    index++;
  }

  return value;
}

export function patternize(template: string) {
  const tmpl = template.replace(RE_ESCAPE, '\\$1');

  let pattern = '';

  for (const char of tmpl) {
    if (!RE_RESERVED.test(char)) {
      pattern += char;
    } else if (RE_NUM.test(char)) {
      pattern += '\\d';
    } else if (char === 'a') {
      pattern += '[A-Za-z]';
    } else if (char === 'A') {
      pattern += '[A-Za-z\\d]';
    }
  }

  return pattern;
}
