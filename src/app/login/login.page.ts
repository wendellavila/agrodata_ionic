import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

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

	constructor(private router: Router, public formBuilder: FormBuilder, public afAuth: AngularFireAuth,
	public loadingCtrl: LoadingController, public toastController: ToastController, public alertController: AlertController) { 
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

  	ngOnInit(){
	}
	
	/*================================= navegação entre páginas ===================================== */

  	openRegisterPage() {
    	this.router.navigateByUrl('register');
	}
	openHomePage(){
    	this.router.navigateByUrl('home');
	}
	  
	/*================================= interacoes com o usuario ===================================== */

	async alertErrorLogin() {
		const alert = await this.alertController.create({
		  header: 'Erro',
		  subHeader: 'Não foi possível entrar',
		  message: 'Confira seu email e senha e tente novamente.',
		  buttons: ['OK']
		});
	
		await alert.present();
	}

	async alertErrorInternet() {
		const alert = await this.alertController.create({
		  header: 'Erro',
		  subHeader: 'Não foi possível conectar à internet',
		  message: 'Verifique sua conexão e tente novamente.',
		  buttons: ['OK']
		});
	
		await alert.present();
	}

	async presentToast() {
		const toast = await this.toastController.create({
		  header: 'Bem vindo!',
		  showCloseButton: false,
		  position: 'top',
		  duration: 2000
		});
		toast.present();
	}
	
	async presentLoading() {
		const loading = await this.loadingCtrl.create({
		  message: 'Aguarde...',
		  translucent: true
		});
		return await loading.present();
	}

	/*============================================ login ============================================== */

  	signInUser(){
		this.presentLoading();
		this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
		.then(data =>{
			this.loadingCtrl.dismiss();
			this.openHomePage();
			this.presentToast();
		})
		.catch(error => {
			const errorCode = error.code;
			if (errorCode == 'auth/user-not-found') {
				this.loadingCtrl.dismiss();
				this.alertErrorLogin();
			}
			if (errorCode == 'auth/wrong-password') {
				this.loadingCtrl.dismiss();
				this.alertErrorLogin();
			}
			if (errorCode == 'auth/network-request-failed'){
				this.loadingCtrl.dismiss();
				this.alertErrorInternet();
			}
			this.loadingCtrl.dismiss();
			console.log(error.code);
		})
	}

	
}
