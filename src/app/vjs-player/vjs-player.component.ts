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


  ngAfterViewInit(): void {

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


  setSpeed() {
    this.player?.playbackRate();
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