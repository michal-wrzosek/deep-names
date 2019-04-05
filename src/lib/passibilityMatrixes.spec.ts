import {
  getFirstLetterPM,
  getPMDistributionFactors,
  selectFromPM,
  PassibilityMatrix,
  normalizePM,
  getPMSum,
  PMMergeConfig,
  mergePMs,
  getLetterAfterAStringPM,
  getCommonLetterPM,
  getSignAfterAStringPM,
  getNthSignPM
} from './passibilityMatrixes';

describe('getPMSum()', () => {
  it('returns the sum of Passibility Matrix values', () => {
    const input: PassibilityMatrix = {
      a: 1,
      b: 2,
      c: 7,
    };

    expect(getPMSum(input)).toEqual(10);
  });
});

describe('getPMDistributionFactors()', () => {
  it('should return correct Passibility Matrix Distribution Factors', () => {
    const passibilityMatrix = {
      a: 1,
      b: 2,
      c: 1,
    };

    expect(getPMDistributionFactors(passibilityMatrix)).toEqual([
      {
        distributionFactor: {
          min: 0,
          max: 0.25,
        },
        pmKey: 'a',
      },
      {
        distributionFactor: {
          min: 0.25,
          max: 0.75,
        },
        pmKey: 'b',
      },
      {
        distributionFactor: {
          min: 0.75,
          max: 1,
        },
        pmKey: 'c',
      },
    ]);
  });
});

describe('selectFromPM()', () => {
  it('should select correct key of Passibility Matrix based on a given selector number', () => {
    const passibilityMatrix = {
      a: 1,
      b: 2,
      c: 1,
    };

    const pmSelector = selectFromPM(passibilityMatrix);

    expect(pmSelector(0)).toEqual('a');
    expect(pmSelector(1)).toEqual('c');
    expect(pmSelector(0.5)).toEqual('b');
    expect(pmSelector(0.1)).toEqual('a');
  })
});

describe('getFirstLetterPM()', () => {
  it('should get passibility matrix for first letters', () => {
    const input = ' abc  abc  abc  bcd  cde  cde  def ';

    expect(getFirstLetterPM(input)).toEqual({
      a: 3,
      b: 1,
      c: 2,
      d: 1,
    });
  });
});

describe('getLetterAfterAStringPM()', () => {
  it("gets a PM for a letter after a given string", () => {
    const input = ' abc  abc ';

    expect(getLetterAfterAStringPM(input, 'a')).toEqual({ b: 2 });
    expect(getLetterAfterAStringPM(input, 'ab')).toEqual({ c: 2 });
    expect(getLetterAfterAStringPM(input, 'x')).toEqual({});
  });
});

describe('getSignAfterAStringPM()', () => {
  it("gets a PM for a letter or white space after a given string", () => {
    const input = ' abc  abc ';

    expect(getSignAfterAStringPM(input, 'a')).toEqual({ b: 2 });
    expect(getSignAfterAStringPM(input, 'ab')).toEqual({ c: 2 });
    expect(getSignAfterAStringPM(input, 'c')).toEqual({ ' ': 2 });
  });
});

describe('getNthSignPM()', () => {
  it("gets a PM for a letter or white space on n-th position in a word", () => {
    const input = ' abc  bcd  efgh  efgh ';

    expect(getNthSignPM(input, 1)).toEqual({}); // it doesn't work with n < 2
    expect(getNthSignPM(input, 2)).toEqual({ b: 1, c: 1, f: 2 });
    expect(getNthSignPM(input, 4)).toEqual({ ' ': 2, h: 2 });
    expect(getNthSignPM(input, 6)).toEqual({ ' ': 1 });
  });
});

describe('getCommonLetterPM()', () => {
  it("gets a PM for all the letters in a given string", () => {
    const input = ' abc  abc ';

    expect(getCommonLetterPM(input)).toEqual({ a: 2, b: 2, c: 2 });
  });
});

describe('normalizePM', () => {
  it('changes values so that sum of them is equal to 1', () => {
    const input: PassibilityMatrix = {
      a: 2,
      b: 1,
      c: 2,
      d: 5,
    };

    expect(normalizePM(input)).toEqual({
      a: 0.2,
      b: 0.1,
      c: 0.2,
      d: 0.5,
    });
  });

  it("doesn't changes PM if the sum is 1", () => {
    const input: PassibilityMatrix = {
      a: 0.1,
      b: 0.3,
      c: 0.6,
    };

    expect(normalizePM(input)).toEqual(input);
  });

  it("changes values so that sum of them is equal to a given sum", () => {
    const input: PassibilityMatrix = {
      a: 0.1,
      b: 0.3,
      c: 0.6,
    };

    expect(normalizePM(input, 10)).toEqual({
      a: 1,
      b: 3,
      c: 6,
    });
  });
});

describe("mergePMs()", () => {
  it("Merges given Passibility Matrixes with the given weights", () => {
    const input: PMMergeConfig[] = [
      { pm: { a: 1, b: 9 }, weight: 10 },
      { pm: { b: 10 }, weight: 1 },
      { pm: { a: 10, c: 20 }, weight: 3 },
    ];

    expect(mergePMs(input)).toEqual({
      a: 2,
      b: 10,
      c: 2,
    });
  });
});
