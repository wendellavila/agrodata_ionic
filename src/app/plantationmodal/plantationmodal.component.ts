import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonRadioGroup } from '@ionic/angular';

@Component({
	selector: 'app-plantationmodal',
	templateUrl: './plantationmodal.component.html',
	styleUrls: ['./plantationmodal.component.scss'],
})
export class PlantationmodalComponent implements OnInit {

	@ViewChild('radioGroup') radioGroup: IonRadioGroup

	constructor(private modalController: ModalController) { }

	ngOnInit() {}

	add(){
		this.modalController.dismiss(this.radioGroup.value);
	}
}
