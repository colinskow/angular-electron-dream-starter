import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import rxIpc from 'rx-ipc-electron/lib/renderer';
import * as homeActions from './home.actions';
import * as fromHome from './home.reducer';

@Injectable()
export class HomeEffects {

  @Effect()
  public computeValue$: Observable<Action> = this.actions$
    .ofType(homeActions.ADD_COMPUTE_VALUE)
    .map((action: homeActions.AddComputeValue) => action.payload)
    .switchMap((payload) =>
      rxIpc.runCommand('listen-effect', null, payload)
      .mergeMap((val: number) => of(new homeActions.ValueComputed(val)))
    );

  constructor(private actions$: Actions, private store: Store<fromHome.HomeState>) {}
}
