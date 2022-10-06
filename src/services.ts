const RE_ALPHA = /[a-z]/i;
const RE_ALPHANUM = /[a-z0-9]/i;
const RE_NUM = /[0-9]/;
const RE_RESERVED = /[0aA]/;
const RE_NOT_ALPHANUM = /([\W_])/g;

export function unformat(text: string) {
  return text.replace(RE_NOT_ALPHANUM, '');
}

export function formatInput(text: string, template: string) {
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

export function isInputChar(char: string) {
  return !RE_NOT_ALPHANUM.test(char);
}

export function patternize(template: string) {
  const tmpl = template.replace(RE_NOT_ALPHANUM, '\\$1');

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

export function handleBwd(newText: string, oldText: string, template: string) {
  let text;

  if (!isInputChar(oldText.charAt(oldText.length - 1))) {
    text = newText.slice(0, -1);
  } else {
    text = newText;
  }

  return formatInput(text, template);
}

export function handleFwd(newText: string, oldText: string, template: string) {
  let text;

  if (!isInputChar(newText.charAt(newText.length - 1))) {
    text = newText;
  } else {
    const alphanum = unformat(newText);
    const index = alphanum.length - 1;
    const char = alphanum.charAt(index);

    if (isCharValid(char, template, index)) {
      text = newText;
    } else {
      text = oldText;
    }
  }

  return formatInput(text, template);
}
