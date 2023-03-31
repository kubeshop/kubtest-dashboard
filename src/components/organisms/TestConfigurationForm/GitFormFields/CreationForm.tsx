import {StyledFormSpace} from '../TestConfigurationForm.styled';
import Branch from '../molecules/Branch';
import Path from '../molecules/Path';
import Repository from '../molecules/Repository';
import SecretFormItem from '../molecules/SecretFormItem';

type GitFormFieldsProps = {
  testType: string;
};

const GitFormFields: React.FC<GitFormFieldsProps> = props => {
  const {testType} = props;

  return (
    <StyledFormSpace size={24} direction="vertical">
      <Repository />
      <SecretFormItem name="token" label="Git Token" />
      <SecretFormItem name="username" label="Git Username" />
      <Branch />
      <Path testType={testType} />
    </StyledFormSpace>
  );
};

export default GitFormFields;
