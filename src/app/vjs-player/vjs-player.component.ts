import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    fill: boolean,
    fluid: boolean,
    loop: boolean,
    controls: boolean,
    autoplay: boolean,
    muted: boolean,
    poster: string,
    bigPlayButton: boolean,
    sources: {
      src: string,
      type: string,
    }[],
  };

  player?: Player;
  videoSrc: string = '';
  isFullscreen: boolean = false;
  isPlayed: boolean = false;
  isPlaybackrate: boolean = false;
  playbackrates: number[] = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private _location: Location,
    public sharedService: SharedService,
    private route: ActivatedRoute
  ) {
    this.sharedService.setIsNavbar(false);
    this.sharedService.setIsFooter(false);
  }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe(params => {
        const path = params.get('path');
        if (path) {
          this.setupVideoPlayer(path);
        }
      });
    }
  }

  
  ngAfterViewInit(): void {
  }


  setupVideoPlayer(videoPath: string) {
    this.videoSrc = videoPath;
    const videoSrc = `/assets/video/thumbnail/${videoPath}`;
    const playerOptions = {
      fill: false,
      fluid: false,
      loop: false,
      controls: false,
      muted: false,
      autoplay: false,
      bigPlayButton: false,
      poster: '/assets/video/thumbnail/thumbnail.jpg',
      sources: [{
        src: videoSrc,
        type: 'video/mp4'
      }]
    };
    setTimeout(() => {
      if (this.target && this.target.nativeElement) {
        try {
          if (this.player) {
            this.player.dispose();
          }
          this.player = videojs(this.target.nativeElement, playerOptions);
        } catch (error) {
          console.error('Error initializing vjs player:', error);
        }
      } else {
        console.error('Video element was not found!', this.target);
      }
    }, 100);
  }


  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }


  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }


  back() {
    this._location.back();
  }


  toggleFullscreen() {
    if (!this.player) return;

    if (this.isFullscreen) {
      this.player.exitFullscreen();
    } else {
      this.player.requestFullscreen();
    }
  }


  togglePlaybackrate(event: Event) {
    event.stopPropagation();
    this.isPlaybackrate = !this.isPlaybackrate;
    if (this.isPlaybackrate) {
      const currentRate = this.player?.playbackRate();
      if (currentRate) {
        this.setPlaybackrate(event, currentRate);
      }
    }
  }


  setPlaybackrate(event: Event, rate: number) {
    event.stopPropagation();
    setTimeout(() => {
      const selectedElement = document.getElementById(`${rate}`);
      const otherElements = document.querySelectorAll('.speed-btn.active');
      otherElements.forEach(element => {
        element.classList.remove('active')
      });
      selectedElement?.classList.add('active');
    }, 0);
    this.player?.playbackRate(rate);
  }


  togglePlay() {
    if (!this.isPlayed) {
      this.player?.play();
      this.isPlayed = true;
    } else {
      this.player?.pause();
      this.isPlayed = false;
    }
  }


  setForward() {
    this.player?.currentTime();
  }


  setReplay() {
    this.player?.currentTime();
  }


  toggleMute() {

    this.player?.muted(true);
  }
}