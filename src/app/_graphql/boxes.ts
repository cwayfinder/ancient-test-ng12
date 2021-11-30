import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';

export interface Box {
  id: string;
  name: string;
  iconUrl: string;
  cost: number;
  levelRequired: number;
}

export interface Response {
  boxes: {
    edges: {
      node: Box;
    }[];
  };
}

@Injectable({ providedIn: 'root' })
export class BoxesGQL extends Query<Response> {
  document = gql`
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
}
