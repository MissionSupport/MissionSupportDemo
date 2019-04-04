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
  country: Country;
  countries: Country[];
  countriesObservable: Observable<Country[]>;

  selectedSite: Site;
  filterSites: Site[];

  unsubscribeSubject: Subject<void> = new Subject<void>();

  constructor(db: AngularFirestore, public router: Router, private sharedService: SharedService) {
    this.sharedService.hideToolbar.emit(false);
    this.sharedService.canEdit.emit(false);
    this.countriesObservable = db.collection<Country>(`countries`).valueChanges();
    this.countriesObservable.pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((countries: Country[]) => {
        this.countries = countries;
        countries.forEach((country: Country) => {
          this.sitesObservable = db.collection<Site>(`countries/${country.id}/sites`).valueChanges();

          this.sitesObservable.pipe(takeUntil(this.unsubscribeSubject))
            .subscribe((sites: Site[]) => this.sites = sites);
        });
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  siteClick(): void {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate([`country/${this.selectedSite.countryID}/site/${this.selectedSite.id}`]);
  }

  filterSite(event): void {
    const query = event.query;

    this.filterSites = this.sites.filter((site) =>
      site.siteName.toLowerCase().startsWith(query.toLowerCase()));
  }
}
