import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';

export interface Box {
  id: string;
  name: string;
  iconUrl: string;
  cost: number;
}

export interface Response {
  box: Box;
}

export interface Variables {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class BoxGQL extends Query<Response, Variables> {
  document = gql`
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
}
