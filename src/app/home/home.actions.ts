import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';

export const SET_VALUE = '[Home] Set Value';
export const ADD_COMPUTE_VALUE = '[Home] Add Compute Value';
export const VALUE_COMPUTED = '[Home] Value Computed';

export class SetValue implements Action {
  public readonly type = SET_VALUE;

  constructor(public payload: string) { }
}

export class AddComputeValue implements Action {
  public readonly type = ADD_COMPUTE_VALUE;

  constructor(public payload: number) { }
}

export class ValueComputed implements Action {
  public readonly type = VALUE_COMPUTED;

  constructor(public payload: number) { }
}

export type Actions = SetValue | AddComputeValue | ValueComputed;
