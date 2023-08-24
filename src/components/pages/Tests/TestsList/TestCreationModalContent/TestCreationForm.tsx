import {FC, useMemo, useRef, useState} from 'react';

import {Form, FormInstance, Input, Select} from 'antd';

import {Button} from '@custom-antd/Button';
import {FormItem} from '@custom-antd/Form/FormItem';
import {Text} from '@custom-antd/Typography/Text';

import {useInViewport} from '@hooks/useInViewport';

import type {Executor} from '@models/executors';
import type {MetadataResponse, RTKResponse} from '@models/fetch';
import type {Option} from '@models/form';
import type {ErrorNotificationConfig} from '@models/notifications';
import type {SourceWithRepository} from '@models/sources';
import type {Test} from '@models/test';

import {LabelsSelect} from '@molecules/LabelsSelect';
import {decomposeLabels} from '@molecules/LabelsSelect/utils';
import {NotificationContent} from '@molecules/Notification/NotificationContent';

import {CustomFormFields as CustomCreationFormFields} from '@organisms/TestConfigurationForm/Custom/CreationFormFields';
import {FileContentFields} from '@organisms/TestConfigurationForm/FileContentFields';
import {GitFormFields as GitCreationFormFields} from '@organisms/TestConfigurationForm/Git/CreationFormFields';
import {StringContentFields} from '@organisms/TestConfigurationForm/StringContentFields';
import {Props, SourceFields, SourceType, getAdditionalFieldsComponent} from '@organisms/TestConfigurationForm/utils';

import {useAddTestMutation} from '@services/tests';

import {remapExecutors} from '@utils/executors';
import {k8sResourceNameMaxLength, k8sResourceNamePattern, required} from '@utils/form';
import {
  getCustomSourceField,
  getSourceFieldValue,
  getSourcePayload,
  remapTestSources,
  testSourceBaseOptions,
} from '@utils/sources';

import {LabelsWrapper, StyledFormSpace} from './CreationModal.styled';

type TestCreationFormValues = {
  name: string;
  testType: string;
  testSource: string;
  labels: Option[];
};

type TestCreationFormProps = {
  form: FormInstance<TestCreationFormValues>;
  onSuccess: (res: RTKResponse<MetadataResponse<Test>>) => void;
  testSources: SourceWithRepository[];
  executors: Executor[];
};

const additionalFields: SourceFields = {
  git: GitCreationFormFields,
  'file-uri': FileContentFields,
  custom: CustomCreationFormFields,
  string: StringContentFields,
};

export const TestCreationForm: FC<TestCreationFormProps> = props => {
  const {form, testSources, executors, onSuccess} = props;

  const remappedExecutors = remapExecutors(executors);
  const remappedCustomTestSources = remapTestSources(testSources);

  const [localLabels, setLocalLabels] = useState<readonly Option[]>([]);
  const [error, setError] = useState<ErrorNotificationConfig | undefined>(undefined);

  const [addTest, {isLoading}] = useAddTestMutation();

  const topRef = useRef<HTMLDivElement>(null);
  const inTopInViewport = useInViewport(topRef);

  const onSave = (values: TestCreationFormValues) => {
    const {testSource, testType} = values;

    const requestBody = {
      name: values.name,
      type: testType,
      labels: decomposeLabels(localLabels),
      content: getSourcePayload(values, testSources),
      ...getCustomSourceField(testSource),
    };

    addTest(requestBody)
      .then(res => {
        return onSuccess(res);
      })
      .catch(err => {
        setError(err);

        if (!inTopInViewport && topRef && topRef.current) {
          topRef.current.scrollIntoView();
        }
      });
  };

  const selectedExecutor = useMemo(() => {
    return executors.find((executor: Executor) => executor.executor?.types?.includes(form.getFieldValue('testType')));
  }, [form.getFieldValue('testType')]);

  return (
    <Form form={form} layout="vertical" name="test-creation" onFinish={onSave} style={{flex: 1}} labelAlign="right">
      <div ref={topRef} />
      <StyledFormSpace size={24} direction="vertical">
        <Text className="regular big">Test details</Text>
        {error ? <NotificationContent status="failed" message={error.message} title={error.title} /> : null}
        <FormItem
          name="name"
          label="Name"
          rules={[required, k8sResourceNamePattern, k8sResourceNameMaxLength]}
          required
        >
          <Input placeholder="e.g.: my-test" />
        </FormItem>
        <FormItem name="testType" label="Type" rules={[required]} required>
          <Select placeholder="Select from available executors..." showSearch options={remappedExecutors} />
        </FormItem>
        <FormItem
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.testSource !== currentValues.testSource}
        >
          {() => {
            if (!selectedExecutor) {
              return null;
            }

            const options = [
              ...remappedCustomTestSources,
              ...testSourceBaseOptions.filter(
                option =>
                  selectedExecutor.executor?.contentTypes?.includes(String(option.value)) ||
                  !selectedExecutor.executor?.contentTypes?.length
              ),
            ];

            return (
              <FormItem rules={[required]} label="Source" name="testSource" required>
                <Select placeholder="Select a source..." options={options} showSearch />
              </FormItem>
            );
          }}
        </FormItem>
        <FormItem
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.testSource !== currentValues.testSource}
        >
          {({getFieldValue}) => {
            const testSourceValue = getSourceFieldValue(getFieldValue);

            if (!testSourceValue) {
              return null;
            }

            const executorType = selectedExecutor?.executor.meta?.iconURI || 'unknown';

            const childrenProps: Record<SourceType, Partial<Props>> = {
              git: {executorType, getFieldValue},
              custom: {executorType},
              string: {executorType},
              'file-uri': {},
            };

            return getAdditionalFieldsComponent(testSourceValue, additionalFields, childrenProps[testSourceValue]);
          }}
        </FormItem>
        <FormItem
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.testSource !== currentValues.testSource}
        >
          {({getFieldValue}) => {
            const testSourceValue: string = getFieldValue('testSource');

            if (!testSourceValue) {
              return null;
            }

            return (
              <FormItem label="Labels" name="labels">
                <LabelsWrapper>
                  <LabelsSelect onChange={setLocalLabels} menuPlacement="top" />
                </LabelsWrapper>
              </FormItem>
            );
          }}
        </FormItem>
        <FormItem shouldUpdate>
          {({isFieldsTouched}) => (
            <Button
              htmlType="submit"
              loading={isLoading}
              data-test="add-a-new-test-create-button"
              disabled={isLoading || !isFieldsTouched()}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          )}
        </FormItem>
      </StyledFormSpace>
    </Form>
  );
};
