import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(private fireStorage: AngularFireStorage) { 

  }

  downloadFile(path: string): Observable<string> {
    const storageRef = this.fireStorage.ref(path);
    return storageRef.getDownloadURL();
  }
}
