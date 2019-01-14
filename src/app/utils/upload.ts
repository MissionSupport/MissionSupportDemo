import {Observable} from 'rxjs';

export class Upload {

  $key: string;
  file: File;
  name: string;
  url: string;
  progress: Observable<number>;
  createdAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}
