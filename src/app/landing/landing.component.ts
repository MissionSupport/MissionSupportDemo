import {Component, OnInit, AfterContentInit, OnDestroy} from '@angular/core';
import * as d3 from 'd3';
import {feature} from 'topojson';
import {FeatureCollection} from 'geojson';
// import {feature} from 'topojson/node_modules/topojson-client';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {SharedService} from '../globals';
import {Country} from '../interfaces/country';
import { drag } from 'd3-drag';
import { Topology } from 'topojson-specification';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterContentInit, OnDestroy {
  width; // = window.innerWidth;
  height; // = window.innerHeight;
  minx = 0;
  miny = 0;
  centered;
  country;
  projection; // = d3.geoMercator().translate([this.width / 2.2, this.height / 1.5]);
  projection2 = d3.geoMercator();
  plane_path = d3.geoPath().projection(this.projection);
  svg;
  path;
  g;
  // countries: Observable<Country[]>;
  countries: Country[];
  selectedCountry: Country;
  countryCollection: AngularFirestoreCollection<Country>;

  constructor(db: AngularFirestore, public router: Router, sharedService: SharedService) {
    this.countryCollection = db.collection<Country>('countries');
    const countries = this.countryCollection.valueChanges();
    countries.subscribe( item => {
      this.countries = item;
    });
    sharedService.hideToolbar.emit(false);
    sharedService.canEdit.emit(false);
    sharedService.onPageNav.emit('Country Selection');

  }
  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngAfterContentInit() {
    this.width = document.getElementById('svgContainer').clientWidth;
    this.height = document.getElementById('svgContainer').clientHeight;

    // this.projection = d3.geoMercator().translate([this.width / 2.2, this.height / 1.5]);
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
        .on('start', () => {
          d3.select('.map').style('cursor', 'grabbing');
        })
        .on('drag', () => {
          this.minx += d3.event.dx;
          this.miny += d3.event.dy;
          d3.select('.map').attr('viewBox', `${this.minx} ${this.miny} ${this.width} ${this.height}`);
        })
        .on('end', () => {
          d3.select('.map').style('cursor', 'auto');
        }));

    d3.json('assets/countries.topo.json')
      .then((topology: Topology) => {
          // projection fn so we can fit geodata within svg's area
          const projection = d3.geoMercator().scale(200).translate([this.width / 2, this.height / 1.2]);

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
            .attr('id', (e) => e.properties.GU_A3)
            .on('click', this.region_clicked);
      });
  }

  region_clicked(e) {
    console.log(e.properties.FORMAL_EN);
    d3.select('.country_highlighted').style('fill', 'black');
    d3.select('.country_highlighted').classed('country_highlighted', false);
    d3.select('#' + e.properties.GU_A3).style('fill', 'red');
    d3.select('#' + e.properties.GU_A3).classed('country_highlighted', true);
  }

  countryClick(): void {
    // console.log(this.selectedSite);
    this.router.navigate(['country/' + this.selectedCountry.id]);
    // this.router.navigate(['/temp']);
  }
}
