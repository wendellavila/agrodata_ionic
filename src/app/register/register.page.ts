import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from '../../validators/password.validator';

@Component({
  	selector: 'app-register',
  	templateUrl: './register.page.html',
  	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	registerForm: FormGroup;

	error_messages = {
		'name' : [
			{ type: 'required', message: '* campo vazio' }
		],
		'email' : [
			{ type: 'required', message: '* campo vazio' },
			{ type: 'pattern', message: '* e-mail inválido' }
		],
		'password' : [
			{ type: 'required', message: '* campo vazio' },
			{ type: 'minlength', message: '* senha deve ter no mínimo 6 caracteres' }
		],
		'confirmpassword' : [
			{ type: 'required', message: '* campo vazio' },
			{ type: 'minlength', message: '* senha deve ter no mínimo 6 caracteres' },
			{ type: 'areEqual', message: '* as senhas devem ser iguais' }
		],
	}

  	constructor(private router: Router, public formBuilder: FormBuilder) { 
		this.registerForm = this.formBuilder.group({
			name: new FormControl('', Validators.required),
			email: new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
			])),
			password: new FormControl('', Validators.compose([
				Validators.required,
				Validators.minLength(6)
			])),
			confirmpassword: new FormControl('', Validators.compose([
				Validators.required,
				Validators.minLength(6),
			]))
		});
	}

	ngOnInit() {}
	  
	openLoginPage(){
    	this.router.navigateByUrl('login');
  	}
  	registerUser(){
		console.log(this.registerForm.value.password);
		console.log(this.registerForm.value.confirmpassword);
		console.log(this.registerForm.value.email);
		console.log(this.registerForm.value.name);
		this.router.navigateByUrl('home');
  	}
}
