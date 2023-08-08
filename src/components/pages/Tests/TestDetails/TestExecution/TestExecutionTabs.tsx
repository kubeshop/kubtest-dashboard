import {useEffect} from 'react';

import {Tabs} from 'antd';

import {Execution} from '@models/execution';

import {CLICommands, ExecutionsVariablesList, LogOutput} from '@molecules';

import {usePluginSlotList, usePluginState} from '@plugins/pluginHooks';
import {TestExecutionTabsInterface} from '@plugins/types';

import {useAppSelector} from '@redux/hooks';
import {selectExecutorsFeaturesMap} from '@redux/reducers/executorsSlice';

import {useEntityDetailsPick} from '@store/entityDetails';
import {useExecutionDetailsPick} from '@store/executionDetails';

import {decomposeVariables} from '@utils/variables';

import TestExecutionArtifacts from './TestExecutionArtifacts';

const TestExecutionTabs: React.FC = () => {
  const {data: execution} = useExecutionDetailsPick('data') as {data: Execution};
  const {details} = useEntityDetailsPick('details');
  const [, setTestExecutionTabsData] = usePluginState<TestExecutionTabsInterface>('testExecutionTabs');

  const executorsFeaturesMap = useAppSelector(selectExecutorsFeaturesMap);

  const {
    testType,
    executionResult: {status, output},
    variables,
    id,
    testName,
    testSuiteName,
    startTime,
  } = execution;

  const isRunning = status === 'running';

  const decomposedVars = decomposeVariables(variables || {});

  const whetherToShowArtifactsTab = executorsFeaturesMap[testType]?.includes('artifacts');

  useEffect(() => {
    setTestExecutionTabsData({execution, test: details});
  }, [execution, details]);

  const defaultExecutionTabs = [
    {
      value: {
        key: 'LogOutputPane',
        label: 'Log Output',
        children: <LogOutput logOutput={output} executionId={id} isRunning={isRunning} />,
      },
      metadata: {
        order: Infinity,
      },
    },
    {
      value: {
        key: 'ArtifactsPane',
        label: 'Artifacts',
        children: (
          <TestExecutionArtifacts
            id={id}
            testName={testName}
            testSuiteName={testSuiteName}
            startTime={startTime.toString()}
          />
        ),
      },
      metadata: {
        order: 3,
        visible: () => whetherToShowArtifactsTab,
      },
    },
    {
      value: {
        key: 'CLICommands',
        label: 'CLI Commands',
        children: <CLICommands isExecutions type={testType} id={id} modifyMap={{status}} />,
      },
      metadata: {
        order: 2,
      },
    },
    {
      value: {
        key: 'Variables',
        label: 'Variables',
        children: <ExecutionsVariablesList variables={decomposedVars} />,
      },
      metadata: {
        order: 1,
        visible: () => decomposedVars.length,
      },
    },
  ];

  const items = usePluginSlotList('testExecutionTabs', defaultExecutionTabs);

  return <Tabs items={items} />;
};

export default TestExecutionTabs;