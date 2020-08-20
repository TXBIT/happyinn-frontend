import { Component, Input } from '@angular/core';
import { EditableComponent } from '../editable-component';

@Component({
  selector: 'hpi-editable-textarea',
  templateUrl: './editable-textarea.component.html',
  styleUrls: ['./editable-textarea.component.scss'],
})
export class EditableTextareaComponent extends EditableComponent {
  @Input() cols: string;
  @Input() rows: string;
}
