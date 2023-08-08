import React, {FC, useContext} from 'react';

import {DashboardContext} from '@contexts';

import {useLastCallback} from '@hooks/useLastCallback';
import useRunEntity from '@hooks/useRunEntity';

import {SummaryGrid} from '@molecules';

import {PageWrapper} from '@organisms';
import {EntityDetailsHeader, EntityDetailsTabs, EntityDetailsWrapper} from '@organisms/EntityDetails';

import {Error, Loading} from '@pages';
import PageMetadata from '@pages/PageMetadata';

import {useAbortAllTestExecutionsMutation, useAbortTestExecutionMutation} from '@services/tests';

import {useEntityDetailsPick} from '@store/entityDetails';

import TestExecutionDrawer from './TestExecution/TestExecutionDrawer';
import TestSettings from './TestSettings';

interface TestDetailsContentProps {
  tab?: string;
  settingsTab?: string;
}

const TestDetailsContent: FC<TestDetailsContentProps> = ({tab, settingsTab}) => {
  const {id, details, error, metrics} = useEntityDetailsPick('id', 'details', 'error', 'metrics');
  const [isRunning, run] = useRunEntity('tests', details);

  const {navigate} = useContext(DashboardContext);
  const setTab = useLastCallback((nextTab: string) => {
    navigate(`/tests/${id}/${nextTab}`);
  });
  const setSettingsTab = useLastCallback((nextTab: string) => {
    navigate(`/tests/${id}/settings/${nextTab}`);
  });

  if (error) {
    return <Error title={error?.data?.title || 'Error'} description={error?.data?.detail || ''} />;
  }
  if (!details) {
    return <Loading />;
  }

  return (
    <EntityDetailsWrapper>
      <PageWrapper>
        <PageMetadata title={details?.name} description={details?.description} />

        <EntityDetailsHeader
          isRunning={isRunning}
          onRun={run}
          onBack={() => navigate('/tests')}
          useAbortAllExecutions={useAbortAllTestExecutionsMutation}
        />
        <SummaryGrid metrics={metrics} />
        <EntityDetailsTabs
          tab={tab}
          onTabChange={setTab}
          onRun={run}
          settings={<TestSettings active={settingsTab} onChange={setSettingsTab} />}
          useAbortExecution={useAbortTestExecutionMutation}
        />
      </PageWrapper>
      <TestExecutionDrawer />
    </EntityDetailsWrapper>
  );
};

export default TestDetailsContent;
