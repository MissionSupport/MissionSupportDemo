import {Component, OnInit, AfterContentInit, OnDestroy} from '@angular/core';
import * as d3 from 'd3';
import {feature} from 'topojson';
import {FeatureCollection} from 'geojson';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {SharedService} from '../service/shared-service.service';
import {Country} from '../interfaces/country';
import { drag } from 'd3-drag';
import { Topology } from 'topojson-specification';
import {Subscription} from 'rxjs';
import {Site} from '../interfaces/site';
import {CountryPageComponent} from '../country-page/country-page.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterContentInit, OnDestroy {
  width = 1024;
  height = 600;
  minx = 0;
  miny = 0;
  scaleFactor = 200;
  svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;

  countries: Country[] = [];
  selectedCountry: Country;
  countrySub: Subscription;
  names: any[] = [];
  navDialog: Boolean = false;
  navCountry: Country = null;
  navSites: Site[] = [];
  siteSub: Subscription;

  constructor(private db: AngularFirestore, public router: Router, private sharedService: SharedService) {
    // Filter is used to list only those countries which have at least one site created
    this.countrySub = db.collection<Country>('countries').valueChanges()
      .subscribe(ctries => this.countries = ctries.filter(c => c.current));

    this.sharedService.hideToolbar.emit(false);
    this.sharedService.canEdit.emit(false);
    this.sharedService.onPageNav.emit('Country Selection');
    this.sharedService.scrollPanelHeightToSubtract.emit(50);

  }
  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.countrySub) {
      this.countrySub.unsubscribe();
    }
    if (this.siteSub) {
      this.siteSub.unsubscribe();
    }
  }

  ngAfterContentInit() {
    this.svg = d3.select('#svgContainer')
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('viewBox', `${this.minx} ${this.miny} ${this.width} ${this.height}`)
      .attr('class', 'map')
      .style('display', 'inline-block')
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('height', '100%')
      .style('width', '100%')
      .call(drag()
        .on('start', () => d3.select('.map').style('cursor', 'grabbing'))
        .on('drag', () => {
          this.minx -= d3.event.dx;
          this.miny -= d3.event.dy;
          d3.select('.map').attr('viewBox', `${this.minx} ${this.miny} ${this.width} ${this.height}`);
        })
        .on('end', () => d3.select('.map').style('cursor', 'auto'))
      );

    d3.json('assets/countries.topo.json')
      .then((topology: Topology) => {
          // projection fn so we can fit geodata within svg's area
          const projection = d3.geoMercator().scale(this.scaleFactor)
            .translate([this.width / 2, this.height / 1.2]);

          // use projection fn with geoPath fn
          const path = d3.geoPath().projection(projection);

          this.svg.append('g')
            .attr('class', 'states')
            .selectAll('path')
            .data((feature(topology, topology.objects.countriess) as FeatureCollection).features)
            .enter().append('path')
            .attr('d', path)
            .style('stroke', 'white')
            .style('stroke-width', '1px')
            .attr('id', (e) => {
              // this.names.push(e.properties.NAME_EN);
              // console.log(e.properties.NAME_EN);

              // this.db.collection('countries').doc(e.properties.GU_A3).set({
              //   countryName: e.properties.NAME_EN,
              //   id: e.properties.GU_A3,
              // }, {merge: true}).then(() => {
              //   console.log("satisfied: ", e.properties.GU_A3);
              // }, (err) => {
              //   console.log("failed with error: ", err);
              // });
              return e.properties.GU_A3;
            })
            .on('click', this.region_clicked);
      });
    // console.log(this.names);
  }

  region_clicked = (e) => {
    d3.select('.country_highlighted').style('fill', 'black');
    d3.select('.country_highlighted').classed('country_highlighted', false);
    d3.select('#' + e.properties.GU_A3).style('fill', 'red');
    d3.select('#' + e.properties.GU_A3).classed('country_highlighted', true);
    const countryName = e.properties.NAME_EN;
    const countryID = e.properties.GU_A3;
    // console.log(this.countries);
    for (const country of this.countries ) {
      // console.log(country);
      if ((country.countryName === countryName) && (country.id === countryID)) {
        // console.log(countryName);
        this.siteSub = this.db.collection<Site>(`sites`).valueChanges().subscribe((sites: Site[]) => {
          // console.log(sites);
          sites.forEach((site: Site) => {
            let alreadyIn = false;
            for (const siteInst of this.navSites) {
              if (siteInst.siteName === site.siteName) {
                alreadyIn = true;
                break;
              }
            }
            if ((site.countryID === countryID) && !(alreadyIn)) {
              console.log(site);
              console.log(this.navSites);
              this.navSites = [...this.navSites, site];
            }
          });
        });
        // console.log(this.navSites);
        this.navCountry = country;
        this.navDialog = true;
        break;
      }
    }
  }

  mapNavCountry(country) {
    this.router.navigateByUrl(`country/${country.id}`).catch(err => {
      console.log(err);
    });
  }

  mapNavSite(site) {
    this.router.navigateByUrl(`country/${this.navCountry.id}/site/${site.id}`).catch(err => {
      console.log(err);
    });
  }

  countryClick(): void {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate(['country/' + this.selectedCountry.id]);
  }

  mouseEnter(event, c) {
    console.log(event, c);
  }

}
