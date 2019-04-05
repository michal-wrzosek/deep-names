import React, { Component } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { SignInGeneratedWord } from './components/SignInGeneratedWord/SignInGeneratedWord';
import './App.css';

import companyNames from './data/companyNames';
import {
  arrayOfStringsToString,
  toLowercase,
  convertAccents,
  whitelistString,
  removeWrongSpaces,
  stringToArrayOfWords,
  removeTooShortStrings
} from './util/dataParsers';
import {
  selectFromPM,
  getLetterAfterAStringPM,
  mergePMs,
  getCommonLetterPM,
  getSignAfterAStringPM,
  getNthSignPM,
  PassibilityMatrix,
  PMMergeConfig,
  getPMSum,
  normalizePM,
} from './lib/passibilityMatrixes';

const MainWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 20px;
  border: 1px solid #333333;
`;

const InputAndButtonWrapper = styled.div`
  display: flex;
  align-items: stretch;
  margin: 20px;
  height: 60px;
`;

const WordBegginingInput = styled.input`
  width: 100%;
  border: 1px solid #333333;
  padding: 0 20px;
`;

const GenerateButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #333333;
  border-left: none;
  cursor: pointer;
`;

const GeneratedWord = styled.div`
  width: 100%;
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  padding: 0 20px 20px 20px;
`;

const SaveButton = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  border: 1px solid #333333;
  padding: 10px;
  cursor: pointer;
`;

const SavedWordsList = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 20px;
  border: 1px solid #333333;
`;

const SavedWord = styled.div`
  font-size: 14px;
  margin: 10px;
`;

const PMStats = ({
    pm,
    generatedWord,
    letterIndex,
  }: {
    pm: PassibilityMatrix,
    generatedWord: string,
    letterIndex: number,
  }) => {
  const normalizedPM = normalizePM(pm);
  const sortedKeys = R.sort(
    (l: keyof PassibilityMatrix, r: keyof PassibilityMatrix) => normalizedPM[r] - normalizedPM[l],
    Object.keys(normalizedPM)
  );
  
  return (
    <div>
      <SignInGeneratedWord generatedWord={generatedWord} letterIndex={letterIndex} />
      {sortedKeys.map(key => (
        <div key={key}>
          <div>
            {key === ' ' ? 'WHITE SPACE' : key}
          </div>
          <ProgressBar progress={normalizedPM[key] * 100} />
        </div>
      ))}
    </div>
  );
}

interface AppProps {}

interface AppState {
  wordBegining: string;
  generatedWord: string;
  combinedPMs: PassibilityMatrix[];
  savedGeneratedWord: string[];
}

class App extends Component<AppProps, AppState> {

  state = {
    wordBegining: '',
    generatedWord: '',
    combinedPMs: [{}],
    savedGeneratedWord: [],
  }

  constructor(props: AppProps) {
    super(props);

    const [generatedWord, combinedPMs] = this.getNewGeneratedWord();

    this.state = {
      wordBegining: '',
      generatedWord,
      combinedPMs,
      savedGeneratedWord: [],
    }
  }

  getDataSource = () => {
    return R.pipe(
      arrayOfStringsToString,
      toLowercase,
      convertAccents,
      whitelistString,
      removeWrongSpaces,
      stringToArrayOfWords,
      removeTooShortStrings,
      R.map(word => ` ${word} `),
      R.join(''),
    )(companyNames);
  };

