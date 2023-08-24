import {useContext} from 'react';

import {satisfies as matchesVersion} from 'semver';

import {MainContext} from '@contexts/MainContext';

export const useClusterVersionMatch = <T>(match: string, defaults?: T): boolean | T => {
  const {clusterVersion} = useContext(MainContext);
  return clusterVersion == null ? (defaults as T) : matchesVersion(clusterVersion, match);
};
