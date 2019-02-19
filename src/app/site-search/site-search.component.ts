import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Site} from '../interfaces/site';
import {Country} from '../interfaces/country';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {SharedService} from '../globals';

@Component({
  selector: 'app-site-search',
  templateUrl: './site-search.component.html',
  styleUrls: ['./site-search.component.css']
})
export class SiteSearchComponent implements OnInit, OnDestroy {

  site: Site;
  sites: Site[];
  sitesObservable: Observable<Site[]>;
  siteSubArray: Subscription[];
  country: Country;
  countries: Country[];
  countriesObservable: Observable<Country[]>;
  countrySub: Subscription;

  selectedSite: Site;
  filterSites: Site[];

  constructor(private readonly db: AngularFirestore, public router: Router, private sharedService: SharedService) {
    sharedService.hideToolbar.emit(false);
    sharedService.canEdit.emit(false);
    sharedService.onPageNav.emit('Site Selection');
    this.sites = [];
    this.countries = [];
    this.siteSubArray = [];
    this.countriesObservable = db.collection<Country>(`countries`).valueChanges();
    this.countrySub = this.countriesObservable.subscribe( (countries: Country[]) => {
      countries.forEach( (country: Country) => {
        this.country = country;
        this.countries = [...this.countries, country];
        this.sitesObservable = db.collection<Site>(`countries/${country.id}/sites`).valueChanges();
        let siteSub: Subscription;
        siteSub = this.sitesObservable.subscribe( (sites: Site[]) => {
          sites.forEach( (site: Site) => {
            this.site = site;
            this.sites = [...this.sites, site];
            // console.log(site);
          });
        });
        this.siteSubArray = [...this.siteSubArray, siteSub];
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.countrySub) {
      this.countrySub.unsubscribe();
    }
    let sub: Subscription;
    for (sub of this.siteSubArray) {
      sub.unsubscribe();
    }
  }

  siteClick(): void {
    this.router.navigate([`country/${this.selectedSite.countryID}/site/${this.selectedSite.id}`]);
  }

  filterSite(event): void {
    const query = event.query;
    let filtered: Site[] = [];
    for (let i = 0; i < this.sites.length; i++) {
      const site: Site = this.sites[i];
      if (site.siteName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered = [...filtered, site];
      }
    }
    this.filterSites = filtered;
  }

}
