import {Space} from 'antd';

import styled from 'styled-components';

import {Button} from '@custom-antd';

import Colors from '@styles/Colors';
import Fonts from '@styles/Fonts';

export const StyledEmptyTestsDataContainer = styled(Space)`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledTitle = styled.div<{isSVGVisible: boolean}>`
  ${props =>
    props.isSVGVisible
      ? `
  margin-top: 62px;`
      : ''}
  margin-bottom: 16px;

  font-size: 24px;
  font-weight: 400;
  font-family: ${Fonts.nunito};
  line-height: 32px;
  color: ${Colors.whitePure};
  text-align: center;
`;

export const StyledDescription = styled.div`
  max-width: 290px;

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
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
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
    background-color: ${Colors.purpleSecondary};
    color: ${Colors.whitePure};
  }
`;
