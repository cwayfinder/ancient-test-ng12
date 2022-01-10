import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../_state';
import { Actions } from '@ngrx/effects';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DecoratorsService {
  public static store: Store<AppState>;
  public static actions: Actions;
  public static apollo: Apollo;

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private apollo: Apollo,
  ) { }

  init(): void {
    DecoratorsService.store = this.store;
    DecoratorsService.actions = this.actions$;
    DecoratorsService.apollo = this.apollo;
  }
}
