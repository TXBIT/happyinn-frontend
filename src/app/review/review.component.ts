import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Review } from "./shared/review.model";
import { ReviewService } from "./shared/review.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "hpi-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"]
})
export class ReviewComponent {
  @Input() bookingId: string;
  @Output() reviewSubmitted = new EventEmitter();
  modalRef: any;
  review: Review = { text: "", rating: 3 };
  errors: any[];
  constructor(
    private modalService: NgbModal,
    private reviewService: ReviewService
  ) {}
  openReviewModal(content) {
    this.modalRef = this.modalService.open(content);
  }
  confirmReview() {
    this.reviewService.createReview(this.review, this.bookingId).subscribe(
      (review: Review) => {
        this.reviewSubmitted.emit(review);
        this.modalRef.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      }
    );
  }

  handleRatingChange(event) {
    this.review.rating = event.rating;
  }
}
