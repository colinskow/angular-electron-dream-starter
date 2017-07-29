import {
  Component,
  OnInit
} from '@angular/core';
import * as electron from 'electron';

import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { HomeState } from './home.reducer';
import * as fromHome from './home.actions';
import { Title } from './title';
import { XLargeDirective } from './x-large';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  // TypeScript public modifiers
  constructor(
    private store: Store<AppState>,
    public title: Title
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.store.dispatch(new fromHome.SetValueAction(value));
    this.localState.value = '';
  }

  public showDialog() {
    electron.ipcRenderer.send('show-dialog');
  }
}
