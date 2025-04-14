import {Component, ElementRef, EventEmitter, input, OnInit, Output, ViewChild} from '@angular/core';
import {EventVideo} from "../../../../../service/model/event.model";

import {NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faLink, faPlay, faTimes, faUpload} from "@fortawesome/free-solid-svg-icons";
import {faYoutube} from "@fortawesome/free-brands-svg-icons";


@Component({
  selector: 'app-video-step',
  standalone: true,
  imports: [
    NgIf,
    FaIconComponent
  ],
  templateUrl: './video-step.component.html',
  styleUrl: './video-step.component.scss'
})
export class VideoStepComponent implements OnInit{

  video = input.required<EventVideo>();

  // Output events
  @Output() videoChange = new EventEmitter<EventVideo>();
  @Output() stepValidityChange = new EventEmitter<boolean>();

  // Template references
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('youtubeUrlInput') youtubeUrlInput!: ElementRef<HTMLInputElement>;


  // Component state
  uploadProgress = 0;
  private uploadInterval: any;
  selectedTab: 'upload' | 'youtube' = 'upload';
  validationErrors: { file?: string, youtubeUrl?: string } = {};

  ngOnInit() {
    // Set initial tab based on existing content
    if (this.video().videoUrl) {
      this.selectedTab = 'youtube';
    } else if (this.video().file) {
      this.selectedTab = 'upload';
    }
  }


  get youtubeVideoId(): string | null {
    const videoUrl = this.video().videoUrl;
    if (!videoUrl) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  isTabDisabled(tab: 'upload' | 'youtube'): boolean {
    // Disable tab if the other tab has content
    if (tab === 'upload' && this.video().videoUrl) return true;
    return !!(tab === 'youtube' && this.video().file);

  }

  onTabChange(tab: 'upload' | 'youtube') {
    if (this.isTabDisabled(tab)) return;
    this.selectedTab = tab;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.match(/video\/(mp4|webm|quicktime)/)) {
        this.validationErrors.file = 'Invalid video type. Allowed: MP4, WebM, QuickTime';
        this.emitVideoChange({ ...this.video(), file: undefined, fileContentType: undefined });
        return;
      }

      const newVideo: EventVideo = {
        ...this.video(),
        file: file,
        fileContentType: file.type,
        videoUrl: undefined
      };

      this.validationErrors.file = undefined;
      this.validationErrors.youtubeUrl = undefined;
      this.emitVideoChange(newVideo);
      this.simulateUploadProgress();
    }
  }

  onYoutubeUrlChange(url: string) {
    const newVideo: EventVideo = {
      ...this.video(),
      videoUrl: url,
      file: undefined,
      fileContentType: undefined
    };

    if (url && !this.isValidYoutubeUrl(url)) {
      this.validationErrors.youtubeUrl = 'Must be a valid YouTube URL';
    } else {
      this.validationErrors.youtubeUrl = undefined;
    }

    this.emitVideoChange(newVideo);
  }

  removeVideo() {
    if (this.selectedTab === 'upload') {
      const newVideo = { ...this.video(), file: undefined, fileContentType: undefined };
      this.emitVideoChange(newVideo);
      if (this.fileInput) this.fileInput.nativeElement.value = '';
      this.resetUploadProgress();
    } else {
      const newVideo = { ...this.video(), videoUrl: undefined };
      this.emitVideoChange(newVideo);
      if (this.youtubeUrlInput) this.youtubeUrlInput.nativeElement.value = '';
    }
  }

  private emitVideoChange(newVideo: EventVideo) {
    this.videoChange.emit(newVideo);
    this.validateStep(newVideo);
  }

  private validateStep(video: EventVideo) {
    let isValid = false;

    if (this.selectedTab === 'upload') {
      isValid = !!video.file;
    } else {
      isValid = !!video.videoUrl && !this.validationErrors.youtubeUrl;
    }

    this.stepValidityChange.emit(isValid);
  }

  private isValidYoutubeUrl(url: string): boolean {
    if (!url) return false;
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
  }

  private simulateUploadProgress() {
    this.uploadProgress = 0;
    this.uploadInterval = setInterval(() => {
      if (this.uploadProgress < 100) {
        this.uploadProgress += 10;
      } else {
        clearInterval(this.uploadInterval);
      }
    }, 300);
  }

  private resetUploadProgress() {
    this.uploadProgress = 0;
    clearInterval(this.uploadInterval);
  }

  getFileSize(bytes: number | undefined): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


  protected readonly faUpload = faUpload;
  protected readonly faYoutube = faYoutube;
  protected readonly faTimes = faTimes;
  protected readonly faLink = faLink;
  protected readonly faPlay = faPlay;
}
