import { Injectable } from '@angular/core';
//import { HttpClient } from 'selenium-webdriver/http';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';

// import 'rxjs/add/operator/map';
// import { map } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';


import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) { 
      // console.log('Servicio de usuario listo!!!');
      this.cargarStorage();
  }


  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get( url )
    .pipe( map( ( resp:any ) => { 
      this.token = resp.token;
      localStorage.setItem('token', this.token );
      console.log('Token renovado');
      return true;

     } ) , catchError( err => {

      // console.log( err.error.mensaje );
      this.router.navigate(['/login']);
      Swal.fire({
        title: 'No se puedo renovar Token',
        text: 'No fue posible renvar el Token',
        type: 'error',
        confirmButtonText: 'Ok'
      })
      return Observable.throw ( err );
    } )
    );
  }


  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }


  cargarStorage() {
    if ( localStorage.getItem('token') ){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse ( localStorage.getItem('usuario') );
      this.menu = JSON.parse ( localStorage.getItem('menu') );
    }else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }



  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {

    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify( usuario ) );
    localStorage.setItem('menu', JSON.stringify( menu ) );

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
    
  }

logout(){
  this.usuario = null;
  this.token = '';
  this.menu = [];

  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('menu');

  this.router.navigate(['/login']);

};

  loginGooogle( token: string ){

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token: token } )
        .pipe( map( ( resp: any ) => {
          this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
          // console.log( resp );
          return true;
        } ) );
    
  }



  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ){
      localStorage.setItem('email', usuario.email );
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario )
        .pipe(map( (resp: any ) => {
          this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
          // localStorage.setItem('id', resp.id );
          // localStorage.setItem('token', resp.token );
          // localStorage.setItem('usuario', JSON.stringify( resp.usuario ) );
          return true;
        }), catchError( err => {

          // console.log( err.error.mensaje );
          Swal.fire({
            title: 'Error en el login!',
            text: err.error.mensaje,
            type: 'error',
            confirmButtonText: 'Ok'
          })
          return Observable.throw ( err );
          

        } )
        
        );
  }



  crearUsuario( usuario: Usuario ){

    console.log( URL_SERVICIOS );

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
      .pipe(map( (resp: any) => {

        Swal.fire({
          title: 'Usuario creado!',
          text: usuario.email,
          type: 'success',
          confirmButtonText: 'Ok'
        })
        return resp.usuario;
    }), catchError( err => {

      // console.log( err.error.mensaje );
      Swal.fire({
        title: err.error.mensaje,
        text: err.error.errors.message,
        type: 'error',
        confirmButtonText: 'Ok'
      })
      return Observable.throw ( err );
      
    } )
    
    );

  }


  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    // console.log( url );

    return this.http.put( url, usuario )
        .pipe(map( (resp: any) => {

          //this.usuario = resp.usuario;
          
          if ( usuario._id === this.usuario._id ) {
            let usuarioDB: Usuario = resp.usuario;
            this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
          }         
          Swal.fire({
            title: 'Usuario actualizado!',
            text: usuario.nombre,
            type: 'success',
            confirmButtonText: 'Ok'
          })

          return true;
        }), catchError( err => {

          // console.log( err.error.mensaje );
          Swal.fire({
            title: err.error.mensaje,
            text: err.error.errors.message,
            type: 'error',
            confirmButtonText: 'Ok'
          })
          return Observable.throw ( err );
          
        } )
        
        );

  }


  cambiarImagen( archivo: File, id: string ) {


    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
        .then( (resp: any) => {
          // console.log( resp );
          this.usuario.img = resp.usuario.img;
          Swal.fire({
            title: 'Imagen actualizada!',
            text: this.usuario.nombre,
            type: 'success',
            confirmButtonText: 'Ok'
          })

          //ACTUALIZAR STORAGE
          this.guardarStorage( id, this.token, this.usuario, this.menu );


        } )
        .catch( resp => {
          console.log( resp );
        } );

  }

  cargarUsuarios( desde: number = 0 ){

    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get( url );


  }

  buscarUsuarios( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get( url )
        .pipe(map( (resp:any) => resp.usuarios ));

  }

  borrarUsuario( id: string ) {

    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    
    return this.http.delete( url )
        .pipe( map( resp => {
          Swal.fire({
            title: 'Usuario borrado',
            text: 'El usuario ha sido eliminado correctamente',
            type: 'success',
            confirmButtonText: 'Ok'
          })
          return true;
        } ) )

  }


}
