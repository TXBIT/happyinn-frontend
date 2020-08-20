import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './shared/user.service';
import { UserComponent } from './user.component';
import { UserDetailComponent, DialogOverviewExampleDialog } from './user-detail/user-detail.component';
import { AuthGuard } from '../auth/shared/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/shared/auth.service';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import {MatDialogModule} from '@angular/material/dialog';

const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    children: [
      {
        path: 'profile',
        canActivate: [AuthGuard],
        component: UserDetailComponent,
      },
    ],
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    ImageUploadModule,
    MatDialogModule,
  ],
  declarations: [UserComponent, UserDetailComponent, DialogOverviewExampleDialog],
  providers: [UserService, AuthService],
  entryComponents: [DialogOverviewExampleDialog]
})
export class UserModule {}
