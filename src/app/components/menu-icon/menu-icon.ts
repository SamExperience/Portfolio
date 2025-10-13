// src/app/components/menu-icon/menu-icon.ts
import { Component } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-menu-icon',
  imports: [CommonModule, LottieComponent],
  templateUrl: './menu-icon.html',
  styleUrls: ['./menu-icon.scss'],
})
export class MenuIconComponent {
  options: AnimationOptions = {
    path: 'assets/animations/icons8-menu.json', // usa .json minuscolo
    autoplay: false,
    loop: false,
  };

  private anim: any;

  animationCreated(animation: any) {
    this.anim = animation;
    this.anim.stop();
  }

  play() {
    this.anim?.play();
  }

  stop() {
    this.anim?.stop();
  }
}
