import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { PasswordValidator } from '../../validators/password.validator';

@Component({
  	selector: 'app-register',
  	templateUrl: './register.page.html',
  	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	registerForm: FormGroup;
	passwordForm: FormGroup;

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
			{ type: 'notEqual', message: '* as senhas devem ser iguais' },
		],
	}

	constructor(private router: Router, public formBuilder: FormBuilder, public afAuth: AngularFireAuth, public db: AngularFireDatabase,
	public loadingCtrl: LoadingController, public toastController: ToastController, public alertController: AlertController) { 
		this.registerForm = this.formBuilder.group({
			name: new FormControl('', Validators.required),
			email: new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
			]))
		});
		
		this.passwordForm = new FormGroup({
			password: new FormControl('', Validators.compose([
				Validators.minLength(6),
				Validators.required,
			])),
			confirmpassword: new FormControl('', Validators.compose([
				Validators.minLength(6),
				Validators.required,
			]))
		}, (formGroup: FormGroup) => {
			 return PasswordValidator.areEqual(formGroup);
		});
	}

	ngOnInit(){}

	/*================================= navegação entre páginas ===================================== */
	
	openHomePage(){
		this.router.navigateByUrl('home');
  	}

	openLoginPage(){
    	this.router.navigateByUrl('login');
	}
	
	async presentLoading() {
		const loading = await this.loadingCtrl.create({
		  message: 'Aguarde...',
		  translucent: true
		});
		return await loading.present();
	}

	/*================================= interacoes com o usuario ===================================== */

	async presentToast() {
		const toast = await this.toastController.create({
		  header: 'Bem vindo!',
		  message: 'Cadastro realizado com sucesso.',
		  showCloseButton: false,
		  position: 'top',
		  duration: 2000
		});
		toast.present();
	}

	async alertErrorRegisterEmail() {
		const alert = await this.alertController.create({
		  header: 'Erro',
		  subHeader: 'O email informado já foi cadastrado',
		  message: 'Por favor, utilize outro endereço de email, ou faça login com uma conta existente.',
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

	/*========================================== cadastro ============================================ */

  	registerUser(){
		this.presentLoading();
		this.afAuth.auth.createUserWithEmailAndPassword
		(this.registerForm.value.email, this.passwordForm.value.password)
		.then(data =>{
			this.afAuth.auth.signInWithEmailAndPassword(this.registerForm.value.email, this.passwordForm.value.password)
			.then(data =>{
				var user = this.afAuth.auth.currentUser;
				user.updateProfile({
					displayName: this.registerForm.value.name,
					photoURL: "https://static.thenounproject.com/png/363639-200.png"
				}).then(data =>{
					this.db.database.ref("/users/" + user.uid).set({
						email: user.email,
						username: user.displayName,
						photo: user.photoURL,
					});
					this.loadingCtrl.dismiss();
					this.openHomePage();
					this.presentToast();
				})
				.catch(error => {
					this.loadingCtrl.dismiss();
					this.openHomePage();
					this.presentToast();
				})
			})
			.catch(error => {
				this.loadingCtrl.dismiss();
				this.alertErrorInternet();
				this.openLoginPage();
			})
		})
		.catch(error => {
			this.loadingCtrl.dismiss();
			const errorCode = error.code;
			if(errorCode == 'auth/email-already-in-use'){
				this.loadingCtrl.dismiss();
				this.alertErrorRegisterEmail();
			}
			if(errorCode == 'auth/network-request-failed'){
				this.loadingCtrl.dismiss();
				this.alertErrorInternet();
			}
			console.log(errorCode);
		})
	}
}
