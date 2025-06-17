import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-vjs-player',
  imports: [
    CommonModule
  ],
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true }) target!: ElementRef<HTMLVideoElement>;

  @Input() options?: {
    fill: boolean
    loop: boolean,
    controls: boolean,
    autoplay: boolean,
    muted: boolean,
    poster: string,
    sources: {
      src: string,
      type: string,
    }[],
  };

  player?: Player;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private _location: Location,
    public sharedService: SharedService
  ) { }


  ngAfterViewInit(): void {

  }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.target && this.target.nativeElement) {
          try {
            this.player = videojs(this.target.nativeElement, this.options);
          } catch (error) {
            console.error('Videojs Initialization Error:', error);
          }
        } else {
          console.error('target is undefined!', this.target);
        }
      }, 0);
    }
  }


  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }


  backToDashboard() {
    this.router.navigate(['/dashboard']);
    // this.sharedService.setIsFullscreen(false);
  }

  back() {
    this._location.back();
    // this.sharedService.setIsFullscreen(false);
  }
}