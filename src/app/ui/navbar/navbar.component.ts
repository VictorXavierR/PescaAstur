import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FirestoreService } from '../../service/firestore.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
isLoggedIn: boolean = false;
userImageUrl: string = 'assets/images/avatar.png';
constructor(private authService: AuthService, private firestoreService: FirestoreService) {
  // Verificar el estado de autenticación al inicializar el componente
  this.authService.getAuthState().subscribe(user => {
    if (user) {
      // Usuario autenticado, actualiza la imagen del usuario y marca como autenticado
      this.isLoggedIn = true;
      const uid = user.uid;
      this.loadUserImageUrl(uid);
    } else {
      // No hay usuario autenticado, restaura valores por defecto
      this.isLoggedIn = false;
      this.userImageUrl = 'assets/images/avatar.png';
    }
  });
}

logout(){
  this.authService.logout().then(() => {
    this.isLoggedIn = false;
    this.userImageUrl = 'assets/images/avatar.png';
  });
}

loadUserImageUrl(uid: string): void {
  this.firestoreService.getUserImageUrl(uid)
    .then(url => {
      this.userImageUrl = url;
      console.log('Imagen del usuario cargada:', url);
    })
    .catch(error => {
      console.error('Error al cargar la imagen del usuario:', error);
    });
}

}
