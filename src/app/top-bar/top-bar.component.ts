import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ɵmarkDirty as markDirty } from '@angular/core';
import { CurrentUserGQL } from '../_graphql/current-user';
import { OnUpdateWalletGQL } from '../_graphql/on-update-wallet';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent implements OnInit, OnDestroy {
  loading = false;
  user$!: Observable<{ name: string; balance: number } | null>;

  private subscription?: Subscription;

  constructor(private currentUserGQL: CurrentUserGQL, private onUpdateWalletGQL: OnUpdateWalletGQL) {}

  ngOnInit() {
    this.loading = true;
    this.user$ = this.currentUserGQL.watch().valueChanges.pipe(
      tap(() => (this.loading = false)),
      map(result => {
        markDirty(this);

        const currentUser = result.data.currentUser;
        if (!currentUser) {
          return null;
        }

        return {
          name: currentUser.name,
          balance: currentUser.wallets[0].amount,
        };
      }),
    );

    this.subscription = this.onUpdateWalletGQL.subscribe().subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
