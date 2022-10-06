const RE_ALPHA = /[a-z]/i;
const RE_ALPHANUM = /[a-z0-9]/i;
const RE_ALPHANUM_NOT = /([^a-z0-9])/gi;
const RE_NUM = /[0-9]/;

export function unformat(text: string) {
  return text.replace(RE_ALPHANUM_NOT, '');
}

export function formatInput(text: string, template: string) {
  const input = unformat(text);

  if (!input) {
    return '';
  }

  let index = 0;
  let value = '';

  for (const templateChar of template) {
    if (!isInputChar(templateChar)) {
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
  return RE_ALPHANUM.test(char);
}

export function patternize(template: string) {
  const tmpl = template.replace(RE_ALPHANUM_NOT, '\\$1');

  let pattern = '';

  for (const char of tmpl) {
    if (!isInputChar(char)) {
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

  const isBackspace = oldText.length - newText.length === 1;
  const oldChar = oldText.charAt(oldText.length - 1);

  if (isBackspace && !isInputChar(oldChar)) {
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
