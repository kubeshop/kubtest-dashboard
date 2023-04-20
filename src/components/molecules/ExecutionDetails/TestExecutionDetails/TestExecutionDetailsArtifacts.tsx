import {useContext, useEffect, useState} from 'react';

import {Artifact} from '@models/artifact';

import {ArtifactsList} from '@molecules';

import {useGetTestExecutionArtifactsQuery} from '@services/tests';

import {MainContext} from '@contexts';

type TestExecutionDetailsArtifactsProps = {
  id: string;
};

const TestExecutionDetailsArtifacts: React.FC<TestExecutionDetailsArtifactsProps> = props => {
  const {id} = props;

  const {isClusterAvailable} = useContext(MainContext);

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  const {data, isLoading, error} = useGetTestExecutionArtifactsQuery(id, {skip: !isClusterAvailable});

  useEffect(() => {
    if (error) {
      setArtifacts([]);
    } else if (data && data.length) {
      setArtifacts(data);
    }
  }, [data, error]);

  return <ArtifactsList artifacts={artifacts} testExecutionId={id} isLoading={isLoading} />;
};

export default TestExecutionDetailsArtifacts;
