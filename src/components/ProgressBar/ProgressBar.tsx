import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Bar = styled.div<{ progress: number }>`
  width: ${p => p.progress}%;
  height: 10px;
  background-color: black;
`;

export const ProgressBar = ({ progress }: { progress: number }) => (
  <Wrapper>
    <Bar progress={progress} />
  </Wrapper>
);