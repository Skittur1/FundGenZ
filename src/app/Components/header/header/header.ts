import { Component, HostListener, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements AfterViewInit, OnDestroy {
  isScrolled: boolean = false;
  isMenuOpen: boolean = false;
  headerHidden: boolean = false;
  private lastScrollY: number = 0;
  private scrollDelta = 10;

  constructor(private cdr: ChangeDetectorRef) {}

  private _scrollHandler: any = null;
  private _hideThreshold = 30; // px scrolled down to trigger hide
  private _showThreshold = 60; // px scrolled up to trigger show

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentY = window.scrollY || 0;
    this.isScrolled = currentY > 50;

    // don't hide header when menu is open
    if (this.isMenuOpen) {
      this.headerHidden = false;
      this.lastScrollY = currentY;
      return;
    }

    const diff = currentY - this.lastScrollY;
    if (Math.abs(diff) <= this.scrollDelta) {
      // ignore small scrolls
    } else if (diff > 0 && currentY > 100) {
      // scrolling down
      this.headerHidden = true;
    } else if (diff < 0) {
      // scrolling up
      this.headerHidden = false;
    }

    // keep lastScrollY within sensible bounds
    this.lastScrollY = Math.max(0, currentY);

    // ensure Angular updates the template class binding
    try { this.cdr.detectChanges(); } catch (e) {}
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (window.innerWidth > 992) {
      this.isMenuOpen = false;
    }
  }

  ngAfterViewInit() {
    // Direct DOM listener to toggle `.hidden` class on the nav element.
    try {
      const nav = document.querySelector('.navbar');
      this._scrollHandler = () => {
        const currentY = window.scrollY || 0;
        const diff = currentY - this.lastScrollY;
        let hide = false;

        if (this.isMenuOpen) {
          hide = false;
          this.lastScrollY = currentY;
        } else {
          const currentNav = document.querySelector('.navbar');
          const currentlyHidden = currentNav ? currentNav.classList.contains('hidden') : false;
          // no-op debug

          if (!currentlyHidden) {
            if (diff > this._hideThreshold && currentY > 100) {
              hide = true;
            } else {
              hide = false;
            }
          } else {
            if (this.lastScrollY - currentY > this._showThreshold) {
              hide = false;
            } else {
              hide = true;
            }
          }

          this.lastScrollY = Math.max(0, currentY);
          if (currentNav) currentNav.classList.toggle('hidden', hide);
          // keep component state in sync so Angular's binding doesn't immediately remove the class
          try { this.headerHidden = hide; this.cdr.detectChanges(); } catch (e) {}
        }
      };
      window.addEventListener('scroll', this._scrollHandler, { passive: true });
    } catch (e) {
      // ignore
    }
  }

  ngOnDestroy() {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler as EventListener);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}
 
