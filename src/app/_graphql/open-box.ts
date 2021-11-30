import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';

export interface OpenBoxInput {
  boxId: string;
  amount: number;
}

export interface Variables {
  input: OpenBoxInput;
}

export interface Response {
  openBox: {
    boxOpenings: {
      id: string;
      itemVariant: {
        id: string;
        name: string;
        value: number;
        iconUrl: string;
      };
    }[];
  };
}

@Injectable({ providedIn: 'root' })
export class OpenBoxGQL extends Mutation<Response, Variables> {
  document = gql`
    mutation OpenBox($input: OpenBoxInput!) {
      openBox(input: $input) {
        boxOpenings {
          id
          itemVariant {
            id
            name
            value
            iconUrl
          }
        }
      }
    }
  `;
}
