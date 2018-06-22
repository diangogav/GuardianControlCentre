import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RcusersPage } from './rcusers';

@NgModule({
  declarations: [
    RcusersPage,
  ],
  imports: [
    IonicPageModule.forChild(RcusersPage),
  ],
})
export class RcusersPageModule {}
