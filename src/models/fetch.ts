import {SerializedError} from '@reduxjs/toolkit';
import {FetchBaseQueryError} from '@reduxjs/toolkit/dist/query';

export type RTKResponse<T> =
  | {
      data: T;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

export type MetadataResponse<Meta = {}> = {
  metadata: Meta;
  spec?: Meta;
};

export type YamlEditBody = {
  name: string;
  value: string;
};

export type Headers = Record<string, string>;
