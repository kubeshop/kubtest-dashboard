import {StateCreator} from 'zustand';

import {Entity} from '@models/entity';
import {Metrics} from '@models/metrics';

import {connectStore, createStoreFactory} from '@store/utils';

export interface EntityDetailsSlice {
  entity: Entity;
  isFirstTimeLoading: boolean;
  id?: string;
  execId?: string;
  executions: any;
  details: any;
  metrics?: Metrics;
  daysFilterValue: number;
  currentPage: number;
  openExecutionDetails: (id: string) => void;
  closeExecutionDetails: () => void;
}

const createEntityDetailsSlice: StateCreator<EntityDetailsSlice> = set => ({
  entity: 'tests',
  isFirstTimeLoading: true,
  id: undefined,
  execId: undefined,
  executions: undefined,
  details: undefined,
  metrics: undefined,
  daysFilterValue: 7,
  currentPage: 1,
  openExecutionDetails: () => {},
  closeExecutionDetails: () => {},
});

const createEntityDetailsStore = createStoreFactory('entityDetails', createEntityDetailsSlice);
export const {
  use: useEntityDetails,
  useField: useEntityDetailsField,
  pick: useEntityDetailsPick,
  sync: useEntityDetailsSync,
  init: initializeEntityDetailsStore,
} = connectStore(createEntityDetailsStore);