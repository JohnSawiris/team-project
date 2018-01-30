import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { masterFirebaseConfig } from '../api-keys';
import { UserProfile } from './user.model';

@Injectable()
export class UserProfileListService {

  profiles: FirebaseListObservable<any[]>;

  constructor(private database: AngularFireDatabase) {
    this.profiles = database.list('userProfiles');
  }

  getProfiles(){
    console.log(this.profiles);
    return this.profiles
  }

  getProfilesById(profileId: string){
    return this.database.object('userProfiles/' + profileId);
  }
}