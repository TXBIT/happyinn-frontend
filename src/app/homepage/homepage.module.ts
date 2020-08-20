import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatCardModule } from '@angular/material/card';
import {MatButtonModule } from '@angular/material/button';

import { HomepageComponent } from './homepage.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';

const routes: Routes = [
  { path: 'homepage', component: HomepageComponent},
];

@NgModule({
  declarations: [HomepageComponent, SlideshowComponent, RecommendationsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgbModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [],
})
export class HomepageModule {}
