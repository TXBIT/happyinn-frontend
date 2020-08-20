import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ImageUploadService } from './image-upload.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };

  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File | Blob) {}
}
@Component({
  selector: 'hpi-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  @Output() imageUploaded = new EventEmitter();
  @Output() imageError = new EventEmitter();
  @Output() imageLoadedToContainer = new EventEmitter();
  @Output() croppingCancelled = new EventEmitter();
  @Input() roundCropper = false;
  @Input() aspectRatio = 4 / 3;

  selectedFile: FileSnippet;
  imageChangedEvent: any;

  constructor(
    private imageService: ImageUploadService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}

  onSuccess(imageUrl: string) {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'OK';
    this.imageChangedEvent = null;
    this.imageUploaded.emit(imageUrl);
  }
  onFailure() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'FAIL';
    this.imageChangedEvent = null;
    this.imageError.emit('');
  }

  imageCropped(event: ImageCroppedEvent) {
    if (this.selectedFile) {
      return (this.selectedFile.file = event.file);
    }
    return (this.selectedFile = new FileSnippet('', event.file));
  }

  imageLoaded() {
    this.imageLoadedToContainer.emit();
  }

  cancelCropping() {
    this.imageChangedEvent = null;
    this.croppingCancelled.emit();
  }

  processFile(event: any) {
    this.selectedFile = undefined;
    const URL = window.URL;
    let file, img;

    if (
      (file = event.target.files[0]) &&
      (file.type === 'image/png' || file.type === 'image/jpeg')
    ) {
      img = new Image();
      const self = this;

      img.onload = function() {
        if (
          this.width > FileSnippet.IMAGE_SIZE.width &&
          this.height > FileSnippet.IMAGE_SIZE.height
        ) {
          self.imageChangedEvent = event;
        } else {
          self.toastr.error(
            `Mininum width is ${
              FileSnippet.IMAGE_SIZE.width
            }px and minimum height is ${FileSnippet.IMAGE_SIZE.height}px`,
            'Error!',
          );
        }
      };

      img.src = URL.createObjectURL(file);
    } else {
      this.toastr.error(
        'Unsupported file type. Only JPEG and PNG allowed.',
        'Error!',
      );
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.selectedFile.src = event.target.result;

        this.selectedFile.pending = true;
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (res: any) => {
            this.onSuccess(res.imageUrl);
          },
          (errorResponse: HttpErrorResponse) => {
            this.toastr.error(errorResponse.error.errors[0].detail, 'Error!');
            this.onFailure();
          },
        );
      });

      reader.readAsDataURL(this.selectedFile.file);
    }
  }
}
