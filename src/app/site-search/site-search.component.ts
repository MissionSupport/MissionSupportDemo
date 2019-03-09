import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Site} from '../interfaces/site';
import {Country} from '../interfaces/country';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {SharedService} from '../service/shared-service.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-site-search',
  templateUrl: './site-search.component.html',
  styleUrls: ['./site-search.component.css']
})
export class SiteSearchComponent implements OnInit, OnDestroy {

  site: Site;
  sites: Site[];
  sitesObservable: Observable<Site[]>;
  // siteSubArray: Subscription[];
  country: Country;
  countries: Country[];
  countriesObservable: Observable<Country[]>;
  // countrySub: Subscription;

  selectedSite: Site;
  filterSites: Site[];

  unsubscribeSubject: Subject<void> = new Subject<void>();

  constructor(db: AngularFirestore, public router: Router, private sharedService: SharedService) {
    this.sharedService.hideToolbar.emit(false);
    this.sharedService.canEdit.emit(false);
    // sharedService.onPageNav.emit('Site Selection');
    // this.sites = [];
    // this.countries = [];
    // this.siteSubArray = [];
    this.countriesObservable = db.collection<Country>(`countries`).valueChanges();
    this.countriesObservable.pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((countries: Country[]) => {
        this.countries = countries;
        countries.forEach((country: Country) => {
          // this.country = country;
          // this.countries = [...this.countries, country];
          this.sitesObservable = db.collection<Site>(`countries/${country.id}/sites`).valueChanges();

          // let siteSub: Subscription;
          this.sitesObservable.pipe(takeUntil(this.unsubscribeSubject))
            .subscribe((sites: Site[]) => this.sites = sites);
          // sites.forEach((site: Site) => {
          //   // this.site = site;
          //   this.sites = [...this.sites, site];
          //   // console.log(site);
          // });
        });
        // this.siteSubArray = [...this.siteSubArray, siteSub];
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // if (this.countrySub) {
    //   this.countrySub.unsubscribe();
    // }
    // let sub: Subscription;
    // for (sub of this.siteSubArray) {
    //   sub.unsubscribe();
    // }
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  siteClick(): void {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate([`country/${this.selectedSite.countryID}/site/${this.selectedSite.id}`]);
  }

  filterSite(event): void {
    const query = event.query;
    // let filtered: Site[] = [];

    this.filterSites = this.sites.filter((site) =>
      site.siteName.toLowerCase().startsWith(query.toLowerCase()));

    // for (let i = 0; i < this.sites.length; i++) {
    //   const site: Site = this.sites[i];
    //   if (site.siteName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
    //     filtered = [...filtered, site];
    //   }
    // }
    // this.filterSites = filtered;
  }

}
