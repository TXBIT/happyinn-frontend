import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'hpi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  stripe: any;
  elements: any;
  error: string = '';
  isCheckingCard: boolean = false;
  token: any;

  @ViewChild('cardNumber') cardNumberRef: ElementRef;
  @ViewChild('expiredDate') expiredDateRef: ElementRef;
  @ViewChild('cardCvc') cardCvcRef: ElementRef;

  @Output() paymentConfirmation = new EventEmitter();

  cardNumber: any;
  expiredDate: any;
  cardCvc: any;

  constructor() {
    this.stripe = Stripe(environment.STRIPE_PK);
    this.elements = this.stripe.elements();

    this.onChange = this.onChange.bind(this);
  }

  ngOnInit() {
    this.cardNumber = this.elements.create('cardNumber', { style });
    this.cardNumber.mount(this.cardNumberRef.nativeElement);

    this.expiredDate = this.elements.create('cardExpiry', { style });
    this.expiredDate.mount(this.expiredDateRef.nativeElement);

    this.cardCvc = this.elements.create('cardCvc', { style });
    this.cardCvc.mount(this.cardCvcRef.nativeElement);

    this.cardNumber.addEventListener('change', this.onChange);
    this.expiredDate.addEventListener('change', this.onChange);
    this.cardCvc.addEventListener('change', this.onChange);
  }

  ngOnDestroy() {
    this.cardNumber.removeEventListener('change', this.onChange);
    this.expiredDate.removeEventListener('change', this.onChange);
    this.cardCvc.removeEventListener('change', this.onChange);

    this.cardNumber.destroy();
    this.expiredDate.destroy();
    this.cardCvc.destroy();
  }

  async onSubmit() {
    this.isCheckingCard = true;
    const { token, error } = await this.stripe.createToken(this.cardNumber);
    this.isCheckingCard = false;

    if (error) {
      console.error(error);
    } else {
      this.token = token;
      this.paymentConfirmation.next(token);
    }
  }

  isValidCard(): boolean {
    return (
      this.cardNumber._complete &&
      this.expiredDate._complete &&
      this.cardCvc._complete
    );
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = '';
    }
  }
}

const style = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    lineHeight: '40px',
    fontWeight: 300,
    fontFamily: 'Helvetica Neue',
    fontSize: '15px',

    '::placeholder': {
      color: '#CFD7E0',
    },
  },
};
