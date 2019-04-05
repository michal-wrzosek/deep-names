import * as R from 'ramda';
import removeAccents from 'remove-accents';

export function arrayOfStringsToString(input: string[]): string {
  return R.join(' ', input);
}

export function toLowercase(input: string): string {
  return R.toLower(input);
}

export function convertAccents(input: string): string {
  return removeAccents(input);
}

export function whitelistString(input: string): string {
  return R.replace(/[^a-zA-Z ]/g, ' ', input);
}

export function removeWrongSpaces(input: string): string {
  return R.pipe(R.replace(/ +(?= )/g, ''), R.trim)(input);
}

export function removeTooShortStrings(input: string[]): string[] {
  return R.filter((word) => word.length > 3, input);
}

export function stringToArrayOfWords(input: string): string[] {
  return R.split(' ', input);
}
