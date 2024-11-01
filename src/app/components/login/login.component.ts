// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  private returnUrl: string = '/home';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  onSubmit(): void {
    this.auth.basicLogin(this.username, this.password).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: () => (this.error = 'Invalid credentials'),
    });
  }

  onGoogleLogin(): void {
    this.auth.googleLogin();
  }
}
