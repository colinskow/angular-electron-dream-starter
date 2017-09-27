import {
  Component,
  OnInit
} from '@angular/core';
import { ipcRenderer } from 'electron';

import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { HomeState } from './home.reducer';
import * as home from './home.actions';
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
  public localState = { value: '', computeValue: '' };
  // TypeScript public modifiers
  constructor(
    private store: Store<AppState>,
    public title: Title
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(arg: any) {
    console.log('submitState', arg.value);
    this.store.dispatch(new home.SetValue(arg.value));
    if (this.localState.computeValue) {
      this.store.dispatch(new home.AddComputeValue(parseInt(arg.computeValue, 0)));
    }
    this.localState.value = '';
    this.localState.computeValue = '';
  }

  public showDialog() {
    ipcRenderer.send('show-dialog');
  }
}
