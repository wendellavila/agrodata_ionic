import { Component } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlantationmodalComponent } from '../plantationmodal/plantationmodal.component';


@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {

	user;
	uid;
	id;
	plantations : Object[] = [];
	subscription;
	currentLoading = null;

	constructor(private router: Router, public afAuth: AngularFireAuth, public db: AngularFireDatabase,
	public loadingCtrl: LoadingController, public toastController: ToastController,
	public alertController: AlertController, public modalController: ModalController) {
		this.user = this.afAuth.auth.currentUser;
		this.uid = this.user.uid;
		this.subscription = this.db.list("/users/" + this.uid + "/plantations/").valueChanges().subscribe(data => {
			this.plantations = data;
		})
	}

	/*================================= navegação entre páginas ===================================== */

	openPlantationPage(id: string){
		let navigationExtras: NavigationExtras = {
			queryParams: {
				plantationId: id
			}
		};
		
		this.router.navigate(['plantation'], navigationExtras);
	}

	openLoginPage(){
    	this.router.navigateByUrl('login');
	}

	/*================================= interacoes com o usuario ===================================== */

	async alertErrorInternet() {
		const alert = await this.alertController.create({
		  header: 'Erro',
		  subHeader: 'Não foi possível conectar à internet',
		  message: 'Verifique sua conexão e tente novamente.',
		  buttons: ['OK']
		});
		
		await alert.present();
	}

	async presentLoading() {
		const loading = await this.loadingCtrl.create({
		  message: 'Aguarde...',
		  translucent: true
		});
		return await loading.present();
	}

	async presentModal(){
		const modal = await this.modalController.create({
			component: PlantationmodalComponent
		});

		modal.onDidDismiss()
		.then((data) => {
			const selection = data['data'];
			console.log(selection);
			this.createPlantation(selection);
		});

		modal.present();
	}

	disconnect(){
		this.afAuth.auth.signOut()
		.then((data) => {
			this.openLoginPage();
		})
		.catch(error => {
			const errorCode = error.code;
			this.loadingCtrl.dismiss();
			console.log(errorCode);
			if(errorCode == 'auth/network-request-failed'){
			   this.alertErrorInternet();
			}
		});
	}

	/*============================== exibir dados do banco no html ================================== */

	getPlantationId(id: string){
		this.id = id;
	}

	getPlantationImg(){
		var img;
		
		this.db.database.ref("/plantationdata/" + this.id + "/img").on('value', function(snapshot) {
			img = snapshot.val();
		});
		return img;
	}

	getPlantationType(){
		var type;
  
		this.db.database.ref("/plantationdata/" + this.id + "/type").on('value', function(snapshot) {
			type = snapshot.val();
		});
		return type;
	}
 
	/*======================================= criar plantacao ======================================== */

	createPlantation(type){
		var id = this.generateid();
		var img;
		if(type == "Milho"){
			img = "https://s3.amazonaws.com/virtuaria-h01/wp-content/uploads/sites/46/2018/11/29081726/acf6686a93225dbe7b1da31c202fb7c1-300x300.jpg";
		}
		else if(type == "Café"){
			img = "http://www.elchaco.info/wp-content/uploads/2017/07/tazas-con-café-300x300.jpg";
		}
		else if(type == "Laranja"){
			img = "https://petiscos.jp/wp-content/uploads/2012/07/laranja-300x300.jpg";
		}
		else if(type == "Cana-de-açúcar"){
			img = "http://sabri.com.br/wp-content/uploads/2018/10/5812126_x720-300x300.jpg";
		}
		else if(type == "Feijão"){
			img = "https://www.diarioinduscom.com/wp-content/uploads/2019/07/feijao-rajado-diarioindusco-300x300.jpg";
		}
		else {
			img = "http://placehold.it/300";
		}
		this.presentLoading();

		//criar dados da plantacao no bd
		this.db.database.ref("/plantationdata/" + id).set({
            id: id,
            type: type,
            img: img,
            memberCount: 1
		})
		.then(data =>{
			//adicionar plantacao à lista de plantacoes do usuário que criou
			this.db.object("/users/" + this.uid + "/plantations/" + id).update({
				plantationId: id,
				isAdm: true,
			})
			.then(data =>{
				//adicionar usuário à lista de membros da plantação
				this.db.object("/plantationdata/" + id + "/members/" + this.uid).update({
					uid: this.uid,
					isAdm: true,
				})
				.then(data =>{
					this.loadingCtrl.dismiss();
			   		this.openPlantationPage(id);
				})
				.catch(error => {
					const errorCode = error.code;
					this.loadingCtrl.dismiss();
					console.log(errorCode);
					if(errorCode == 'auth/network-request-failed'){
					   this.alertErrorInternet();
					}
				});
			})
			.catch(error => {
			   	const errorCode = error.code;
			   	this.loadingCtrl.dismiss();
			   	console.log(errorCode);
			   	if (errorCode == 'auth/network-request-failed'){
				  	this.alertErrorInternet();
			   	}
			});
		})
		.catch(error => {
			const errorCode = error.code;
			this.loadingCtrl.dismiss();
			console.log(errorCode);
			if (errorCode == 'auth/network-request-failed'){
			   this.alertErrorInternet();
			}
		});
	}

	//gerar string aleatória de 5 caracteres
	randomid(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
		for (var i = 0; i < 5; i++){
		   text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	
	//gerar id único usando data e hora + string aleatória (padrão: ddmmaaaa-hhmmss-string)
	generateid(){
		var date = new Date();
		
		var day = date.getDate();
		var day2 = "";
		var hours = date.getHours();
		var hours2 = "";
		var minutes = date.getMinutes();
		var minutes2 = "";
		var month = date.getMonth() + 1;
		var month2 = "";
		var year = date.getFullYear();
		var seconds = date.getSeconds();
		var seconds2 = "";
		
		if(day < 10){
		   day2 = "0" + day;
		}
		else {
		   day2 = "" + day;
		}
		if(hours < 10){
		   hours2 = "0" + hours;
		}
		else {
		   hours2 = "" + hours;
		}
		if(minutes < 10){
		   minutes2 = "0" + minutes;
		}
		else {
		   minutes2 = "" + minutes;
		}
		if(month < 10){
		   month2 = "0" + month;
		}
		else {
		   month2 = "" + month;
		}
		if(seconds < 10){
		   seconds2 = "0" + seconds;
		}
		else {
		   seconds2 = "" + seconds;
		}
  
		return "" + day2 + month2 + year + "-" + hours2 + minutes2 + seconds2 + "-" + this.randomid(); 
	}
 
}
