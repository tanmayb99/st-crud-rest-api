import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div class="page-wrapper"><router-outlet></router-outlet></div>`
})

export class AppComponent {
  title = 'angular-crud';
}
