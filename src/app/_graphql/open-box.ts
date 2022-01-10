import { gql } from 'apollo-angular';
import { MutationArgs } from '../_decorators/base';
import { Box, BoxQueryResponseData } from './box';
import { openBoxInputSelector } from '../_state/selectors';

export interface OpenBoxInput {
  boxId: string;
  amount: number;
}

export interface Variables {
  input: OpenBoxInput;
}

export interface OpenBoxMutationResponseData {
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

export const openBoxMutation = gql`
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

export const openBox: MutationArgs<BoxQueryResponseData, any, Box> = {
  mutation: openBoxMutation,
  variables: {
    input: openBoxInputSelector,
  },
  // projector: (data) => data.box,
};
