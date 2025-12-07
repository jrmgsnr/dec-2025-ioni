import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as _ from 'lodash';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
export class HomePage implements AfterViewInit {
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

  scrollAnimation() {
    const duration = 2;
    gsap.registerPlugin(ScrollTrigger);

    let runAnimation = gsap.timeline(
      // {
      //   scrollTrigger: {
      //     trigger: '#container',
      //     start: "top top",
      //     end: "+=146",
      //     pin: true,
      //     scrub: true,
      //     markers: true
      //   }
      // }
    );

    runAnimation.to("#header", {
      duration: duration,
      height: 122,
      ease: "none"
    }, "<");

    runAnimation.to("#container", {
      duration: duration,
      paddingTop: 146,
      ease: "none"
    }, "<")

    runAnimation.to("#logo-container", {
      duration: duration,
      height: 50,
      width: 50,
      left: 16,
      transform: "translate(0)",
      ease: "none"
    }, "<")

    runAnimation.to("#title", {
      duration: duration,
      right: 16,
      height: 50,
      fontSize: 24,
      transform: "translate(0)",
      top: 36,
      ease: "none"
    }, "<")

  }

  ngAfterViewInit() {
    this.scrollAnimation();
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
