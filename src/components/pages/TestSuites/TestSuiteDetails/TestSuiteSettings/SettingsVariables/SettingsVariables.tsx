import {FC} from 'react';

import {Variables} from '@organisms/EntityDetails';

const SettingsVariables: FC = () => (
  <Variables description="Define environment variables which will be shared across your tests. Variables defined at a Test Suite level will override those defined at a Test level." />
);

export default SettingsVariables;