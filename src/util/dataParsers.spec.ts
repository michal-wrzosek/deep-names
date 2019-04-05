import { arrayOfStringsToString, toLowercase, convertAccents, whitelistString, removeWrongSpaces, removeTooShortStrings, stringToArrayOfWords } from './dataParsers';

describe('arrayOfStringsToString()', () => {
  it('should convert array of strings to single string', () => {
    const input = [
      'abc',
      'def',
    ];

    expect(arrayOfStringsToString(input)).toEqual('abc def');
  });
});

describe('toLowercase()', () => {
  it('should convert all characters to lowercase version', () => {
    const input = 'AbcDef & Łódź';

    expect(toLowercase(input)).toEqual('abcdef & łódź');
  });
});

describe('convertAccents()', () => {
  it('should convert all accents into base a-zA-Z letters', () => {
    const input = 'ąśćźółć';
    expect(convertAccents(input)).toEqual('asczolc');
  });
});

describe('whitelistString()', () => {
  it('remove all characters that are not in a whitelist and change them to space', () => {
    const input = 'To - jest // taki test !@$ś∂√%%.';

    expect(whitelistString(input)).toEqual('To   jest    taki test          ');
  });
});

describe('removeWrongSpaces()', () => {
  it('should remove multiple spaces and trim a string', () => {
    const input = '   This is a    test!    ';

    expect(removeWrongSpaces(input)).toEqual('This is a test!');
  });
});

describe('stringToArrayOfWords', () => {
  it('should split a string into an array of words', () => {
    const input = 'This is some kind of test';

    expect(stringToArrayOfWords(input)).toEqual(['This', 'is', 'some', 'kind', 'of', 'test']);
  });
});

describe('removeTooShortStrings()', () => {
  it('removed too short words from an array of words', () => {
    const input = ['this', 'is', 'a', 'real', 'test'];

    expect(removeTooShortStrings(input)).toEqual(['this', 'real', 'test']);
  });
});