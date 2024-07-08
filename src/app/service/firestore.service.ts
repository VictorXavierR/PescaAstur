import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  getUserImageUrl(uid: string): Promise<string> {
    return this.firestore.collection('users').doc(uid).get().toPromise()
      .then(doc => {
        if (doc && doc.exists) {// Verifica si el documento existe
          const userData = doc.data() as any; // Asegúrate de especificar el tipo correcto de datos
          return userData.fotoPerfil ? userData.fotoPerfil : 'assets/images/avatar.png';
        }
      })
      .catch(error => {
        console.error('Error getting user image URL:', error);
        return 'assets/images/avatar.png'; // Otra imagen predeterminada en caso de error
      });
  }
}
