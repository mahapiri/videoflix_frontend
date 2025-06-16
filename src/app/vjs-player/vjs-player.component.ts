import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-vjs-player',
  imports: [],
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('target', { static: false }) target!: ElementRef<HTMLVideoElement>;

  // See options: https://videojs.com/guides/options
  @Input() options?: {
    // fluid: boolean,
    fill: boolean
    // aspectRatio: string,
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  ngAfterViewInit(): void {
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


  ngOnInit() {

  }


  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }


  enterFullscreen() {
    if(this.player) {
      this.player.requestFullscreen();
    }
  }
}