import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get usuario() {
    return this.form.get('usuario');
  }
  get clave() {
    return this.form.get('clave');
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { usuario, clave } = this.form.value;
    this.loginService.login(usuario, clave).subscribe({
      next: ( response ) => {
        alert('Ingreso exitoso');
        if (window.parent !== window) {
          window.parent.postMessage(
            {
              type: 'LOGIN_SUCCESS',
              user: {
                email: usuario,
                token: response.token,
                name: 'Jose',
                id: '12345',
              },
            },
            '*'
          );
        }
      },
      error: () => {
        alert('Credenciales inválidas');
      },
    });
  }
}
