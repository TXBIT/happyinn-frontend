import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UcWordsPipe } from 'ngx-pipes';

@Component({
  selector: 'hpi-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss'],
})
export class RentalUpdateComponent implements OnInit {
  currentId: string;
  rental: Rental;
  categories: string[] = Rental.CATEGORIES;
  locationSubject: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private rentalService: RentalService,
    private toastr: ToastrService,
    private upperCase: UcWordsPipe,
  ) {
    this.displayUppercaseLocation = this.displayUppercaseLocation.bind(this);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.getRental(params.rentalId);
    });
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe((rental: any) => {
      this.rental = rental.foundRental;
    });
  }

  updateRental(rentalId: string, rentalData: any) {
    this.rentalService.updateRental(rentalId, rentalData).subscribe(
      (data: any) => {
        this.rental = data;
        if (rentalData.city || rentalData.street) {
          this.locationSubject.next(
            this.rental.city + ', ' + this.rental.street,
          );
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error[0].message, 'Error!');
        this.getRental(rentalId);
      },
    );
  }

  bedroomsCapacity(incrementNumber: number) {
    return parseInt(<any>this.rental.bedrooms || 0, 10) + incrementNumber;
  }

  displayUppercaseLocation(location: string): string {
    return this.upperCase.transform(location);
  }
}
