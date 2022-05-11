import styled from 'styled-components';

import {Button, Title} from '@custom-antd';

import Colors from '@styles/Colors';
import Fonts from '@styles/Fonts';

export const StyledEmptyTestsDataContainer = styled(Title)`
  height: 651px;

  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid ${Colors.grey3};
  background-color: ${Colors.dashboardTableBackground};

  &::before {
    content: '';
    position: absolute;

    width: 180px;
    height: 180px;

    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;

    background-color: ${Colors.greyHover};
  }

  & > svg {
    margin-top: 35px;
    z-index: 2;
  }
`;

export const StyledTitle = styled.h3`
  margin-top: 62px;

  font-family: ${Fonts.nunito};
  color: ${Colors.whitePure};
`;

export const StyledDescription = styled.div`
  width: 290px;

  margin-bottom: 24px;

  font-size: 14px;
  font-weight: 400;
  font-family: ${Fonts.nunito};
  line-height: 22px;
  color: ${Colors.whitePure};
  text-align: center;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const StyledLearnMoreButton = styled(Button)`
  height: 40px;
  width: 131px;

  border: 1px solid ${Colors.whitePure};
  border-radius: 20px;

  background-color: ${Colors.grey1000};

  font-size: 14px;
  font-weight: 500;
  font-family: ${Fonts.nunito};
  line-height: 24px;
  color: ${Colors.whitePure};
`;

export const StyledAddTestButton = styled(Button)`
  height: 40px;
  width: 131px;

  border-color: transparent;
  border-radius: 20px;

  background-color: ${Colors.purple};

  font-size: 14px;
  font-weight: 500;
  font-family: ${Fonts.nunito};
  line-height: 24px;
  color: ${Colors.whitePure};

  &:hover {
    border-color: transparent;
    background-color: #4628af;
    color: ${Colors.whitePure};
  }
`;
