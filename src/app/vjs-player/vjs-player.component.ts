import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { SharedService } from '../services/shared.service';
import '@videojs/http-streaming';

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
  @ViewChild('progressLine') progressLine!: ElementRef;

  @Input() options?: {
    fill: boolean,
    fluid: boolean,
    loop: boolean,
    controls: boolean,
    autoplay: boolean,
    muted: boolean,
    preload: any,
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
  isMuted: boolean = false;
  playbackrates: number[] = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  uploadStatus: number = 0;
  status: number = 0;
  isReplay: boolean = false;
  duration: string = '00:00:00';

  isDragging: boolean = false;
  mouseMoveListener: any;
  mouseUpListener: any;
  touchMoveListener: any;
  touchEndListener: any;
  isBrowser: boolean = false;
  controlTimer: any;
  isControlElements: boolean = true;
  isControlElementsFixed: boolean = false;

  hlsQualityLevels: any[] = [];
  currentQuality: string = 'Auto';
  isAdaptiveStreaming: boolean = false;
  isQualitySelector: boolean = false;
  adaptiveBandwidth: number = 0;
  bufferHealth: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private _location: Location,
    public sharedService: SharedService,
    private route: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.sharedService.setIsNavbar(false);
    this.sharedService.setIsFooter(false);
  }


  ngOnInit() {
    if (this.isBrowser) {
      this.registerMouseEvents();
      this.registerTouchEvents();

      document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
      document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
      document.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
      document.addEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
    }

    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe(params => {
        const path = params.get('path');
        if (path) {
          this.setupVideoPlayer(path);
          // if (initializedPlayer) {
          //   console.log('klick')
          //   this.player?.on('progress', this.updateBufferedTime.bind(this));
          //   this.togglePlay();
          // }
        }
      });
    }
  }


  handleFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    if (this.isFullscreen) {
      this.isControlElements = true;
      if (this.controlTimer) {
        clearTimeout(this.controlTimer);
      }
      this.controlTimer = setTimeout(() => {
        this.isControlElements = false;
      }, 2000);
    }
  }


  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    if (this.isBrowser) {
      this.removeMouseEvents();
      this.removeTouchEvents();

      document.removeEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
      document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
      document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
      document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
    }
  }


  ngAfterViewInit(): void {
  }


  registerTouchEvents() {
    if (this.isBrowser) {
      this.touchMoveListener = this.onTouchMove.bind(this);
      this.touchEndListener = this.stopDrag.bind(this);

      document.addEventListener('touchmove', this.touchMoveListener, { passive: false });
      document.addEventListener('touchend', this.touchEndListener);
    }
  }


  removeTouchEvents() {
    if (this.isBrowser) {
      if (this.touchMoveListener) {
        document.removeEventListener('touchmove', this.touchMoveListener);
      }
      if (this.touchEndListener) {
        document.removeEventListener('touchend', this.touchEndListener);
      }
    }
  }


  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    this.showControlElements();

    if (this.isDragging && event.touches.length > 0) {
      const touch = event.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.updateStatusPosition(mouseEvent);
    }
  }


  onVideoTouch(event: TouchEvent) {
    this.showControlElements();
  }


  showControlElements() {
    this.isControlElements = true;

    if (this.controlTimer) {
      clearTimeout(this.controlTimer);
    }

    this.controlTimer = setTimeout(() => {
      this.isControlElements = false;
    }, 3000);
  }


  registerMouseEvents() {
    if (this.isBrowser) {
      this.mouseMoveListener = this.onMouseMove.bind(this);
      this.mouseUpListener = this.stopDrag.bind(this);

      document.addEventListener('mousemove', this.mouseMoveListener);
      document.addEventListener('mouseup', this.mouseUpListener);
    }
  }


  removeMouseEvents() {
    if (this.isBrowser) {
      if (this.mouseMoveListener) {
        document.removeEventListener('mousemove', this.mouseMoveListener);
      }
      if (this.mouseUpListener) {
        document.removeEventListener('mouseup', this.mouseUpListener);
      }
    }
  }


  startDrag(event: MouseEvent) {
    this.togglePlay();
    this.isDragging = true;
    this.updateStatusPosition(event);
  }


  onMouseMove(event: MouseEvent) {
    this.isControlElements = true;

    if (this.controlTimer) {
      clearTimeout(this.controlTimer);
    }

    this.controlTimer = setTimeout(() => {
      this.isControlElements = false;
    }, 2000);

    if (this.isDragging) {
      this.updateStatusPosition(event);
    }
  }


  stopDrag() {
    if (this.isDragging) {
      this.isDragging = false;
      this.player?.currentTime(this.calculateTimeFromPosition());
      this.togglePlay();
    }
  }


  updateStatusPosition(event: MouseEvent) {
    if (!this.progressLine) return;
    const progressRect = this.progressLine.nativeElement.getBoundingClientRect();
    const offsetX = event.clientX - progressRect.left;
    const progressWidth = progressRect.width;
    let percentage = (offsetX / progressWidth) * 100;
    percentage = Math.min(100, Math.max(0, percentage));
    this.status = percentage;
    this.uploadStatus = percentage;
  }


  calculateTimeFromPosition(): number {
    if (!this.player) return 0;
    const duration = this.player?.duration();
    if (duration) {
      return (this.status / 100) * duration;
    }
    return 0;
  }


  setupVideoPlayer(videoPath: string) {
    this.videoSrc = videoPath;
    const hlsUrl = `/assets/video/hls/${videoPath}/playlist.m3u8`;
    const mp4Url = `/assets/video/thumbnail/${videoPath}`;
    const playerOptions = {
      fill: false,
      fluid: false,
      loop: false,
      controls: false,
      muted: false,
      autoplay: false,
      preload: 'metadata',
      bigPlayButton: false,
      poster: '/assets/video/thumbnail/thumbnail.jpg',
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: !videojs.browser.IS_SAFARI,
          useDevicePixelRatio: true
        }
      },
      sources: [{
        src: mp4Url,
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

          this.setupPlayerListeners();
          this.checkAndSetupHLS(hlsUrl);
        } catch (error) {
          console.error('Error initializing vjs player:', error);
        }
      } else {
        console.error('Video element was not found!', this.target);
      }
    }, 100);
  }


  setupPlayerListeners() {
    if (!this.player) return;

    this.player.on('progress', this.updateBufferedTime.bind(this));
    this.player.on('loadedmetadata', () => {
      setTimeout(() => {
        this.togglePlay();
      }, 1000);
    });

    this.player.on('error', (error: any) => {
      console.error('Video Player Error:', error);
      this.handleVideoError();
    });

    this.getCurrentTime();
    this.getDurationTime();
  }


  async checkAndSetupHLS(hlsUrl: string) {
    try {
      const response = await fetch(hlsUrl, { method: 'HEAD' });
      if (response.ok) {
        this.player?.src({
          src: hlsUrl,
          type: 'application/x-mpegURL'
        });
        this.setupHlsListeners();
        this.isAdaptiveStreaming = true;
      } else {
        this.isAdaptiveStreaming = false;
        this.updateOptimizationDisplay('Optimizing video four screen 1080p');
      }
    } catch (error) {
      console.log('HLS not found, using mp4:', error);
      this.isAdaptiveStreaming = false;
      this.updateOptimizationDisplay('Optimizing video four screen 1080p');
    }
  }


  setupHlsListeners() {
    if (!this.player) return;

    this.player.ready(() => {
      const vhs = (this.player?.tech(true) as any)?.vhs;

      if (vhs) {
        this.player?.on('loadstart', () => {
          this.updateOptimizationDisplay('Loading video optimizing...');
        });
        setInterval(() => {
          this.updateStreamingStats();
        }, 2000);
        this.createMockQualityLevels();
      }
    });
  }

  createMockQualityLevels() {
    this.hlsQualityLevels = [
      { index: 0, width: 1920, height: 1080, bandwidth: 5000000, label: '1080p' },
      { index: 1, width: 1280, height: 720, bandwidth: 2500000, label: '720p' },
      { index: 2, width: 854, height: 480, bandwidth: 1200000, label: '480p' },
      { index: 3, width: 640, height: 360, bandwidth: 800000, label: '360p' }
    ];
  }


  updateStreamingStats() {
    if (!this.player || !this.isAdaptiveStreaming) return;

    const tech = this.player.tech(true) as any;
    if (tech?.vhs) {
      const vhs = tech.vhs;
      this.adaptiveBandwidth = vhs.bandwidth || 0;
      this.bufferHealth = this.getBufferHealth();

      this.simulateQualityAdaptation();
      this.updateOptimizationDisplay();
    }
  }


  simulateQualityAdaptation() {
    const connectionSpeed = this.getSimulatedConnectionSpeed();

    if (connectionSpeed > 4000) {
      this.currentQuality = '1080p';
    } else if (connectionSpeed > 2000) {
      this.currentQuality = '720p';
    } else if (connectionSpeed > 1000) {
      this.currentQuality = '480p';
    } else {
      this.currentQuality = '360p';
    }
  }


  getSimulatedConnectionSpeed(): number {
    const baseSpeed = 2500;
    const variation = Math.random() * 1000 - 500;
    return Math.max(500, baseSpeed + variation);
  }

  updateOptimizationDisplay(customMessage?: string) {
    const titleContainer = document.querySelector('.title-container h6');
    if (titleContainer) {
      if (customMessage) {
        titleContainer.textContent = customMessage;
      } else if (this.isAdaptiveStreaming) {
        const bandwidth = Math.round(this.adaptiveBandwidth / 1000);
        titleContainer.textContent = `Optimizing video four screen ${this.currentQuality} (${bandwidth} kbps)`;
      } else {
        titleContainer.textContent = 'Optimizing video four screen 1080p';
      }
    }
  }


  toggleQualitySelector(event: Event) {
    event.stopPropagation();
    this.isQualitySelector = !this.isQualitySelector;
  }


  setQuality(qualityIndex: number) {
    if (qualityIndex === -1) {
      this.currentQuality = 'Auto';
    } else {
      const quality = this.hlsQualityLevels[qualityIndex];
      this.currentQuality = quality.label;
    }
    console.log(`Qualität gesetzt auf: ${this.currentQuality}`);
    this.updateOptimizationDisplay();
  }


  getBandwidthInfo(): string {
    if (!this.isAdaptiveStreaming) return 'Standard';
    return `${Math.round(this.adaptiveBandwidth / 1000)} kbps`;
  }


  getBufferHealth(): number {
    if (!this.player) return 0;

    const buffered = this.player.buffered();
    const currentTime = this.player.currentTime() || 0;

    if (buffered.length > 0) {
      const bufferedEnd = buffered.end(buffered.length - 1);
      return Math.max(0, bufferedEnd - currentTime);
    }
    return 0;
  }


  handleVideoError() {
    console.log('Video error occurred, fallback to standard playback');
    this.isAdaptiveStreaming = false;
    this.updateOptimizationDisplay('Fallback auf Standard-Wiedergabe');
  }


  getDurationTime() {
    this.player?.on('loadedmetadata', () => {
      let duration = this.player?.duration();
      if (duration) {
        this.duration = this.setTimeFormat(duration);
      }
    })
  }


  setTimeFormat(seconds: number) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } else {
      return `00:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
  }


  updateBufferedTime() {
    const bufferedRanges = this.player?.buffered();
    if (bufferedRanges && bufferedRanges.length > 0) {
      const bufferedEnd = bufferedRanges.end(bufferedRanges.length - 1);
      this.setUploadStatus(bufferedEnd)
    }

  }


  setUploadStatus(bufferedEnd: number) {
    let duration = this.player?.duration();
    if (duration && duration > 0) {
      this.uploadStatus = (bufferedEnd * 100) / duration;
    }
  }


  getCurrentTime() {
    this.player?.on('timeupdate', () => {
      let currentTime = this.player?.currentTime();
      if (currentTime) {
        this.setStatus(currentTime);
        this.updateDurationTime(currentTime);
      }
    })
  }


  setStatus(currentTime: number) {
    let duration = this.player?.duration();
    if (duration && duration > 0) {
      this.status = (currentTime * 100) / duration;
      if (this.status == 100) {
        this.isPlaybackrate = false;
        setTimeout(() => {
          this.isReplay = true;
          this.isPlayed = false;
          this.isControlElementsFixed = true;
          this.player?.playbackRate(this.playbackrates[2]);
        }, 500);
      }
    }
  }


  updateDurationTime(currentTime: number) {
    let duration = this.player?.duration();
    if (duration && duration > 0) {
      let remainingTime = duration - currentTime;
      this.duration = this.setTimeFormat(remainingTime)
    }
  }


  replay() {
    this.status = 0;
    if (this.status == 0) {
      setTimeout(() => {
        this.isReplay = false;
        this.player?.play();
        this.isPlayed = true;
        this.isControlElementsFixed = false;
      }, 200);
    }
  }


  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }


  back() {
    this._location.back();
  }


  // toggleFullscreen() {
  //   if (!this.player) return;

  //   if (this.isFullscreen) {
  //     this.player.exitFullscreen();
  //   } else {
  //     this.player.requestFullscreen();
  //   }
  // }

  toggleFullscreen() {
    const playerContainer = document.querySelector('.custom-video-player') as HTMLElement;

    if (!document.fullscreenElement) {
      if (playerContainer.requestFullscreen) {
        playerContainer.requestFullscreen();
      } else if ((playerContainer as any).mozRequestFullScreen) {
        (playerContainer as any).mozRequestFullScreen();
      } else if ((playerContainer as any).webkitRequestFullscreen) {
        (playerContainer as any).webkitRequestFullscreen();
      } else if ((playerContainer as any).msRequestFullscreen) {
        (playerContainer as any).msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      this.isFullscreen = false;
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
    if (this.player) {
      let current = this.player.currentTime();
      let duration = this.player.duration();
      if (current && duration) {
        let newTime = Math.min(current + 10, duration);
        this.player.currentTime(newTime);
      }
    }
  }


  setReplay() {
    if (this.player) {
      let current = this.player.currentTime();
      if (current) {
        let newTime = Math.max(current - 10, 0)
        this.player.currentTime(newTime);
      }
    }
  }


  toggleMute() {
    if (!this.isMuted) {
      this.isMuted = true;
      this.player?.muted(true);
    } else {
      this.isMuted = false;
      this.player?.muted(false);
    }
  }
}