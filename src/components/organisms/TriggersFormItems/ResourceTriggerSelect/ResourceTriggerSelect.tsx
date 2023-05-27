import {useContext, useMemo} from 'react';

import {Form, Select} from 'antd';

import {TestForTrigger} from '@models/test';
import {TestSuiteForTrigger} from '@models/testSuite';

import {useAppSelector} from '@redux/hooks';
import {selectExecutors} from '@redux/reducers/executorsSlice';
import {getTestExecutorIcon} from '@redux/utils/executorIcon';

import {ExecutorIcon} from '@atoms';

import {Text} from '@custom-antd';

import {required} from '@utils/form';

import {ReactComponent as TestSuitesIcon} from '@assets/test-suites-icon.svg';

import {useGetAllTestSuitesQuery} from '@services/testSuites';
import {useGetAllTestsQuery} from '@services/tests';

import Colors from '@styles/Colors';

import {MainContext} from '@contexts';

import {StyledResourceOptionWrapper} from './ResourceTriggerSelect.styled';

const {Option, OptGroup} = Select;

const ResourceTriggerSelect = () => {
  const {isClusterAvailable} = useContext(MainContext);

  const executors = useAppSelector(selectExecutors);

  const {data: tests = []} = useGetAllTestsQuery(null, {skip: !isClusterAvailable});
  const {data: testSuites = []} = useGetAllTestSuitesQuery(null, {
    skip: !isClusterAvailable,
  });

  const testsData: TestForTrigger[] = useMemo(() => {
    return tests.map(item => ({
      name: item.test.name,
      namespace: item.test.namespace,
      type: item.test.type,
    }));
  }, [tests]);

  const testSuitesData: TestSuiteForTrigger[] = useMemo(() => {
    return testSuites.map(item => ({
      name: item.testSuite.name,
      namespace: item.testSuite.namespace,
    }));
  }, [testSuites]);

  return (
    <Form.Item label="Testkube resource" required name="testNameSelector" rules={[required]}>
      <Select optionLabelProp="key" placeholder="Your testkube resource">
        {testsData.length > 0 ? (
          <OptGroup label="Tests">
            {testsData.map(item => (
              <Option key={item.name}>
                <StyledResourceOptionWrapper>
                  <ExecutorIcon type={getTestExecutorIcon(executors, item.type)} />
                  <Text className="regular middle">{item.name}</Text>
                </StyledResourceOptionWrapper>
              </Option>
            ))}
          </OptGroup>
        ) : null}
        {testSuitesData.length > 0 ? (
          <OptGroup label="Test Suites">
            {testSuitesData.map(item => (
              <Option key={item.name}>
                <StyledResourceOptionWrapper>
                  <TestSuitesIcon fill={Colors.slate100} />
                  <Text className="regular middle">{item.name}</Text>
                </StyledResourceOptionWrapper>
              </Option>
            ))}
          </OptGroup>
        ) : null}
      </Select>
    </Form.Item>
  );
};

export default ResourceTriggerSelect;
