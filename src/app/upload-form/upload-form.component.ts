import { Component, OnInit } from '@angular/core';
import {UploadService} from '../service/upload.service';
import {Upload} from '../utils/upload';
import * as _ from 'lodash';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {

  selectedFiles: FileList;
  currentUpload: Upload;
  uploads: Array<Upload> = new Array<Upload>();

  constructor(private upSvc: UploadService) { }

  uploadSingle(event) {
    this.selectedFiles = event.files;
    const file = this.selectedFiles[0];
    this.currentUpload = new Upload(file);
    this.uploads.push(this.currentUpload);
    this.upSvc.pushUpload(this.currentUpload);
  }

  uploadMulti(event) {
    const files = event.files;
    const filesIndex = _.range(files.length);
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(files[idx]);
      this.uploads.push(this.currentUpload);
      this.upSvc.pushUpload(this.currentUpload);
    });
  }

  ngOnInit(): void {
  }

}
