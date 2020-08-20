import { Input, Output, EventEmitter, OnChanges } from '@angular/core';

export class EditableComponent implements OnChanges {
  @Input() entity: any;
  @Input()
  set field(fieldName: string) {
    this.fieldName = fieldName;
    this.setEntityOriginValue();
  }
  @Input() className: string;
  @Input() style: any;
  @Output() entityUpdated = new EventEmitter();

  isActiveInput: boolean = false;

  public originValueOfEntity: any;
  public fieldName: string;

  constructor() {}

  ngOnChanges() {
    this.setEntityOriginValue();
    this.isActiveInput = false;
  }

  updateEntity() {
    const valueOfEntity = this.entity[this.fieldName];
    if (valueOfEntity !== this.originValueOfEntity) {
      this.entityUpdated.emit({
        [this.fieldName]: this.entity[this.fieldName],
      });
      this.setEntityOriginValue();
    }
    this.isActiveInput = false;
  }

  setEntityOriginValue() {
    this.originValueOfEntity = this.entity[this.fieldName];
  }

  cancel() {
    this.isActiveInput = false;
    this.entity[this.fieldName] = this.originValueOfEntity;
  }
}
