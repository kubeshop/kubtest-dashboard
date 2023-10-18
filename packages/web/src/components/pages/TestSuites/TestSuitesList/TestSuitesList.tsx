import {FC, useCallback} from 'react';

import {useLegacySlotFirst} from '@testkube/web/src/legacyHooks';

import {useDashboardNavigate} from '@hooks/useDashboardNavigate';
import {SystemAccess, useSystemAccess} from '@hooks/useSystemAccess';

import {useModal} from '@modal/hooks';

import {TestSuite} from '@models/testSuite';

import {notificationCall} from '@molecules';

import {EntityListContent} from '@organisms';

import {Error} from '@pages';

import {useAbortAllTestSuiteExecutionsMutation, useGetTestSuitesQuery} from '@services/testSuites';

import {initialFilters, useTestSuitesField, useTestSuitesSync} from '@store/testSuites';

import {PollingIntervals} from '@utils/numbers';

import EmptyTestSuites from './EmptyTestSuites';
import TestSuiteCard from './TestSuiteCard';
import TestSuiteCreationModalContent from './TestSuiteCreationModalContent';

const PageDescription: FC = () => <>Explore your test suites at a glance...</>;

const TestSuitesList: FC = () => {
  const isAvailable = useSystemAccess(SystemAccess.agent);
  const [filters, setFilters] = useTestSuitesField('filters');
  const pageTitleAddon = useLegacySlotFirst('testSuitesListTitleAddon');

  const {
    data: testSuites,
    error,
    isLoading,
    isFetching,
  } = useGetTestSuitesQuery(filters || null, {
    pollingInterval: PollingIntervals.everySecond,
    skip: !isAvailable,
  });
  useTestSuitesSync({testSuites});

  const {open: openCreateModal} = useModal({
    title: 'Create a test suite',
    width: 528,
    content: <TestSuiteCreationModalContent />,
    dataTestCloseBtn: 'add-a-new-test-suite-modal-close-button',
    dataTestModalRoot: 'add-a-new-test-suite-modal',
  });

  const [abortAll] = useAbortAllTestSuiteExecutionsMutation();
  const onItemClick = useDashboardNavigate((item: TestSuite) => `/test-suites/${item.name}`);
  const onItemAbort = useCallback((item: TestSuite) => {
    abortAll({id: item.name})
      .unwrap()
      .catch(() => {
        notificationCall('failed', 'Something went wrong during test suite execution abortion');
      });
  }, []);

  if (error) {
    return <Error title={(error as any)?.data?.title} description={(error as any)?.data?.detail} />;
  }

  return (
    <EntityListContent
      itemKey="testSuite.name"
      CardComponent={TestSuiteCard}
      onItemClick={onItemClick}
      onItemAbort={onItemAbort}
      entity="test-suites"
      pageTitle="Test Suites"
      pageTitleAddon={pageTitleAddon}
      addEntityButtonText="Add a new test suite"
      pageDescription={PageDescription}
      emptyDataComponent={EmptyTestSuites}
      initialFiltersState={initialFilters}
      dataTest="add-a-new-test-suite-btn"
      queryFilters={filters}
      setQueryFilters={setFilters}
      data={testSuites}
      isLoading={isLoading}
      isFetching={isFetching}
      onAdd={openCreateModal}
    />
  );
};

export default TestSuitesList;
