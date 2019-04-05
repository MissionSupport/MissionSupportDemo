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

  countries: Country[];
  selectedCountry: Country;
  countrySub: Subscription;
  names: any[] = [];

  constructor(db: AngularFirestore, public router: Router, private sharedService: SharedService) {
    this.countrySub = db.collection<Country>('countries').valueChanges()
      .subscribe(ctries => this.countries = ctries);

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
              return e.properties.GU_A3;
            })
            .on('click', this.region_clicked);
      });
    // console.log(this.names);
  }

  region_clicked(e) {
    d3.select('.country_highlighted').style('fill', 'black');
    d3.select('.country_highlighted').classed('country_highlighted', false);
    d3.select('#' + e.properties.GU_A3).style('fill', 'red');
    d3.select('#' + e.properties.GU_A3).classed('country_highlighted', true);
  }

  countryClick(): void {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate(['country/' + this.selectedCountry.id]);
  }
}
