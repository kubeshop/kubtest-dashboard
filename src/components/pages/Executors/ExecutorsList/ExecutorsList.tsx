import {useContext, useEffect, useMemo, useState} from 'react';

import {Tabs} from 'antd';

import {getTestExecutorIcon} from '@redux/utils/executorIcon';

import {ExecutorIcon, ExternalLink} from '@atoms';

import {Button, Modal, Skeleton, Text, Title} from '@custom-antd';

import {PageBlueprint} from '@organisms';

import {safeRefetch} from '@utils/fetchUtils';

import {ReactComponent as ExecutorsIcon} from '@assets/executor.svg';

import {useApiEndpoint} from '@services/apiEndpoint';
import {useGetExecutorsQuery} from '@services/executors';

import Colors from '@styles/Colors';

import {Permissions, usePermission} from '@permissions/base';

import {DashboardContext, MainContext} from '@contexts';

import {executorsList} from '../utils';
import AddExecutorsModal from './AddExecutorsModal';
import EmptyCustomExecutors from './EmptyCustomExecutors';
import {
  CustomExecutorContainer,
  ExecutorsGrid,
  ExecutorsGridItem,
  ExecutorsListSkeletonWrapper,
} from './ExecutorsList.styled';

const Executors: React.FC = () => {
  const {isClusterAvailable} = useContext(MainContext);
  const {navigate} = useContext(DashboardContext);
  const mayCreate = usePermission(Permissions.createEntity);
  const apiEndpoint = useApiEndpoint();

  const [activeTabKey, setActiveTabKey] = useState('custom');
  const [isAddExecutorModalVisible, setAddExecutorModalVisibility] = useState(false);

  const {data: executors, isLoading, refetch} = useGetExecutorsQuery(null, {skip: !isClusterAvailable});

  const customExecutors = executors?.filter(executorItem => executorItem.executor.executorType === 'container') || [];

  const onNavigateToDetails = (name: string) => {
    navigate(`/executors/${name}`);
  };

  useEffect(() => {
    safeRefetch(refetch);
  }, [apiEndpoint]);

  const renderedExecutorsGrid = useMemo(() => {
    return executorsList.map(executorItem => {
      const {type, title, description, docLink} = executorItem;

      const isExecutor = type !== 'custom';
      const executorIcon = getTestExecutorIcon(executors || [], type);

      return (
        <ExternalLink href={docLink} key={docLink}>
          <ExecutorsGridItem className={isExecutor ? 'executor' : 'custom-executor'} direction="vertical" size={20}>
            <Title level={3} color={Colors.slate400} className="dashboard-title regular">
              {isExecutor ? <ExecutorIcon type={executorIcon} /> : <ExecutorsIcon />}
              {title}
            </Title>
            <Text color={Colors.slate400} className="regular middle">
              {description}
            </Text>
            <Button $customType="secondary">Learn more</Button>
          </ExecutorsGridItem>
        </ExternalLink>
      );
    });
  }, [executorsList, executors]);

  const renderedCustomExecutorsGrid = useMemo(() => {
    return customExecutors.map(executorItem => {
      return (
        <CustomExecutorContainer onClick={() => onNavigateToDetails(executorItem.name)} key={executorItem.name}>
          <Text className="regular big">{executorItem.name}</Text>
          <Text color={Colors.slate500}>{executorItem.executor.executorType}</Text>
          <Text color={Colors.slate500}>{executorItem.executor.image}</Text>
        </CustomExecutorContainer>
      );
    });
  }, [customExecutors]);

  return (
    <PageBlueprint
      title="Executors"
      description={
        <>
          Executors are the type of tests which can be run by testkube. Learn more about{' '}
          <ExternalLink href="https://kubeshop.github.io/testkube/test-types/executor-custom">executors</ExternalLink>
        </>
      }
      headerButton={
        mayCreate ? (
          <Button
            $customType="primary"
            onClick={() => setAddExecutorModalVisibility(true)}
            disabled={!isClusterAvailable}
          >
            Create a new executor
          </Button>
        ) : null
      }
    >
      <Tabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        destroyInactiveTabPane
        defaultActiveKey="custom"
        items={[
          {
            label: 'Custom executors',
            key: 'custom',
            children: isLoading ? (
              <ExecutorsListSkeletonWrapper>
                {new Array(6).fill(0).map((_, index) => {
                  const key = `skeleton-item-${index}`;

                  return <Skeleton additionalStyles={{lineHeight: 80}} key={key} />;
                })}
              </ExecutorsListSkeletonWrapper>
            ) : renderedCustomExecutorsGrid && renderedCustomExecutorsGrid.length ? (
              <ExecutorsGrid>{renderedCustomExecutorsGrid}</ExecutorsGrid>
            ) : (
              <EmptyCustomExecutors
                onButtonClick={() => {
                  setAddExecutorModalVisibility(true);
                }}
              />
            ),
          },
          {
            label: 'Official executors',
            key: 'official',
            children: <ExecutorsGrid>{renderedExecutorsGrid}</ExecutorsGrid>,
          },
        ]}
      />
      {isAddExecutorModalVisible ? (
        <Modal
          title="Create an executor"
          isModalVisible={isAddExecutorModalVisible}
          setIsModalVisible={setAddExecutorModalVisibility}
          width={880}
          content={<AddExecutorsModal />}
        />
      ) : null}
    </PageBlueprint>
  );
};

export default Executors;
