import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the FirebaseDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseDbProvider {
  
  
  markerArray: any[] = [];

  constructor(
    public afDB: AngularFireDatabase, 
    public auth: AuthProvider
  ) {
    console.log('Hello FirebaseDbProvider Provider');
  }

  saveUser(user){
    return this.afDB.database.ref('users/'+this.auth.getUser()).set(user)
  }

  saveMarker(marker){
    
    const db = firebase.database().ref();
    const userId = firebase.auth().currentUser.uid;
    console.log(userId);
    const userKey = db.child('users').push().key;
    const markerKey = db.child('markers').push().key;

    marker.id = markerKey;

    const newData = {
      [`UsersToMarkers/${userId}/markerKeys/${markerKey}`]: true,
      [`markers/${markerKey}`]: marker,

    };

    return db.update(newData);
  
  }
  getMarkers(){

      
  return Observable.create(subscriber => {
    const ref = firebase.database().ref('markers');

    const callbackFn = ref.on('value',
      // emit a value from the Observable when firebase data changes
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          this.markerArray.push(childSnapshot.val());
        });
        subscriber.next.this.markerArray;
      },

      // error out the Observable if there is an error
      // such as permission denied
      error => subscriber.error(error)
    );

    // The function passed to Observable.create can return a callback function
    // which will be called when the observable we created is unsubscribed from.
    // Just as we used `ref.on()` previously our callback function calls `ref.off`
    // to tell firebase that we are no longer interested in the changes
    return () => ref.off('value', callbackFn);
    });
  }

  updateUser(user){
    console.log(user);
    var userUid = this.auth.getUser();
    
     return this.afDB.database.ref('users/'+ userUid).set(user)
    
  }

}
