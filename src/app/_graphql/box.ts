import { gql } from 'apollo-angular';
import { QueryArgs } from '../_decorators/base';
import { routeParamSelector } from '../_state/router/selectors';

export interface Box {
  id: string;
  name: string;
  iconUrl: string;
  cost: number;
}

export interface BoxQueryResponseData {
  box: Box;
}

export interface Variables {
  id: string;
}

export const boxQuery = gql`
  query Box($id: ID!) {
    box(id: $id) {
      id
      name
      iconUrl
      cost
      levelRequired
    }
  }
`;

export const box: QueryArgs<BoxQueryResponseData, Variables, Box> = {
  query: boxQuery,
  variables: {
    id: routeParamSelector('boxId'),
  },
  projector: (data) => data.box,
};

