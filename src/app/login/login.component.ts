import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../shared/authorization.service";
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { ApiService } from "../shared/api.service"

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	providers: [ApiService]
})
export class LoginComponent {
	emailVerificationMessage: boolean = false;

	constructor(private auth: AuthorizationService,
		private _router: Router) {
	}

	onSubmit(form: NgForm) {

		const email = form.value.email;
		const password = form.value.password;

		this.auth.signIn(email, password).subscribe((data) => {
			this._router.navigateByUrl('/profile');
		}, (err) => {
			this.emailVerificationMessage = true;
		});

	}
}
