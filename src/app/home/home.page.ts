import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { CLUES } from '../clues';

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

  unlockedClues: Clue[] = [];

  constructor(
    private toastCtrl: ToastController
  ) {
    let cachedData = localStorage.getItem('unlockedClues'); 

    if (cachedData) {
      this.unlockedClues = JSON.parse(cachedData);
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
    const clue = _.find(CLUES, { code: inputCode });
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
}
