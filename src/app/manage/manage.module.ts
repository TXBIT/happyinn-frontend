import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthGuard } from '../auth/shared/auth.guard';
import { ManageComponent } from './manage.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { ManageRentalComponent } from './manage-rental/manage-rental.component';
import { NgPipesModule } from 'ngx-pipes';
import { FormatDatePipe } from '../common/pipes/format-date.pipe';
import { ManageRentalBookingComponent } from './manage-rental/manage-rental-booking/manage-rental-booking.component';
import { ReviewModule } from '../review/review.module';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      {
        path: 'rentals',
        component: ManageRentalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'bookings',
        component: ManageBookingComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    ManageComponent,
    ManageBookingComponent,
    ManageRentalComponent,
    FormatDatePipe,
    ManageRentalBookingComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgPipesModule,
    ReviewModule,
  ],
  providers: [],
})
export class ManageModule {}
