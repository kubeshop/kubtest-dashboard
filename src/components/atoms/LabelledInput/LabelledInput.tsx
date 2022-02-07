import React from 'react';

import styled from 'styled-components';

import {Typography} from '@atoms';

import Colors from '@styles/Colors';
import {device} from '@styles/globalStyles';

export interface ILabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  type?: string;
  name?: string;
  labelText?: string;
  variant?: 'primary' | 'secondary';
}

const StyledInput = styled.input<ILabelInputProps>`
  width: var(--space-xxl);
  max-width: var(--space-5xl);
  min-width: var(--space-xxxxl);
  overflow: hidden;
  appearance: none;
  border: 1px solid ${Colors.blue6};
  font-family: inherit;
  padding: 0 var(--space-sm) 0 var(--space-md);
  height: var(--space-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  color: ${({variant}) => (variant === 'primary' ? 'var(--color-light-primary)' : 'var(--color-light-primary)')};
  background: var(--color-dark-primary);

  &:focus {
    background: ${({variant}) => (variant === 'primary' ? 'var(--color-dark-primary)' : '')};
    outline: ${({variant}) => (variant === 'primary' ? 'none' : '')};
    box-shadow: inset 0 -1px 0 ${({variant}) => (variant === 'primary' ? 'var(--color-shadow-primary)' : '')};
  }
`;

const StyledLabel = styled.label`
  color: #35353b;
  display: flex;
  align-items: baseline;

  @media ${device.desktopL} {
    flex-direction: column;
  }
`;

const LabelInput = ({id, labelText, className, variant = 'primary', ...inputProps}: ILabelInputProps) => {
  return (
    <>
      {labelText ? (
        <StyledLabel htmlFor={id}>
          <Typography variant="secondary">{labelText}</Typography>
        </StyledLabel>
      ) : (
        <StyledInput {...inputProps} name={id} id={id} />
      )}
    </>
  );
};

export default LabelInput;
