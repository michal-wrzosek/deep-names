import * as R from 'ramda';

import { ValueOf } from './types';

export type PassibilityMatrix = { [key: string]: number }

export type DistributionFactor = {
  min: number,
  max: number,
}

export type PMDistributionFactor = {
  distributionFactor: DistributionFactor,
  pmKey: string
}

export type PMMergeConfig = {
  pm: PassibilityMatrix,
  weight: number,
}

export function getPMSum(pm: PassibilityMatrix): number {
  return Object.keys(pm).reduce((acc, elem) => acc + pm[elem], 0);
}

export function getPMDistributionFactors(pm: PassibilityMatrix): PMDistributionFactor[] {
  const sum = getPMSum(pm);

  return Object.keys(pm).reduce((acc: PMDistributionFactor[], elem: string) => {
    const factorValue = pm[elem] / sum;
    const previousPMDF = R.last(acc);
    const min = previousPMDF ? previousPMDF.distributionFactor.max : 0;
    const max = previousPMDF ? previousPMDF.distributionFactor.max + factorValue : factorValue;
    const pmDistributionFactor = {
      distributionFactor: { min, max },
      pmKey: elem,
    };
    return [...acc, pmDistributionFactor];
  }, []);
}

export function selectFromPM(pm: PassibilityMatrix) {
  const pmDistributionFactors = getPMDistributionFactors(pm);

  return (selector: number): string | undefined => {

    const pmDF = R.find((pmDF: PMDistributionFactor) => selector >= pmDF.distributionFactor.min &&
      selector <= pmDF.distributionFactor.max
    )(pmDistributionFactors);

    return pmDF ? pmDF.pmKey : undefined;
  };
}

export function getFirstLetterPM(input: string): PassibilityMatrix {
  const letters = (input.match(/ [a-z]/g) || []).map((match) => match[1]);
  return letters.reduce((acc: PassibilityMatrix, elem) => {
    acc[elem] = acc[elem] ? acc[elem] + 1 : 1;
    return acc;
  }, {});
}

export function getLetterAfterAStringPM(input: string, string: string): PassibilityMatrix {
  const regex = new RegExp(`${string}[a-z]`, 'g');
  const letters = (input.match(regex) || []).map((match) => match[string.length]);
  return letters.reduce((acc: PassibilityMatrix, elem) => {
    acc[elem] = acc[elem] ? acc[elem] + 1 : 1;
    return acc;
  }, {});
}

export function getSignAfterAStringPM(input: string, string: string): PassibilityMatrix {
  const regex = new RegExp(`${string}[a-z ]`, 'g');
  const letters = (input.match(regex) || []).map((match) => match[string.length]);
  return letters.reduce((acc: PassibilityMatrix, elem) => {
    acc[elem] = acc[elem] ? acc[elem] + 1 : 1;
    return acc;
  }, {});
}

export function getNthSignPM(input: string, n: number): PassibilityMatrix {
  if (n < 2) return {};

  const regex = new RegExp(` [a-z]{${n - 1}}[a-z ]`, 'g');
  const letters = (input.match(regex) || []).map((match) => match[n]);
  const pm = letters.reduce((acc: PassibilityMatrix, elem) => {
    acc[elem] = acc[elem] ? acc[elem] + 1 : 1;
    return acc;
  }, {});

  // if there is no sign for this possition return just white space
  return Object.keys(pm).length === 0 ? { ' ': 1 } : pm;
}

export function getCommonLetterPM(input: string): PassibilityMatrix {
  return input.split('').filter(letter => letter !== ' ').reduce((acc: PassibilityMatrix, elem) => {
    acc[elem] = acc[elem] ? acc[elem] + 1 : 1;
    return acc;
  }, {});
}

export function normalizePM(pm: PassibilityMatrix, normalizedSum = 1): PassibilityMatrix {
  const sum = getPMSum(pm);

  return sum === normalizedSum ? pm : Object.keys(pm).reduce((acc: PassibilityMatrix, elem) => {
    acc[elem] = pm[elem] * normalizedSum / sum;
    return acc;
  }, {});
};

export function mergePMs(pmMergeConfigs: PMMergeConfig[]): PassibilityMatrix {
  return pmMergeConfigs.reduce((acc: PassibilityMatrix, elem) =>
    R.mergeWith(
      (l: ValueOf<PassibilityMatrix>, r: ValueOf<PassibilityMatrix>) => l + r,
      acc,
      normalizePM(elem.pm, elem.weight)
    ), {});
}
