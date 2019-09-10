import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private api_key = 'AIzaSyBU7QeT5fvTvfum0o1EBF7-jFzCAkPQdYM';
  userToken: string;
  
  constructor(private http: HttpClient) {
    this.readToken();
   }
  
  logIn(usuario: UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
      };
    return this.http.post(
        `${ this.url }signInWithPassword?key=${this.api_key}`,
        authData
      ).pipe(
        map(resp => {
          console.log(resp);
          this.saveToken(resp['idToken']);
          return resp;
        })
        
      );
   }
  logOut(){
    localStorage.removeItem('token');
  }
  
  
  //Nuevo Usuario
  nuevoUsuario( usuario: UsuarioModel){
    const authData = {
    //email: usuario.email,
    //password: usuario.password,
    //lo de arriba se puede resumir
    ...usuario,
    returnSecureToken: true
    };
    return this.http.post(
      `${ this.url }signUp?key=${this.api_key}`,
      authData
    );
  }

  private saveToken(idToken: string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );
  }

  readToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }
    else{
      this.userToken = '';
    }
    return this.userToken;
  }
  
  
  haveToken(): boolean {
    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }

  }
}
