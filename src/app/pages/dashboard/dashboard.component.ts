import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  lastScrollPosition: number = 0;
  scrollThreshold: number = 300;
  video!: HTMLVideoElement;
  scrollHandler!: Function;


  constructor(
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.sharedService.setIsNavbar(false);
    this.sharedService.setIsFooter(false);
  }


  ngOnInit(): void { }


  ngAfterViewInit(): void {
    this.video = this.elementRef.nativeElement.querySelector('#video') as HTMLVideoElement;

    if (!this.video) {
      console.error("Video not found")
      return;
    }

    this.scrollHandler = this.renderer.listen('window', 'scroll', () => {
      this.handleScroll();
    })
  }

  private handleScroll(): void {
    const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
    const videoRect = this.video.getBoundingClientRect();
    const videoTop = videoRect.top;

    if (videoTop < -this.scrollThreshold) {
      if (!this.video.paused) {
        this.video.pause();
      }
    } else {
      if (this.video.paused && this.video.autoplay) {
        this.video.play().catch(error => {
          console.error('Error:', error);
        });
      }
    }
    this.lastScrollPosition = currentScrollPosition;
  }


  ngOnDestroy(): void {
    this.sharedService.setIsNavbar(true);
    this.sharedService.setIsFooter(true);

    if (this.scrollHandler) {
      this.scrollHandler();
    }
    this.cdr.detectChanges();
  }


  playVideo() {
    // this.sharedService.setIsFullscreen(true);
  }
}
