import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;

  imagenSubir: File;
  imagenTemp: any; // DEBERIA SER STRING 

  constructor(
    public _usuarioService: UsuarioService
  ) {
      this.usuario = this._usuarioService.usuario;
   }

  ngOnInit() {
  }

  guardar( usuario: Usuario ){

    // console.log( usuario );
    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ){
      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario( this.usuario )
        .subscribe();
  }


  seleccionImage ( archivo: File ) {

    if( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    // console.log( event );
    
    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire({
        title: 'Sólo imágenes!',
        text: 'El archivo seleccionado no es una imagen',
        type: 'error',
        confirmButtonText: 'Ok'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;
    
  }


  cambiarImagen() {
    this._usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id );
  }


}
