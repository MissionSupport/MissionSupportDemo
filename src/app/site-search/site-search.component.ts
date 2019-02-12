import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Site} from '../interfaces/site';
import {Country} from '../interfaces/country';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-site-search',
  templateUrl: './site-search.component.html',
  styleUrls: ['./site-search.component.css']
})
export class SiteSearchComponent implements OnInit {

  site: Site;
  sites: Site[];
  sitesObservable: Observable<Site[]>;
  country: Country;
  countries: Country[];
  countriesObservable: Observable<Country[]>;

  selectedSite: Site;
  selectedCountry: Country;

  constructor(private readonly db: AngularFirestore, public router: Router) {
    this.sites = [];
    this.countries = [];
    this.countriesObservable = db.collection<Country>(`countries`).valueChanges();
    this.countriesObservable.subscribe( (countries: Country[]) => {
      countries.forEach( (country: Country) => {
        this.country = country;
        this.countries = [...this.countries, country];
        console.log(country);
        this.sitesObservable = db.collection<Site>(`countries/${country.id}/sites`).valueChanges();
        this.sitesObservable.subscribe( (sites: Site[]) => {
          sites.forEach( (site: Site) => {
            this.site = site;
            this.sites = [...this.sites, site];
            console.log(site);
          });
        });
      });
    });
    // can't get it to work outside the loop since the db collection is async too rip
    // this.countries.forEach( (country: Country) => {
    //   this.sitesObservable = db.collection<Site>(`countries/${country.id}/sites`).valueChanges();
    //   this.sitesObservable.subscribe( (sites: Site[]) => {
    //     sites.forEach( (site: Site) => {
    //       this.site = site;
    //       this.sites.push(site);
    //       console.log(site);
    //     });
    //   });
    // });

    // Tried to use pipes/maps but i dunno what this black magic is
    // this.sites = [];
    // this.countries = [];
    // this.countriesObservable = db.collection<Country>(`countries`).valueChanges();
    // this.countriesObservable.pipe(map( (countries: Country[]) => {
    //   countries.forEach( (country: Country) => {
    //     this.countries.push(country);
    //   });
    // }));
    //
    // for (const country of this.countries) {
    //   this.country = country;
    //   this.sitesObservable = db.collection<Site>(`countries/${this.country.id}/sites`).valueChanges();
    //   this.sitesObservable.pipe(map( (sites: Site[]) => {
    //     sites.forEach( (site: Site) => {
    //       this.sites.push(site);
    //     });
    //   }));
    // }


  }

  ngOnInit() {


  }

  siteClick(): void {

    // creates a subscription in function so might cause data leaks if we remove this
    this.countries.forEach( (country: Country) => {
      this.db.collection<Site>(`countries/${country.id}/sites`).valueChanges().subscribe( (sites: Site[]) => {
        sites.forEach( (site: Site) => {
          if (site.id === this.selectedSite.id) {
            this.router.navigate([`country/${country.id}/site/${site.id}`]);
          }
        });
      });
    });
  }

}
