import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Letter = styled.div<{ isActive: boolean }>`
  font-size: ${p => p.isActive ? 40 : 20}px;
`;

export const SignInGeneratedWord = ({
  generatedWord,
  letterIndex,
}: {
  generatedWord: string,
  letterIndex: number,
}) => (
  <Wrapper>
    {[...generatedWord.split(''), ' '].map((sign, index) =>
      index === letterIndex ?
        (<Letter key={index} isActive={true}>{sign === ' ' ? 'WHITE_SPACE' : sign}</Letter>) :
        (<Letter key={index} isActive={false}>{sign}</Letter>)
    )}
  </Wrapper>
);