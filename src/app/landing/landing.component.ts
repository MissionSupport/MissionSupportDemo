import {Component, OnInit, AfterContentInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
import {feature} from 'topojson/node_modules/topojson-client';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Site} from '../interfaces/site';
import {SharedService} from '../globals';
import {Country} from '../interfaces/country';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterContentInit, OnDestroy {
  width; // = window.innerWidth;
  height; // = window.innerHeight;
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

  constructor(private readonly db: AngularFirestore, public router: Router, private sharedService: SharedService) {

    this.countryCollection = db.collection<Country>('countries');
    const countries = this.countryCollection.valueChanges();
    countries.subscribe( item => {
      this.countries = item;
    });
    sharedService.hideToolbar.emit(false);
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
    this.svg = d3.select('#svgContainer').append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'map');
    // this.g = this.svg.append('g');
    // this.path = d3.geoPath().projection(this.projection);
    // this.path = d3.geoPath().projection(this.projection);
    // d3.select('p').style('color', 'red');

    d3.json('assets/countries.topo.json')
      .then((topology) => {
        // Code from your callback goes here...
          console.log(topology);

          // convert our topojson to geojson
          const states = feature(topology, topology.objects.countriess);

          // projection fn so we can fit geodata within svg's area
          const projection = d3.geoMercator().fitSize([this.width, this.height], states);

          // use projection fn with geoPath fn
          const path = d3.geoPath().projection(projection);

          console.log('hi');
          this.svg.append('g')
            .attr('class', 'states')
            .selectAll('path')
            .data(feature(topology, topology.objects.countriess).features)
            .enter().append('path')
            .attr('d', path)
            .attr('id', (e) => e.properties.SOV_A3)
            .on('click', this.region_clicked);

      });

    // d3.json('assets/countries.topo.json')
    //   .then((topology) => {
    //     // Code from your callback goes here...
    //     console.log('hello');
    //     this.g.append('g')
    //       .attr('id', 'countries')
    //       .selectAll('path')
    //       .data(feature(topology, topology.objects.countries).features)
    //       .enter()
    //       .append('path')
    //       .attr('id', function (d) {
    //         return d.id;
    //       })
    //       // firestore - this.get country determines color and when selecting what country to queary yo
    //       // .attr('d', i => {
    //       //   // this.projection = this.projection = d3.geoMercator().fitSize([this.width, this.height], topology);
    //       //   // this.path =  d3.geoPath().projection(this.projection);
    //       //   // console.log(this.path);
    //       //   return this.path;
    //       // })
    //       .attr('d', this.path)
    //       .on('click', this.region_clicked);
    //   });
  }
  region_clicked(e) {
    console.log(e.properties.FORMAL_EN);
    d3.select('.country_highlighted').style('fill', 'black');
    d3.select('.country_highlighted').classed('country_highlighted', false);
    d3.select('#' + e.properties.SOV_A3).style('fill', 'red');
    d3.select('#' + e.properties.SOV_A3).classed('country_highlighted', true);
  }

  countryClick(): void {
    // console.log(this.selectedSite);
    this.router.navigate(['country/' + this.selectedCountry.id]);
    // this.router.navigate(['/temp']);
  }
}
