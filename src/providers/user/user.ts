import { Injectable } from '@angular/core';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  userData: any;
  constructor() {
    console.log('Hello UserProvider Provider');
  }

  saveUserData(userData){
    
  }

}
