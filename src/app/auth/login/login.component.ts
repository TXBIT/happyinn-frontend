import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hpi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errors: any[] = [];
  notification: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe((params) => {
      if (params['registered'] === 'success') {
        this.notification = 'Registered successfully. Please login!';
      }
    });
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$',
          ),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  // Check whether an input is invalid
  isInvalidInput(field): boolean {
    return (
      this.loginForm.controls[field].invalid &&
      (this.loginForm.controls[field].dirty ||
        this.loginForm.controls[field].touched)
    );
  }

  // Check required input
  isRequired(field): boolean {
    return this.loginForm.controls[field].errors.required;
  }

  // Login
  login() {
    this.errors = [];
    this.auth.login(this.loginForm.value).subscribe(
      (successResponse) => {
        this.router.navigate(['/rentals']);
      },
      (errorResponse) => {
        this.errors.push(errorResponse.error.message);
      },
    );
  }
}
