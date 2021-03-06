import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as firebase from "firebase";

import { AuthenticationService } from '../authentication.service';
import { UserProfile } from '../user.model';
import { UserProfileListService } from '../user-profile-list.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [
    AuthenticationService,
    UserProfileListService
  ]
})

export class UserProfileComponent implements OnInit {
  private user;
  public albumsInCollection;
  public albumsInWishlist;
  public profileId: string;
  public profileToDisplay;
  public toggle: boolean = false;

  constructor(
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private userProfileListService: UserProfileListService

  ) { }

  ngOnInit() {
    this.route.params.forEach((urlParameters) => {
      this.profileId = urlParameters['id'];
      this.userProfileListService.getProfiles().subscribe(profiles => {
        for(let profile of profiles) {
          if(profile.id === this.profileId) {
            this.profileToDisplay = profile;
          }
        }
        this.userProfileListService.getCollectionByUserKey(this.profileToDisplay.$key).subscribe(albums => {
          this.albumsInCollection = albums;
        });
        this.userProfileListService.getWishlistByUserKey(this.profileToDisplay.$key).subscribe(albums => {
          this.albumsInWishlist = albums;
        });
      });
    });
  }

  ngDoCheck() {
    this.user = firebase.auth().currentUser;
    if(this.user) {
      if(this.user.uid === this.profileId) {
        this.toggle = true;
      }
    } else {
      this.toggle = false;
    }
  }

  updateSubmit(profile){
    this.userProfileListService.updateProfile(profile);
  }

  deleteAlbumInCollection(userKey, albumKey) {
    this.userProfileListService.removeAlbumFromCollection(userKey, albumKey);
  }

  deleteAlbumInWishlist(userKey, albumKey) {
    this.userProfileListService.removeAlbumFromWishlist(userKey, albumKey);
  }

  moveToCollection(userKey, album) {
    this.userProfileListService.moveAlbumFromWishlistToCollection(userKey, album);
  }

  goToAlbumDetails(album) {
    this.router.navigate(['album-details', album.id]);
  }

}
