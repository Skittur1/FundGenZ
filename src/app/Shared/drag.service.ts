import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface MoneyParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  symbol: string;
  speedX: number;
  speedY: number;
}

@Injectable({
  providedIn: 'root',
})
export class DragService {
  private particles: MoneyParticle[] = [];
  private animationFrame: any;
  private isDragging = false;
  private dragX = 0;
  private dragY = 0;
  private startX = 0;
  private startY = 0;
  private isBrowser: boolean;

  // Observable for drag state
  private dragState = new BehaviorSubject<{ isDragging: boolean, transform: string }>({
    isDragging: false,
    transform: ''
  });

  dragState$ = this.dragState.asObservable();

  private moneySymbols = ['💰', '💵', '💶', '💷', '💴', '🪙', '💎', '✨'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Only initialize if in browser
    if (this.isBrowser) {
      this.initParticles();
      this.startParticleAnimation();
    }
  }

  initParticles() {
    const count = 30;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(): MoneyParticle {
    // Check if window is defined
    const width = this.isBrowser ? window.innerWidth : 1000;
    const height = this.isBrowser ? window.innerHeight : 800;
    
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: 20 + Math.random() * 30,
      opacity: 0.3 + Math.random() * 0.5,
      rotation: Math.random() * 360,
      symbol: this.moneySymbols[Math.floor(Math.random() * this.moneySymbols.length)],
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5
    };
  }

  startParticleAnimation() {
    // Only run animation in browser
    if (!this.isBrowser) return;
    
    const animate = () => {
      this.particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > window.innerWidth) p.x = 0;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.y > window.innerHeight) p.y = 0;
        if (p.y < 0) p.y = window.innerHeight;

        p.rotation += (Math.random() - 0.5) * 2;
      });

      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  getParticles(): MoneyParticle[] {
    return this.particles;
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.isBrowser) return;
    
    this.isDragging = true;
    this.startX = event.clientX - this.dragX;
    this.startY = event.clientY - this.dragY;
    document.body.style.cursor = 'grabbing';
    this.updateState();
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isBrowser) return;
    
    this.isDragging = false;
    document.body.style.cursor = 'grab';
    this.updateState();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isBrowser) return;
    
    if (this.isDragging) {
      this.dragX = event.clientX - this.startX;
      this.dragY = event.clientY - this.startY;
      this.updateState();
    }
  }

  onWheel(event: WheelEvent): void {
    if (!this.isBrowser) return;
    
    const delta = event.deltaY;
    const scale = 1 + delta * 0.001;
    const transform = `translate(${this.dragX}px, ${this.dragY}px) scale(${Math.max(0.5, Math.min(2, scale))})`;
    this.dragState.next({
      isDragging: this.isDragging,
      transform: transform
    });
  }

  private updateState() {
    this.dragState.next({
      isDragging: this.isDragging,
      transform: `translate(${this.dragX}px, ${this.dragY}px)`
    });
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}