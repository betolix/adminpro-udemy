import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/service.index';

import Swal from 'sweetalert2'
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
        .subscribe( () => this.cargarHospitales() );
  }

  buscarHospital( termino:string ) {

    if ( termino.length <= 0  ){
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital( termino )
        .subscribe( hospitales => this.hospitales = hospitales );

  }

  cargarHospitales(){
    this._hospitalService.cargarHospitales()
        .subscribe( hospitales =>  this.hospitales = hospitales );
  }

  guardarHospital ( hospital: Hospital ){

    this._hospitalService.actualizarHospital( hospital )
        .subscribe( );


  }

  borrarHospital ( hospital: Hospital ){

    this._hospitalService.borrarHospital( hospital._id )
        .subscribe( () => this.cargarHospitales() );

  }

  crearHospital() {

    Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del Hospital',
      input: 'text',
      type: 'success',
      confirmButtonText: 'Ok'
    }).then( (valor ) => {

      if( !valor.value || valor.value.length === 0 ){
        console.log('valor esta vacio');
        return;
      }
      console.log('llamada al hospital service');
      this._hospitalService.crearHospital( valor.value )
          .subscribe( () => this.cargarHospitales() );


    } );

  }


  actualizarImagen( hospital: Hospital) {

    this._modalUploadService.mostrarModal( 'hospitales', hospital._id )

  }

}
