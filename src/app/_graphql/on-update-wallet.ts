import { Injectable } from '@angular/core';
import { gql, Subscription } from 'apollo-angular';

@Injectable({ providedIn: 'root' })
export class OnUpdateWalletGQL extends Subscription {
  document = gql`
    subscription OnUpdateWallet {
      updateWallet {
        wallet {
          id
          amount
          name
        }
      }
    }
  `;
}
