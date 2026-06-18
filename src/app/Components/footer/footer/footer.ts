import { Component, HostListener, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s cubic-bezier(0.22, 1, 0.36, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerLinks', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(60, [
            animate('0.5s ease-out', 
              style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('socialHover', [
      transition('idle => hover', [
        style({ transform: 'scale(1) rotate(0deg)' }),
        animate('0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ transform: 'scale(1.15) rotate(5deg)' }))
      ]),
      transition('hover => idle', [
        animate('0.3s ease-out', 
          style({ transform: 'scale(1) rotate(0deg)' }))
      ])
    ])
  ]
})
export class Footer implements AfterViewInit {
  @ViewChild('footerElement') footerElement!: ElementRef;
  
  currentYear = new Date().getFullYear();
  isScrolled = false;
  hoveredSocial: string | null = null;
  isBrowser: boolean;
  isVisible = false;

  // Navigation Links
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'What We Do', path: '/services' },
    { label: 'Team', path: '/team' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' }
  ];

  // Legal Pages
  legalPages = [
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'Disclaimer', path: '/disclaimer' },
    { label: 'Refund Policy', path: '/refund' },
    { label: 'Cancellation Policy', path: '/cancellation' }
  ];

  // Services
  services = [
    'Fund Raising',
    'Pitchdeck',
    'Business Valuation',
    'Lead Generation',
    'Tax Advisory',
    'Website Development',
    'Mentorship'
  ];

  // Contact Information
  contactInfo = {
    email: 'hello@fundgenz.com',
    phone: '+91 99917 14895',
    whatsapp: '+91 97921 52964',
    address: 'Gurgaon, Haryana, India',
    workingHours: 'Monday – Friday | 9:00 AM – 6:00 PM IST'
  };

  // Social Media
  socialMedia = [
    { name: 'LinkedIn', url: 'https://linkedin.com/company/fundgenz', color: '#0a66c2' },
    { name: 'Twitter', url: 'https://twitter.com/fundgenz', color: '#1da1f2' },
    { name: 'YouTube', url: 'https://youtube.com/@fundgenz', color: '#ff0000' },
    { name: 'Instagram', url: 'https://instagram.com/fundgenz', color: '#e4405f' },
    { name: 'Facebook', url: 'https://facebook.com/fundgenz', color: '#1877f2' },
    { name: 'WhatsApp', url: 'https://wa.me/919792152964', color: '#25d366' }
  ];

  // Quick Contact Form
  formData = {
    email: '',
    subscribed: false
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Show footer with delay for animation
      setTimeout(() => {
        this.isVisible = true;
        try {
          this.footerElement?.nativeElement?.classList?.add('visible');
        } catch (e) {
          // ignore if DOM not available
        }
      }, 100);
    }
  }

  // ✅ DEFINED: onMouseMove method
  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser) return;
    
    const footer = this.footerElement?.nativeElement;
    if (footer) {
      const rect = footer.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      footer.style.setProperty('--mouse-x', x + '%');
      footer.style.setProperty('--mouse-y', y + '%');
    }
  }

  onSubmitForm(e: Event) {
    e.preventDefault();
    this.isSubmitting = true;
    this.submitError = false;

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.formData.email = '';
      
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 1500);
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  trackByFn(index: number, item: any) {
    return item.label || index;
  }
}