import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';
import { Review } from 'src/app/review/shared/review.model';
import { ReviewService } from 'src/app/review/shared/review.service';
import * as moment from 'moment';

@Component({
  selector: 'hpi-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss'],
})
export class RentalDetailComponent implements OnInit {
  currentId: string;
  rental: Rental;
  reviews: Review[] = [];
  rating: number;

  constructor(
    private route: ActivatedRoute,
    private rentalService: RentalService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.getRental(params.rentalId);
    });
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe((rental: any) => {
      this.rental = rental.foundRental;
      this.getReviews(rental.foundRental._id);
      this.getOverallRating(rental.foundRental._id);
    });
  }
  getReviews(rentalId: string) {
    this.reviewService
      .getRentalReviews(rentalId)
      .subscribe((reviews: Review[]) => {
        this.reviews = reviews;
      });
  }

  formatDate(date: string): string {
    return `${moment(date).fromNow()}`;
  }

  getOverallRating(rentalId: string) {
    this.reviewService.getOverallRating(rentalId).subscribe((rating) => {
      this.rating = Math.round(rating * 10) / 10;
    });
  }
}
