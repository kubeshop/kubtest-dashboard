import type {EntityMap} from './entityMap';
import type {Execution, ExecutionRequest, ExecutionStatusEnum} from './execution';
import type {Repository} from './repository';
import type {Variables} from './variable';

export type TestContentTypeEnum = 'file-uri' | 'git-file' | 'git-dir' | 'string';

export type TestContent = {
  type: TestContentTypeEnum;
  repository: Repository;
  data: string;
  uri: string;
};

export type LatestExecution = {
  id: string;
  number: number;
  startTime: string;
  endTime: string;
  status: ExecutionStatusEnum;
};

export type Test = {
  name: string;
  namespace: string;
  type: string;
  content: TestContent;
  created: string;
  labels: EntityMap;
  schedule: string;
  params: EntityMap;
  variables?: Variables;
  executorArgs?: string[];
  executionRequest: ExecutionRequest;
  status?: {
    latestExecution?: LatestExecution;
  };
  source: string;
};

export type TestWithExecution = {
  test: Test;
  latestExecution?: Execution;
};

export type TestFilters = {
  textSearch: string;
  type: string;
  pageSize: number;
  page: number;
  selector: string[];
  createdAt: null;
  status: Array<string>;
};

export type TestForTrigger = {
  name: Test['name'];
  namespace: Test['namespace'];
  type: Test['type'];
};

export type TestSuiteStepTest = {
  name: Test['name'];
  namespace: Test['namespace'];
  type?: Test['type'];
};
