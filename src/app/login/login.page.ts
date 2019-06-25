import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  	selector: 'app-login',
  	templateUrl: './login.page.html',
  	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	loginForm: FormGroup;

	error_messages = {
		'email' : [
			{ type: 'required', message: '* campo vazio' },
			{ type: 'pattern', message: '* e-mail inválido' }
		],
		'password' : [
			{ type: 'required', message: '* campo vazio' },
			{ type: 'minlength', message: '* senha muito curta' }
		],
	}

  	constructor(private router: Router, public formBuilder: FormBuilder) { 
		this.loginForm = this.formBuilder.group({
			email: new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
			])),
			password: new FormControl('', Validators.compose([
				Validators.required,
				Validators.minLength(6)
			]))
		});
	}

  	ngOnInit() {
  	}
  	openRegisterPage() {
    	this.router.navigateByUrl('register');
  	}
  	signInUser(){
		console.log(this.loginForm.value.password);
		console.log(this.loginForm.value.email);
		this.router.navigateByUrl('home');
  	}

}
