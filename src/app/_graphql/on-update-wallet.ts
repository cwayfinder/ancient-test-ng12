import { Injectable } from '@angular/core';
import { gql, Subscription } from 'apollo-angular';

const onUpdateWalletSubscription = gql`
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

@Injectable({ providedIn: 'root' })
export class OnUpdateWalletGQL extends Subscription {
  document = onUpdateWalletSubscription;
}
