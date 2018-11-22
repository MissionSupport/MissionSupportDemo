import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  id: string;
  markdown: string;

  sites: Observable<{}[]>;
  site: {};
  siteCollection: AngularFirestoreCollection;
  constructor(public route: ActivatedRoute, private readonly db: AngularFirestore) {
    this.id = this.route.snapshot.paramMap.get('id');
    // Now we are going to get the latest version of markdown that is approved.
    this.siteCollection = this.db.collection('Sites/' + this.id + '/versions', ref => ref.where('current', '==', true));
    this.sites = this.siteCollection.valueChanges();
    this.sites.subscribe( item => {
      console.log(item);
      if (item.length >= 1) { // Is possible for more than one so we will just take the first.
        this.site = item[0] as any;
        this.markdown = this.site['markdown'];
      }
    });
  }

  ngOnInit() {
    console.log('id is ', this.id);
    console.log(this.sites);
  }

}
