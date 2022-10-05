import { format, patternize, unformat } from './services';

const DATE_FORMAT = '39/19/2199';
const PHONE_FORMAT = '+(99) 999-999-999';
const EXPIRY_FORMAT = '99-19'; // YY-MM for testing purpose

describe('Format', () => {
  it('formats date', () => {
    expect(format('', DATE_FORMAT)).toBe('');
    expect(format('0', DATE_FORMAT)).toBe('0');
    expect(format('01', DATE_FORMAT)).toBe('01/');
    expect(format('011', DATE_FORMAT)).toBe('01/1');
    expect(format('0112', DATE_FORMAT)).toBe('01/12/');
    expect(format('01122', DATE_FORMAT)).toBe('01/12/2');
    expect(format('011220', DATE_FORMAT)).toBe('01/12/20');
    expect(format('0112202', DATE_FORMAT)).toBe('01/12/202');
    expect(format('01122022', DATE_FORMAT)).toBe('01/12/2022');
  });

  it('formats phone', () => {
    expect(format('', PHONE_FORMAT)).toBe('');
    expect(format('6', PHONE_FORMAT)).toBe('+(6');
    expect(format('66', PHONE_FORMAT)).toBe('+(66) ');
    expect(format('669', PHONE_FORMAT)).toBe('+(66) 9');
    expect(format('6695', PHONE_FORMAT)).toBe('+(66) 95');
    expect(format('66959', PHONE_FORMAT)).toBe('+(66) 959-');
    expect(format('669595', PHONE_FORMAT)).toBe('+(66) 959-5');
    expect(format('6695954', PHONE_FORMAT)).toBe('+(66) 959-54');
    expect(format('66959543', PHONE_FORMAT)).toBe('+(66) 959-543-');
    expect(format('669595439', PHONE_FORMAT)).toBe('+(66) 959-543-9');
    expect(format('6695954390', PHONE_FORMAT)).toBe('+(66) 959-543-90');
    expect(format('66959543904', PHONE_FORMAT)).toBe('+(66) 959-543-904');
  });

  it('formats expiry date', () => {
    expect(format('', EXPIRY_FORMAT)).toBe('');
    expect(format('2', EXPIRY_FORMAT)).toBe('2');
    expect(format('22', EXPIRY_FORMAT)).toBe('22-');
    expect(format('220', EXPIRY_FORMAT)).toBe('22-0');
    expect(format('2201', EXPIRY_FORMAT)).toBe('22-01');

    // Fails (`3` (month) > `1` temlate constrain)
    expect(format('223', EXPIRY_FORMAT)).toBe('22-');
  });
});

describe('Unformat', () => {
  it('unformats date', () => {
    expect(unformat('01/12/2022')).toBe('01122022');
  });

  it('unformats phone', () => {
    expect(unformat('+(66) 959-543-904')).toBe('66959543904');
  });
});

describe('Patternize', () => {
  it('transforms date format to pattern', () => {
    const pattern = patternize(DATE_FORMAT);

    expect(pattern).toEqual('\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d');

    const re = new RegExp(`^${pattern}$`);

    expect(re.test('01/12/2022')).toBe(true);
  });

  it('transforms phone format to pattern', () => {
    const pattern = patternize(PHONE_FORMAT);

    expect(pattern).toEqual(
      '\\+\\(\\d\\d\\)\\ \\d\\d\\d\\-\\d\\d\\d\\-\\d\\d\\d',
    );

    const re = new RegExp(`^${pattern}$`);

    expect(re.test('+(66) 959-543-904')).toBe(true);
  });
});
