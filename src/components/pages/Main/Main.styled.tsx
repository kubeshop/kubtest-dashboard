import styled from 'styled-components';
import {Layout} from 'antd';

export const StyledMainContent = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  background: var(--color-dark-tertiary);
  margin: 0 24px 0 0;
`;

export const StyledTestHeader = styled.div``;

export const StyledTestSummary = styled.div`
  position: relative;
  top: 24px;

  // TESTING DIFFERENT SCREENS

  /* @media only screen and (min-width: 425px) {
    height: 50vh;
  }
  @media only screen and (min-width: 768px) {
    height: 55vh;
  }
  @media only screen and (min-width: 1024px) {
    height: 64vh;
  }
  @media only screen and (min-width: 1440px) {
    height: 72vh;
  }
  @media only screen and (min-width: 2500px) {
    height: 83vh;
  } */
`;
