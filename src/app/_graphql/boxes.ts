import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { QueryArgs } from '../_decorators/base';

export interface Box {
  id: string;
  name: string;
  iconUrl: string;
  cost: number;
  levelRequired: number;
}

export interface BoxesQueryResponseData {
  boxes: {
    edges: {
      node: Box;
    }[];
  };
}

export const boxesQuery = gql`
    query Boxes {
      boxes(openable: true) {
        edges {
          node {
            id
            name
            iconUrl
            cost
            levelRequired
          }
        }
      }
    }
  `;

export const boxes: QueryArgs<BoxesQueryResponseData, any, Box[]> = {
  query: boxesQuery,
  variables: {},
  projector: (data) => data.boxes.edges.map(edge => edge.node),
};
