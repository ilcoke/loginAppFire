import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  
  usuario: UsuarioModel;
  recuerdame = false;
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() { 
    this.usuario = new UsuarioModel();
  }
  onsubmit(form: NgForm){

    if(form.invalid){
      console.log("Error no enviado");
      return;
    }
    
    // **sweetAler loading
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'espere...'
    });
    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe( rest =>{

      console.log(rest);
      Swal.close();

      if(this.recuerdame){
        localStorage.setItem('email', this.usuario.email);
      }

      this.router.navigateByUrl('/home')

    },(err) =>{
      Swal.fire({
        type: 'info',
        title: 'error autenticado',
        text: err.error.error['message']
      });
      console.log(err.error.error['message']);
      
    }
    );
  }


}
