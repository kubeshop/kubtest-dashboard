import {useMemo, useState} from 'react';

import {Button, Skeleton, Text} from '@custom-antd';

import {Artifact} from '@models/artifact';

import {downloadArtifactArchive} from '@services/artifacts';

import Colors from '@styles/Colors';

import {DefaultRequestError, displayDefaultErrorNotification} from '@utils/notification';

import * as S from './ArtifactsList.styled';
import ArtifactsListItem from './ArtifactsListItem';
import {StyledDownloadAllContainer} from './ArtifactsListItem.styled';

export type ArtifactsListBaseProps = {
  artifacts: Artifact[];
  testExecutionId: string;
  isLoading?: boolean;
  testName?: string;
  testSuiteName?: string;
  startTime?: string;
};

const ArtifactsList: React.FC<ArtifactsListBaseProps> = props => {
  const {artifacts, testExecutionId, testName, testSuiteName, isLoading, startTime} = props;

  const [isDownloading, setIsDownloading] = useState(false);

  const renderedArtifactsList = useMemo(() => {
    if (isLoading) {
      return (
        <>
          <Skeleton additionalStyles={{lineHeight: 40, color: Colors.slate900, contrastColor: Colors.slate700}} />
          <Skeleton additionalStyles={{lineHeight: 40, color: Colors.slate900, contrastColor: Colors.slate700}} />
          <Skeleton additionalStyles={{lineHeight: 40, color: Colors.slate900, contrastColor: Colors.slate700}} />
        </>
      );
    }
    if (!artifacts || !artifacts.length) {
      return (
        <Text className="semibold middle" color={Colors.whitePure}>
          This test generated no artifacts.
        </Text>
      );
    }

    return artifacts.map((artifact, index) => {
      const {name} = artifact;

      const listItemKey = `${name} - ${index}`;

      return (
        <ArtifactsListItem
          artifact={artifact}
          key={listItemKey}
          executionId={testExecutionId}
          testName={testName}
          testSuiteName={testSuiteName}
        />
      );
    });
  }, [isLoading, artifacts, testExecutionId, testName, testSuiteName]);

  const handleDownloadAll = async () => {
    try {
      setIsDownloading(true);
      await downloadArtifactArchive(`${testName}-${startTime}-${testExecutionId}.tar.gz`, testExecutionId);
    } catch (err) {
      displayDefaultErrorNotification(err as DefaultRequestError);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <S.ArtifactsListContainer>
      {artifacts.length > 1 ? (
        <StyledDownloadAllContainer>
          <Button onClick={handleDownloadAll}>{!isDownloading ? 'Download all' : 'Downloading...'}</Button>
        </StyledDownloadAllContainer>
      ) : null}

      {renderedArtifactsList}
    </S.ArtifactsListContainer>
  );
};

export default ArtifactsList;
