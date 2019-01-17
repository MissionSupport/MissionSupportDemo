// globals.ts
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class Globals {
  toolHidden;
}

@Injectable()
export class SharedService {
  onMainEvent: EventEmitter<any> = new EventEmitter();
  onPageNav: EventEmitter<any> = new EventEmitter();
}
