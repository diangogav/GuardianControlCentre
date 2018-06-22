import { Component } from '@angular/core';

import { AddclosurePage } from '../addclosure/addclosure';
import { HomePage } from '../home/home';
import { RcusersPage } from '../rcusers/rcusers';
import { SettingsPage } from '../settings/settings';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = RcusersPage;
  tab3Root = AddclosurePage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