  getNewGeneratedWord = (): [string, PassibilityMatrix[]] => {
    const { wordBegining } = this.state;

    // start with white space - it's easier to look for related letters (fisrt letter lookup)
    let generatedWord = ` ${wordBegining.trim()}`;
    const MAX_WORD_LENGTH = 15;
    const dataSource = this.getDataSource();
    const commonLettersPM = getCommonLetterPM(dataSource);
    const combinedPMs: PassibilityMatrix[] = [];
    for (let index = 0; index < MAX_WORD_LENGTH; index++) {

      // case when we prepopulated manualy beggining of the word
      if (generatedWord.length > index + 1) {
        combinedPMs.push({});

      } else {
        let pmMergeConfigs: PMMergeConfig[] = [];

        // base PM for all letters
        pmMergeConfigs = [...pmMergeConfigs, { pm: commonLettersPM, weight: 0.8 }];

        // If the string is shorter than 4 we do not look for white space,
        // later on white space can be picked up and this will mean we have a ready word
        const pmGetterFunxtion = generatedWord.length < 4 ?
        getLetterAfterAStringPM :
        getSignAfterAStringPM;

        // PM for a letter after a letter (or white space - first letter in a word)
        const letterAfterALetterPM = pmGetterFunxtion(dataSource, generatedWord.slice(-1));
        pmMergeConfigs = [...pmMergeConfigs, { pm: letterAfterALetterPM, weight: 1 }];

        // PM for a letter after other 2 letters
        if (generatedWord.length > 2) {
          const letterAfter2LettersPM = pmGetterFunxtion(dataSource, generatedWord.slice(-2));
          pmMergeConfigs = [...pmMergeConfigs, { pm: letterAfter2LettersPM, weight: 1 }];
        }

        // PM for a letter after other 3 letters
        if (generatedWord.length > 3) {
          const letterAfter3LettersPM = pmGetterFunxtion(dataSource, generatedWord.slice(-3));
          pmMergeConfigs = [...pmMergeConfigs, { pm: letterAfter3LettersPM, weight: 1 }];
        }

        // PM for a letter after other 4 letters
        if (generatedWord.length > 4) {
          const letterAfter4LettersPM = pmGetterFunxtion(dataSource, generatedWord.slice(-4));
          pmMergeConfigs = [...pmMergeConfigs, { pm: letterAfter4LettersPM, weight: 1 }];
        }

        // PM for a letter after other 5 letters
        if (generatedWord.length > 5) {
          const letterAfter5LettersPM = pmGetterFunxtion(dataSource, generatedWord.slice(-5));
          pmMergeConfigs = [...pmMergeConfigs, { pm: letterAfter5LettersPM, weight: 0.6 }];
        }

        // PM for a letter after other 6 letters
        if (generatedWord.length > 6) {
          const letterAfter6LettersPM = pmGetterFunxtion(dataSource, generatedWord.slice(-6));
          pmMergeConfigs = [...pmMergeConfigs, { pm: letterAfter6LettersPM, weight: 0.5 }];
        }

        // PM for a letter after other 7 letters
        if (generatedWord.length > 7) {
          const letterAfter7LettersPM = pmGetterFunxtion(dataSource, generatedWord.slice(-7));
          pmMergeConfigs = [...pmMergeConfigs, { pm: letterAfter7LettersPM, weight: 0.4 }];
        }

        // common sign on a given position in a word
        if (generatedWord.length > 4) {
          const signOnNthPositionPM = getNthSignPM(dataSource, generatedWord.length + 1);
          pmMergeConfigs = [...pmMergeConfigs, { pm: signOnNthPositionPM, weight: 1 }];
        }

        const combinedPM = mergePMs(pmMergeConfigs);
        generatedWord = `${generatedWord}${selectFromPM(combinedPM)(Math.random())}`;

        combinedPMs.push(combinedPM);
        console.log(`combinedPM nr ${index + 1}:`, combinedPM);
        
        // if the last chosen letter was a white space it means we have a ready word
        if (generatedWord.slice(-1) === ' ') break;
      }
    }

    // remove white space at front
    generatedWord = generatedWord.trim();

    return [generatedWord.trim(), combinedPMs];
  }

  handleWordBegginingInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ wordBegining: event.target.value });
  }

  handleShuffleButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const [generatedWord, combinedPMs] = this.getNewGeneratedWord();

    this.setState({
      generatedWord,
      combinedPMs,
    });
  }

  handleSaveButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState((state) => ({ savedGeneratedWord: [state.generatedWord, ...state.savedGeneratedWord] }));
  }

  render() {
    const {
      generatedWord,
      savedGeneratedWord,
      combinedPMs,
    } = this.state;

    return (
      <div className="App">
        <MainWrapper>
          <InputAndButtonWrapper>
            <WordBegginingInput
              type="text"
              name="word_beggining"
              value={this.state.wordBegining}
              onChange={this.handleWordBegginingInputChange}
            />
            <GenerateButton onClick={this.handleShuffleButtonClick}>generate!</GenerateButton>
          </InputAndButtonWrapper>
          <GeneratedWord>{generatedWord}</GeneratedWord>
          <SaveButton onClick={this.handleSaveButtonClick}>+ Save</SaveButton>
        </MainWrapper>
        {savedGeneratedWord.length > 0 && <SavedWordsList>
          {savedGeneratedWord.map((word, index) => (
            <SavedWord key={`${index}_${word}`}>
              {word}
            </SavedWord>
          ))}
        </SavedWordsList>}
        <div>
          {combinedPMs.map((pm, index) => (
            <PMStats
              key={index}
              pm={pm}
              generatedWord={generatedWord}
              letterIndex={index}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
