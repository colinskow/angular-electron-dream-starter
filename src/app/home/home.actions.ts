import { Action } from '@ngrx/store';

export const SET_VALUE = '[Home] Set Value';

export class SetValueAction implements Action {
  public readonly type = SET_VALUE;
  constructor(public payload: string) { }
}

// export type as all actions for typing action in reducer.
export type Actions = SetValueAction;
