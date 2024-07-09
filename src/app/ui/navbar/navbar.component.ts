import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FirestoreService } from '../../service/firestore.service';
import { FirestorageService } from '../../service/firestorage.service';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  userImageUrl: string = 'assets/images/avatar.png';
  user!:User;
  constructor(private authService: AuthService, private firestoreService: FirestoreService, private firestorageService: FirestorageService, private userService: UserService) {
    this.user = new User();
    // Verificar el estado de autenticación al inicializar el componente
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        // Usuario autenticado, actualiza la imagen del usuario y marca como autenticado, carga los datos del usuario
        this.isLoggedIn = true;
        const uid = user.uid;
        this.loadUserImageUrl(uid);
        this.loadUserData(uid);
        this.user.email = user.email;
        this.userService.setUser(this.user);
      } else {
        // No hay usuario autenticado, restaura valores por defecto
        this.isLoggedIn = false;
        this.userImageUrl = 'assets/images/avatar.png';
      }
    });
  }
  /**
   * @returns void
   * @memberof NavbarComponent
   * @description Cierra la sesión del usuario actual y restaura los valores por defecto
   * 
   */
  logout() {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.userImageUrl = 'assets/images/avatar.png';
    });
  }
  /**
   * 
   * @param uid 
   * @returns void
   * @memberof NavbarComponent
   * @description Carga la imagen del usuario autenticado
   */
  loadUserImageUrl(uid: string): void {
    this.firestoreService.getUserImageUrl(uid).subscribe(
      imageUrl => {
        this.firestorageService.downloadFile(imageUrl).subscribe(
          url => {
            this.userImageUrl = url;
            this.user.fotoPerfil = url;
            console.log('Imagen del usuario cargada:', url);
          },
          error => {
            console.error('Error al obtener la URL de descarga:', error);
          }
        );
      },
      error => {
        console.error('Error al cargar la imagen del usuario:', error);
      }
    );
  }
  /**
   * 
   * @param uid 
   * @returns void
   * @memberof NavbarComponent
   * @description Carga los datos del usuario autenticado
   */
  loadUserData(uid: string): void {
    this.firestoreService.getUserData(uid)
      .subscribe(data => {
        this.user.DNI = data.DNI;
        this.user.nombre = data.nombre;
        this.user.nombreUsuario = data.nombreUsuario;
        this.user.apellido = data.apellido;
        this.user.ciudad= data.ciudad;
        this.user.codigoPostal = data.codigoPostal;
        this.user.direccion = data.direccion;
        this.user.fechaNacimiento= data.fechaNacimiento;
        this.user.fechaRegistro = data.fechaRegistro;
        this.user.idiomaPreferido = data.idiomaPreferido;
        this.user.pais = data.pais;
        this.user.provincia = data.provincia;
        this.user.telefono = data.telefono;
        this.user.estadoCuenta = data.estadoCuenta;
        console.log('Datos del usuario cargados:', data);
      }, error => {
        console.error('Error al cargar los datos del usuario:', error);
      });
  }
}
