import { Component, OnInit } from '@angular/core';
import { EditableComponent } from '../editable-component';

@Component({
  selector: 'hpi-editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss'],
})
export class EditableImageComponent extends EditableComponent {
  handleImageUpload(imageUrl: string) {
    this.entity[this.fieldName] = imageUrl;
    this.updateEntity();
  }
  handleImageError() {
    this.cancel();
  }

  handleImageLoad() {
    this.isActiveInput = true;
  }
}
