import {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {Tabs} from 'antd';

import {DashboardContext, MainContext} from '@contexts';

import PageMetadata from '@pages/PageMetadata';

import {useGetTriggerByIdQuery, useGetTriggersKeyMapQuery} from '@services/triggers';

import {useStore} from '@store';

import {safeRefetch} from '@utils/fetchUtils';

import {StyledContainer, StyledPageHeader} from './TriggerDetails.styled';
import TriggerSettings from './TriggerSettings';

const TriggerDetails = () => {
  const {isClusterAvailable} = useContext(MainContext);
  const {location, navigate} = useContext(DashboardContext);

  const {setCurrentTrigger, setTriggersKeyMap} = useStore(state => ({
    setCurrentTrigger: state.setCurrentTrigger,
    setTriggersKeyMap: state.setTriggersKeyMap,
  }));

  const name = useParams().id!;

  const [activeTabKey, setActiveTabKey] = useState('Settings');

  const {data: triggerDetails, refetch} = useGetTriggerByIdQuery(name, {skip: !isClusterAvailable});
  const {data: triggersKeyMap, refetch: refetchKeyMap} = useGetTriggersKeyMapQuery(null, {skip: !isClusterAvailable});

  const isPageDisabled = !name;

  useEffect(() => {
    if (triggerDetails) {
      setCurrentTrigger(triggerDetails);
    }
  }, [triggerDetails]);

  useEffect(() => {
    if (triggersKeyMap) {
      setTriggersKeyMap(triggersKeyMap);
    }
  }, [triggersKeyMap]);

  useEffect(() => {
    safeRefetch(refetch);
  }, [name]);

  return (
    <StyledContainer>
      <PageMetadata title={`${name} | Triggers`} />

      <StyledPageHeader onBack={() => navigate('/triggers')} title={name} className="testkube-pageheader" />
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} destroyInactiveTabPane>
        <Tabs.TabPane tab="Settings" key="Settings" disabled={isPageDisabled}>
          {triggerDetails ? <TriggerSettings /> : null}
        </Tabs.TabPane>
      </Tabs>
    </StyledContainer>
  );
};

export default TriggerDetails;
