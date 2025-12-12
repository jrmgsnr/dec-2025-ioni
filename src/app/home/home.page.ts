import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { CLUES } from '../clues';
import { PuzzleInputComponent } from '../puzzle-input/puzzle-input.component';

interface Clue {
  code: string,
  clue: string,
  isSpecial: boolean
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomePage {
  code = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6)
  ]);

  validClues: Clue[] = [];
  unlockedClues: Clue[] = [];
  puzzleCode: any;

  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    let cachedData = localStorage.getItem('unlockedClues');
    this.puzzleCode = localStorage.getItem('puzzleCode');

    if (cachedData) {
      this.unlockedClues = JSON.parse(cachedData);
    }

    if (this.puzzleCode) {
      this.validClues = _.get(CLUES, this.puzzleCode);
    } else {
      this.showModal();
    }
  }

  get isFormValid() {
    return this.code.valid;
  }

  inputChecker(e: any) {
    e.target.value = e.target.value.replace(/\D/g, '');
  }

  async showCode() {
    const inputCode = this.code.value ?? '';
    const clue = _.find(this.validClues, { code: inputCode });
    const exists = _.some(this.unlockedClues, clue);

    if (clue && !exists) {
      this.unlockedClues.unshift(clue);
      localStorage.setItem('unlockedClues', JSON.stringify(this.unlockedClues));
    } else {
      const toast = this.toastCtrl.create({
        message: clue && exists ? 'Clue already unlocked' : 'Invalid code',
        duration: 1500,
        cssClass: ['ion-text-center'],
        mode: 'ios',
        position: 'middle'
      });

      (await toast).present();
    }

    this.code.reset();
  }

  resetGame() {
    this.puzzleCode = '';
    this.validClues = [];
    this.unlockedClues = [];
    localStorage.clear();

    this.showModal();
  }

  async showModal() {
    if (_.isEmpty(this.puzzleCode)) {
      const modal = await this.modalCtrl.create({
        component: PuzzleInputComponent,
        backdropDismiss: false
      });
  
      modal.onDidDismiss().then((data) => {
        this.puzzleCode = _.get(data, 'data');
        this.validClues = _.get(CLUES, this.puzzleCode);
  
        localStorage.setItem('puzzleCode', this.puzzleCode);
      })
  
      modal.present();
    }
  }
}
