import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { map, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DrugsService {

  constructor() { }

  searchDrug(searchTerm: string): Observable<any[]> {
    const url = `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${searchTerm.trim()}&ef=STRENGTHS_AND_FORMS&maxList=`;

    return ajax(url).pipe(
      map((response: AjaxResponse) => response.response),
      catchError((err) => { throw err; }),
      take(1)
    );
  }
}
