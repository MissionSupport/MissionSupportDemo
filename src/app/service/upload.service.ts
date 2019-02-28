import { Injectable } from '@angular/core';
import {Upload} from '../utils/upload';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private db: AngularFireDatabase, private authInstance: AngularFireAuth, private storage: AngularFireStorage) { }

  private basePath = '/uploads' ;

  pushUpload(upload: Upload) {
    const storageRef = this.storage.ref(this.basePath);
    const uploadTask = storageRef.child(`${this.authInstance.auth.currentUser.uid}/${upload.file.name}`).put(upload.file);
    upload.progress = uploadTask.percentageChanges();
    upload.name = upload.file.name;
  }

  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
  }
}
