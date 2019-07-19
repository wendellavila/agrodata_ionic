import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  	selector: 'app-plantation',
  	templateUrl: './plantation.page.html',
  	styleUrls: ['./plantation.page.scss'],
})
export class PlantationPage implements OnInit {

	user;
	uid;
	id : String;
	members : Object[] = [];
	subscription;

	constructor(private route: ActivatedRoute, private router: Router, public formBuilder: FormBuilder, public afAuth: AngularFireAuth,
	public db: AngularFireDatabase, public loadingCtrl: LoadingController,
	public toastController: ToastController,public alertController: AlertController) {
		this.route.queryParams.subscribe((params) =>{
			if(params && params.plantationId){
				this.id = params.plantationId;
				this.subscription = this.db.list("/plantationdata/" + this.id + "/members").valueChanges().subscribe(data => {
					this.members = data;
				});
			}
		})
		this.user = this.afAuth.auth.currentUser;
		this.uid = this.user.uid;
	}

  	ngOnInit(){
	}
	  
	/*================================= navegação entre páginas ===================================== */

	openHomePage(){
		this.router.navigateByUrl('home');
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
		  header: 'Sucesso',
		  message: 'Funcionário adicionado com sucesso.',
		  showCloseButton: false,
		  position: 'top',
		  duration: 2000
		});
		toast.present();
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

	/*============================== exibir dados do banco no html ================================== */

	getPlantationType(){
		var type = "";
  
		this.db.database.ref("/plantationdata/" + this.id + "/type").on('value', function(snapshot) {
			type = snapshot.val();
		});
		return type;
	}

	getUsername(uid: String){
		return this.user.displayName;
	}

	getEmail(uid: String){
		return this.user.email;
	}

	getPlantationOwnership(uid: String){
		var ownership;
		this.db.database.ref("/users/" + uid + "/plantations/" + this.id + "/isAdm").on('value', function(snapshot) {
			ownership = snapshot.val();
		});
		if(ownership == true){
			return "Proprietário"
		}
		else {
			return "Funcionário"
		}
	}

	/*==================================== adicionar funcionario ===================================== */
	addEmployee(){

	}

}
