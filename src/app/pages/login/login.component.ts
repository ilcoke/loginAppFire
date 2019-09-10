import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  usuario: UsuarioModel = new UsuarioModel();
  recuerdame = false;
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
    }
  }

  onsubmit(form: NgForm){

    // **si hay error no pasa
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

    this.auth.logIn(this.usuario)
    .subscribe(rest => {
      console.log(rest);
      console.log('rest login');  
      Swal.close();
      
      if(this.recuerdame){
        localStorage.setItem('email', this.usuario.email);
      }

      this.router.navigateByUrl('/home')
    }, (err) => {
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
