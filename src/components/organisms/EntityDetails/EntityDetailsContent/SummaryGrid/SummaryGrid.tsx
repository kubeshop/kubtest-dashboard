/* eslint-disable camelcase */
import {useContext} from 'react';

import {Metrics} from '@models/metrics';

import {Text, Title} from '@custom-antd';

import Colors from '@styles/Colors';

import {EntityDetailsContext} from '@contexts';

import {MetricsBarChart} from '@src/components/molecules';

import {SummaryGridItem, SummaryGridWrapper} from './SummaryGrid.styled';

type SummaryGridProps = {
  metrics: Metrics;
};

const SummaryGrid: React.FC<SummaryGridProps> = props => {
  const {metrics} = props;
  const {
    execution_duration_p50,
    execution_duration_p90,
    execution_duration_p99,
    executions,
    total_executions,
    failed_executions,
    pass_fail_ratio,
  } = metrics;

  const {isRowSelected} = useContext(EntityDetailsContext);

  return (
    <>
      <SummaryGridWrapper $gridCols={isRowSelected ? 2 : 5}>
        <SummaryGridItem>
          <Text className="uppercase middle" color={Colors.slate500}>
            pass/fail ratio
          </Text>
          <Title level={3}>{pass_fail_ratio.toFixed(2)}%</Title>
        </SummaryGridItem>
        <SummaryGridItem>
          <Text className="uppercase middle" color={Colors.slate500}>
            execution duration (p50)
          </Text>
          <Title level={3}>{execution_duration_p50}</Title>
        </SummaryGridItem>
        <SummaryGridItem>
          <Text className="uppercase middle" color={Colors.slate500}>
            execution duration (p90)
          </Text>
          <Title level={3}>{execution_duration_p90}</Title>
        </SummaryGridItem>
        <SummaryGridItem>
          <Text className="uppercase middle" color={Colors.slate500}>
            failed executions
          </Text>
          <Title level={3}>{failed_executions}</Title>
        </SummaryGridItem>
        <SummaryGridItem>
          <Text className="uppercase middle" color={Colors.slate500}>
            total executions
          </Text>
          <Title level={3}>{total_executions}</Title>
        </SummaryGridItem>
      </SummaryGridWrapper>
      <MetricsBarChart data={executions} />
    </>
  );
};

export default SummaryGrid;
