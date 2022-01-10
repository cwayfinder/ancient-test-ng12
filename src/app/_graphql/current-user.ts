import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';

export interface Wallet {
  id: string;
  name: string;
  amount: number;
}

export interface Response {
  currentUser: {
    id: string;
    name: string;
    wallets: Wallet[];
  };
}

export const currentUserQuery = gql`
  query CurrentUser {
    currentUser {
      id
      name
      wallets {
        id
        amount
        name
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class CurrentUserGQL extends Query<Response> {
  document = currentUserQuery;
}
