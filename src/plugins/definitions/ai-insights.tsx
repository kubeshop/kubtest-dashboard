import {IconLabel} from '@atoms/IconLabel';
import {Tag} from '@atoms/Tag';

import {config} from '@constants/config';

import {AiInsightsTab} from '@molecules/AiInsightsTab';
import {MessagePanel} from '@molecules/MessagePanel';

import {PluginScope} from '@plugins/PluginScope';
import type {LogOutputBannerInterface, Plugin, TestExecutionTabsInterface} from '@plugins/types';

const isTestExecutionFailed = (scope: PluginScope) => {
  return (
    scope.getState<TestExecutionTabsInterface>('testExecutionTabs')?.execution?.executionResult?.status === 'failed'
  );
};

export const createAiInsightsPlugin = (): Plugin => ({
  name: 'ai-insights',
  setup: scope => {
    scope.appendSlot(
      'testExecutionTabs',
      {
        key: 'ai-insights',
        label: <IconLabel title="AI Insights" icon={<Tag title="NEW" type="info" />} />,
        children: <AiInsightsTab />,
      },
      {
        order: 4,
        visible: () => {
          return isTestExecutionFailed(scope);
        },
      }
    );
    scope.appendSlot(
      'testExecutionLogOutputBanner',
      <MessagePanel
        buttons={[
          {
            type: 'secondary',
            text: 'Learn more',
            isLink: true,
            linkConfig: {
              href: 'https://testkube.io/get-started',
              target: '_blank',
            },
          },
          {
            type: 'primary',
            text: 'Get AI Hints for this test',
            onClick: () => {
              localStorage.setItem(config.isAiBannerHidden, 'true');
              scope.getState<LogOutputBannerInterface>('testExecutionLogOutputBanner')?.setExecutionTab('ai-insights');
            },
          },
        ]}
        onClose={() => {
          localStorage.setItem(config.isAiBannerHidden, 'true');
        }}
        isClosable
        type="default"
        title="🎉 Get AI support on failing tests! 🎉"
        description="Try our AI Hints to improve your tests and get support to debug them more efficiently."
      />,
      {
        visible: () => localStorage.getItem(config.isAiBannerHidden) !== 'true' && isTestExecutionFailed(scope),
      }
    );
  },
});
