import { OperationVariables } from '@apollo/client/core/types';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Selector } from '@ngrx/store';

export interface QueryArgs<TData = any, TVariables = OperationVariables, TProjectedData = TData> {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables: { [Name in keyof TVariables]: TVariables[Name] | Selector<any, TVariables[Name]> };
  projector?: (data: TData) => TProjectedData;
}

export interface MutationArgs<TData = any, TVariables = OperationVariables, TProjectedData = TData> {
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables: TVariables;
  // projector?: (data: TData) => TProjectedData;
}

export interface DataErrorEvent {
  type: 'error',
  field: string;
  error: any;
}

export interface DataSuccessEvent {
  type: 'success',
  field: string;
  data: any;
}

export interface DataLoadingEvent {
  type: 'loading',
  field: string;
  value: boolean;
}

export type DataEvent = DataSuccessEvent | DataErrorEvent | DataLoadingEvent;
