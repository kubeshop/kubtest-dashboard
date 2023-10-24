import {useMemo} from 'react';

import {Layout} from 'antd';
import {Content} from 'antd/lib/layout/layout';

import {usePluginSystem} from '@testkube/plugins/src/usePluginSystem';

import {ReactComponent as Logo} from '@assets/testkube-symbol-color.svg';

import env from '@env';

import {useAxiosInterceptors} from '@hooks/useAxiosInterceptors';

import {Sider} from '@organisms';

import {ErrorBoundary} from '@pages';

import {BasePermissionsResolver} from '@permissions/base';

import AiInsightsPromoPlugin from '@plugins/ai-insights-promo/plugin';
import CloudBannerPlugin from '@plugins/cloud-banner/plugin';
import ClusterStatusPlugin from '@plugins/cluster-status/plugin';
import ClusterPlugin from '@plugins/cluster/plugin';
import ConfigPlugin from '@plugins/config/plugin';
import ExecutorsPlugin from '@plugins/executors/plugin';
import FeatureFlagsPlugin from '@plugins/feature-flags/plugin';
import GeneralPlugin from '@plugins/general/plugin';
import LabelsPlugin from '@plugins/labels/plugin';
import ModalPlugin from '@plugins/modal/plugin';
import PermissionsPlugin from '@plugins/permissions/plugin';
import RouterPlugin from '@plugins/router/plugin';
import RtkPlugin from '@plugins/rtk/plugin';
import SettingsPlugin from '@plugins/settings/plugin';
import SiderCloudMigratePlugin from '@plugins/sider-cloud-migrate/plugin';
import SiderLogoPlugin from '@plugins/sider-logo/plugin';
import SiderSupportPlugin from '@plugins/sider-support/plugin';
import TelemetryPlugin from '@plugins/telemetry/plugin';
import TestSourcesPlugin from '@plugins/test-sources/plugin';
import TestsAndTestSuitesPlugin from '@plugins/tests-and-test-suites/plugin';
import TriggersPlugin from '@plugins/triggers/plugin';
import WebhooksPlugin from '@plugins/webhooks/plugin';

import {TelemetryProvider} from '@telemetry/provider';

import {externalLinks} from '@utils/externalLinks';

import App from './App';
import {StyledLayoutContentWrapper} from './App.styled';

const AppRoot: React.FC = () => {
  useAxiosInterceptors();

  const plugins = useMemo(
    () => [
      SiderLogoPlugin.configure({logo: <Logo />}),
      ConfigPlugin.configure({discordUrl: externalLinks.discord}),
      RouterPlugin.configure({baseUrl: env.basename || ''}),
      PermissionsPlugin.configure({resolver: new BasePermissionsResolver()}),
      SiderSupportPlugin,
      SiderCloudMigratePlugin,
      FeatureFlagsPlugin,
      ClusterStatusPlugin,
      TelemetryPlugin,
      GeneralPlugin,
      ClusterPlugin,
      ExecutorsPlugin,
      WebhooksPlugin,
      TriggersPlugin,
      TestSourcesPlugin,
      SettingsPlugin,
      TestsAndTestSuitesPlugin,
      CloudBannerPlugin,
      AiInsightsPromoPlugin,
      LabelsPlugin,
      RtkPlugin,
      ModalPlugin,
    ],
    []
  );
  const [PluginProvider, {routes}] = usePluginSystem(plugins);

  return (
    <ErrorBoundary>
      <TelemetryProvider
        prefix="tk.ui."
        app={useMemo(() => ({name: 'testkube:ui/oss', version: env.version}), [])}
        gtmId={env.disableTelemetry ? undefined : env.gtmKey}
        debug={env.debugTelemetry}
        paused
      >
        <PluginProvider>
          <Layout>
            <Sider />
            <StyledLayoutContentWrapper>
              <Content>
                <ErrorBoundary>
                  <App routes={routes} />
                </ErrorBoundary>
              </Content>
            </StyledLayoutContentWrapper>
          </Layout>
        </PluginProvider>
      </TelemetryProvider>
    </ErrorBoundary>
  );
};

export default AppRoot;
