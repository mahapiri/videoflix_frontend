import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    NavbarComponent,
    CommonModule,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  lastScrollPosition: number = 0;
  scrollThreshold: number = 30;
  video!: HTMLVideoElement;
  scrollHandler!: Function;

  isDragging = false;
  startX = 0;
  scrollLeft = 0;
  currentRow: HTMLElement | null = null;


  constructor(
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router
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
    if (!this.isDragging) {
      const path = 'escape.mp4';
      this.router.navigate([`/video-player/${path}`]);
    }
  }

  
  mouseDown(event: MouseEvent): void {
    const element = event.currentTarget as HTMLElement;
    if (!element) return;

    this.isDragging = true;
    this.currentRow = element;
    this.startX = event.pageX - element.offsetLeft;
    this.scrollLeft = element.scrollLeft;
    this.renderer.addClass(element, 'dragging');
    event.preventDefault();
  }


  mouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.currentRow) return;

    const x = event.pageX - this.currentRow.offsetLeft;
    const walk = (x - this.startX) * 1;
    this.currentRow.scrollLeft = this.scrollLeft - walk;
  }


  mouseUp(): void {
    if (this.currentRow) {
      this.renderer.removeClass(this.currentRow, 'dragging');
    }
    this.isDragging = false;
    this.currentRow = null;
  }


  mouseLeave(): void {
    if (this.currentRow) {
      this.renderer.removeClass(this.currentRow, 'dragging');
    }
    this.isDragging = false;
    this.currentRow = null;
  }
}
