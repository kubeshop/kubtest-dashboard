/* eslint-disable unused-imports/no-unused-imports-ts */
import {useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {TableRowSelection} from 'antd/lib/table/interface';

import {useGA4React} from 'ga-4-react';
import moment from 'moment';

import {useAppSelector} from '@redux/hooks';
import {clearTargetTestId, selectApiEndpoint, selectRedirectTarget} from '@redux/reducers/configSlice';

import {PollingIntervals} from '@utils/numbers';

import {useGetExecutionsQuery} from '@services/executions';
import {useGetTestSuiteExecutionsByTestIdQuery} from '@services/testSuiteExecutions';
import {useGetTestSuitesQuery} from '@services/testSuites';
import {useGetTestsQuery} from '@services/tests';

import {DashboardContext} from '../DashboardContainer/DashboardContainer';
import {
  StyledContentTable,
  StyledDashboardContent,
  StyledDashboardContentContainer,
  StyledDashboardContentTitleBottomGradient,
  StyledDashboardContentTitleGradient,
} from './DashboardContent.styled';
import DashboardFilters from './DashboardFilters';
import DashboardTableRow from './DashboardTableRow';
import DashboardTitle from './DashboardTitle';

// The reason I've done this is here https://github.com/reduxjs/redux-toolkit/issues/1970.
// Let's discuss if you have anything to add, maybe an idea how to rework it.
const TestSuitesDataLayer = ({onDataChange, queryFilters}: any) => {
  const {data, isLoading, isFetching, refetch} = useGetTestSuitesQuery(queryFilters || null, {
    pollingInterval: PollingIntervals.everySecond,
  });

  useEffect(() => {
    onDataChange({data, isLoading, isFetching, refetch});
  }, [data, isLoading, isFetching]);

  return <></>;
};

const TestSuiteExecutionsDataLayer = ({onDataChange, queryFilters}: any) => {
  const {data, isLoading, isFetching, refetch} = useGetTestSuiteExecutionsByTestIdQuery(queryFilters || null, {
    pollingInterval: PollingIntervals.everySecond,
  });

  useEffect(() => {
    onDataChange({data, isLoading, isFetching, refetch});
  }, [data, isLoading, isFetching]);

  return <></>;
};

const TestsDataLayer = ({onDataChange, queryFilters}: any) => {
  const {data, isLoading, isFetching, refetch} = useGetTestsQuery(queryFilters || null, {
    pollingInterval: PollingIntervals.everySecond,
  });

  useEffect(() => {
    onDataChange({data, isLoading, isFetching, refetch});
  }, [data, isLoading, isFetching]);

  return <></>;
};

const ExecutionsDataLayer = ({onDataChange, queryFilters}: any) => {
  const {data, isLoading, isFetching, refetch} = useGetExecutionsQuery(queryFilters || null, {
    pollingInterval: PollingIntervals.everySecond,
  });

  useEffect(() => {
    onDataChange({data, isLoading, isFetching, refetch});
  }, [data, isLoading, isFetching]);

  return <></>;
};

const DashboardContent: React.FC<any> = props => {
  const {onRowSelect, paginationOptions} = props;

  const {
    selectedRecord,
    entityType,
    selectedRecordIdFieldName,
    queryFilters,
    setData,
    canSelectRow,
    setSelectedRecord,
    shouldInfoPanelBeShown,
    isInfoPanelExpanded,
    isSecondLevelOpen,
    filtersComponentsIds,
    setQueryFilters,
    pageTitle,
    dataSource,
    columns,
    dashboardGradient,
    setSelectedExecution,
    closeSecondLevel,
    reduxListName,
  } = useContext(DashboardContext);

  const dispatch = useDispatch();

  const ga4React = useGA4React();

  const apiEndpoint = useAppSelector(selectApiEndpoint);
  const {targetTestId, targetTestExecutionId} = useAppSelector(selectRedirectTarget);

  const [contentProps, setContentProps] = useState<any>({
    data: null,
    isLoading: false,
    isFetching: false,
    refetch: () => {},
  });

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys:
      selectedRecord && selectedRecordIdFieldName ? [`${entityType}-${selectedRecord[selectedRecordIdFieldName]}`] : [],
    columnWidth: 0,
    renderCell: () => null,
  };

  const onDataChange = (data: any) => {
    setContentProps(data);
  };

  const dataLayers: any = {
    'Test Suites': <TestSuitesDataLayer onDataChange={onDataChange} queryFilters={queryFilters} />,
    'Test Suite Executions': <TestSuiteExecutionsDataLayer onDataChange={onDataChange} queryFilters={queryFilters} />,
    Tests: <TestsDataLayer onDataChange={onDataChange} queryFilters={queryFilters} />,
    Executions: <ExecutionsDataLayer onDataChange={onDataChange} queryFilters={queryFilters} />,
  };

  useEffect(() => {
    if (!setData) {
      return;
    }

    if (contentProps.data || contentProps.data?.length) {
      if (targetTestId && contentProps.data[0][reduxListName].name === targetTestId) {
        onRowSelect(contentProps.data[0][reduxListName]);
        dispatch(clearTargetTestId());
      }

      dispatch(setData(contentProps.data));

      return;
    }

    if (!contentProps.data) {
      // if no results - set result as an empty array because not all the time we get an empty array from backend
      dispatch(setData([]));

      // if no results - deselect the row
      if (canSelectRow) {
        dispatch(setSelectedRecord({selectedRecord: null}));
      }
    }
  }, [contentProps.data]);

  useEffect(() => {
    contentProps?.refetch();
  }, [apiEndpoint, queryFilters]);

  useEffect(() => {
    if (!targetTestId && !targetTestExecutionId) {
      closeSecondLevel();
    }
  }, [selectedRecord]);

  useEffect(() => {
    dispatch(setSelectedRecord({selectedRecord: null}));
  }, [entityType]);

  useEffect(() => {
    if (ga4React) {
      ga4React.gtag('event', 'get_dashboard_results', {dashboard_entity: pageTitle});
    }
  }, [contentProps.data, ga4React]);

  return (
    <StyledDashboardContentContainer
      shouldInfoPanelBeShown={shouldInfoPanelBeShown}
      isInfoPanelExpanded={isInfoPanelExpanded}
      isSecondLevelOpen={isSecondLevelOpen}
      gradient={dashboardGradient}
    >
      {dataLayers[pageTitle]}
      <StyledDashboardContentTitleGradient gradient={dashboardGradient}>
        <StyledDashboardContentTitleBottomGradient />
      </StyledDashboardContentTitleGradient>
      <StyledDashboardContent>
        <DashboardTitle>{pageTitle}</DashboardTitle>
        {filtersComponentsIds && filtersComponentsIds.length ? (
          <DashboardFilters
            setSelectedRecord={setSelectedRecord}
            selectedRecord={selectedRecord}
            setFilters={setQueryFilters}
            filters={queryFilters}
            filtersComponentsIds={filtersComponentsIds}
            entityType={entityType}
          />
        ) : null}
        <StyledContentTable
          dataSource={dataSource}
          columns={[
            {
              render: (data: any) => {
                const {latestExecution, dataItem} = data;
                let status = null;
                let recentDate = null;

                if (latestExecution) {
                  status =
                    entityType !== 'test-suites' ? latestExecution.executionResult?.status : latestExecution.status;
                  recentDate = moment(latestExecution.endTime).format('MMM D, HH:mm');
                } else {
                  status = 'neverRun';
                  recentDate = 'The Future';
                }

                return (
                  <DashboardTableRow
                    name={dataItem.name}
                    labels={dataItem.labels}
                    latestExecution={latestExecution}
                    status={status}
                    recentDate={recentDate}
                    entityType={entityType}
                    type={dataItem.type}
                    isRowActive={selectedRecord?.name === dataItem?.name}
                  />
                );
              },
            },
          ]}
          loading={contentProps.isLoading}
          rowSelection={canSelectRow ? rowSelection : undefined}
          rowClassName="dashboard-content-table"
          rowKey={(record: any) => {
            return `${entityType}${
              selectedRecordIdFieldName && record.dataItem[selectedRecordIdFieldName]
                ? `-${record.dataItem[selectedRecordIdFieldName]}`
                : ''
            }`;
          }}
          pagination={paginationOptions}
          onRow={(record: any) => ({
            onClick: () => {
              if (canSelectRow) {
                onRowSelect(record.dataItem);
              }
            },
          })}
          showHeader={false}
        />
      </StyledDashboardContent>
    </StyledDashboardContentContainer>
  );
};

export default DashboardContent;
