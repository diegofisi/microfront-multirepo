import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { bus } from 'common-utils';
import { of, throwError } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient) {}

  login(usuario: string, clave: string): Observable<any> {
    if (usuario === 'jose@gmail.com' && clave === '123456') {
      return of({ token: 'fake-jwt-token' }).pipe(
        tap(() =>
          bus.next({
            topic: 'authSuccess',
            payload: { token: 'fake-jwt-token' },
          })
        )
      );
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }
  }
}
