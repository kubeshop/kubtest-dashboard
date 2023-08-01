import {FC, ReactNode} from 'react';

import {Tabs} from 'antd';

import useTrackTimeAnalytics from '@hooks/useTrackTimeAnalytics';

import {CLICommands, MetricsBarChart} from '@molecules';

import ExecutionsTable from '@organisms/EntityDetails/EntityDetailsContent/ExecutionsTable';

import {useEntityDetailsPick} from '@store/entityDetails';

import Colors from '@styles/Colors';

interface EntityDetailsContentTabsProps {
  settings: ReactNode;
  tab?: string;
  onTabChange: (tab: string) => void;
  onRun: () => void;
}

const EntityDetailsContentTabs: FC<EntityDetailsContentTabsProps> = ({settings, tab, onTabChange, onRun}) => {
  const {entity, metrics, details} = useEntityDetailsPick('entity', 'metrics', 'details');

  useTrackTimeAnalytics(`${entity}-details`, tab !== 'settings');
  useTrackTimeAnalytics(`${entity}-settings`, tab === 'settings');

  if (!details) {
    return null;
  }

  return (
    <Tabs
      activeKey={tab || 'executions'}
      onChange={onTabChange}
      destroyInactiveTabPane
      items={[
        {
          key: 'executions',
          label: 'Recent executions',
          disabled: !details,
          children: (
            <>
              <MetricsBarChart
                data={metrics?.executions}
                isDetailsView
                executionDurationP50ms={metrics?.executionDurationP50ms}
                executionDurationP95ms={metrics?.executionDurationP95ms}
              />
              <ExecutionsTable onRun={onRun} />
            </>
          ),
        },
        {
          key: 'commands',
          label: 'CLI Commands',
          disabled: !details,
          children: <CLICommands name={details?.name} bg={Colors.slate800} />,
        },
        {
          key: 'settings',
          label: 'Settings',
          disabled: !details,
          children: settings,
        },
      ]}
    />
  );
};

export default EntityDetailsContentTabs;
