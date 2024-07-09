import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestorageService } from './firestorage.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private firestorage : FirestorageService) { }

  getUserImageUrl(uid: string): Observable<string> {
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map((data: any) => data.fotoPerfil)
    );
  }
}
