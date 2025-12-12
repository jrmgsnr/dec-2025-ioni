import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import * as _ from 'lodash';

import { PUZZLE_CODES } from "../clues";

@Component({
  selector: 'app-puzzle-input',
  templateUrl: 'puzzle-input.component.html',
  styleUrls: ['puzzle-input.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PuzzleInputComponent {
  puzzleCode = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6)
  ]);

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {}

  get isFormValid() {
    return this.puzzleCode.valid;
  }

  async submitCode() {
    const code = this.puzzleCode.value ?? '';
    const isCodeValid = _.includes(_.values(PUZZLE_CODES), code);

    if (isCodeValid) {
      this.modalCtrl.dismiss(code);
    } else {
      const toast = this.toastCtrl.create({
        message: "Invalid code",
        duration: 1500,
        cssClass: ['ion-text-center'],
        mode: 'ios',
        position: 'middle'
      });

      (await toast).present();
      
      this.puzzleCode.reset();
    }
  }
}