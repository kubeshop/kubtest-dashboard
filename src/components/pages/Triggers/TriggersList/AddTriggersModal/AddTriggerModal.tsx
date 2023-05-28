import React, {useContext, useRef, useState} from 'react';

import {Form, Space, Steps} from 'antd';

import {Option} from '@models/form';
import {ErrorNotificationConfig} from '@models/notifications';

import {useAppSelector} from '@redux/hooks';
import {selectNamespace} from '@redux/reducers/configSlice';

import {Button, Input, Text} from '@custom-antd';

import {NotificationContent} from '@molecules';

import {ActionFormItems, ConditionFormItems} from '@organisms';

import useInViewport from '@hooks/useInViewport';

import {useCreateTriggerMutation} from '@services/triggers';

import Colors from '@styles/Colors';

import {DashboardContext} from '@contexts';

import {displayDefaultNotificationFlow} from '@src/utils/notification';

import {getResourceIdentifierSelector} from '../../utils';
import {StyledButtonsContainer, StyledNotificationContainer, StyledStepDescription} from './AddTriggersModal.styled';

type AddSourceFormValues = {
  name: string;
  uri: string;
  token?: string;
  username?: string;
};

const AddTriggerModal: React.FC = () => {
  const {navigate} = useContext(DashboardContext);

  const [createTrigger, {isLoading}] = useCreateTriggerMutation();

  const appNamespace = useAppSelector(selectNamespace);

  const [error, setError] = useState<ErrorNotificationConfig | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [firstStepValues, setFirstStepValues] = useState<Record<string, string | Option[]>>({});

  const topRef = useRef<HTMLDivElement>(null);
  const inTopInViewport = useInViewport(topRef);

  const [form] = Form.useForm();

  const onFinish = () => {
    const values = form.getFieldsValue();

    const resourceSelector = getResourceIdentifierSelector(
      firstStepValues.resourceLabelSelector || firstStepValues.resourceNameSelector,
      appNamespace
    );

    const testSelector = getResourceIdentifierSelector(
      values.testLabelSelector || values.testNameSelector,
      appNamespace
    );

    const [action, execution] = values.action.split(' ');

    const body = {
      ...(name ? {name} : {}),
      resource: firstStepValues.resource,
      event: firstStepValues.event,
      action,
      execution,
      testSelector,
      resourceSelector,
    };
    createTrigger(body)
      .then(res => displayDefaultNotificationFlow(res))
      .then(res => {
        if (res && 'data' in res) {
          navigate(`/triggers/${res.data.name}`);
        }
      })
      .catch(err => {
        setError(err);

        if (!inTopInViewport && topRef && topRef.current) {
          topRef.current.scrollIntoView();
        }
      });
  };

  return (
    <>
      <div ref={topRef} />
      <Space size={24} direction="vertical" style={{width: '100%', marginTop: 0}}>
        <Space direction="vertical" style={{width: '100%'}}>
          {error ? (
            <StyledNotificationContainer>
              <NotificationContent status="failed" message={error.message} title={error.title} />
            </StyledNotificationContainer>
          ) : null}
          <Text className="regular middle">Name</Text>
          <Input
            placeholder="e.g.: container-deployment-xyz"
            value={name}
            onChange={event => {
              setName(event.target.value);
            }}
          />
        </Space>
        <Steps current={currentStep} items={[{title: 'Condition'}, {title: 'Action'}]} />
        <Form layout="vertical" onFinish={onFinish} form={form} name="add-trigger-form">
          {currentStep === 0 ? (
            <>
              <StyledStepDescription>
                <Text color={Colors.slate400} className="regular middle">
                  Define the conditions to be met for the trigger to be called.
                </Text>
              </StyledStepDescription>
              <ConditionFormItems />
              <Form.Item
                style={{
                  textAlign: 'end',
                  marginBottom: 0,
                }}
                shouldUpdate
              >
                {({getFieldsValue, validateFields}) => (
                  <Button
                    $customType="primary"
                    onClick={() => {
                      validateFields().then(() => {
                        setCurrentStep(1);
                        setFirstStepValues(getFieldsValue());
                      });
                    }}
                  >
                    Next
                  </Button>
                )}
              </Form.Item>
            </>
          ) : (
            <>
              <StyledStepDescription>
                <Text color={Colors.slate400} className="regular middle">
                  Define the action to be performed on testkube once the conditions are met.
                </Text>
              </StyledStepDescription>
              <ActionFormItems />
              <Form.Item style={{marginBottom: 0}} shouldUpdate>
                {({isFieldsTouched}) => (
                  <StyledButtonsContainer>
                    <Button
                      $customType="secondary"
                      onClick={() => {
                        setCurrentStep(0);
                      }}
                    >
                      Back
                    </Button>
                    <Button htmlType="submit" $customType="primary" loading={isLoading} disabled={!isFieldsTouched()}>
                      {isLoading ? 'Creating...' : 'Create'}
                    </Button>
                  </StyledButtonsContainer>
                )}
              </Form.Item>
            </>
          )}
        </Form>
      </Space>
    </>
  );
};

export default AddTriggerModal;
