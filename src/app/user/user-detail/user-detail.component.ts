import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../shared/user.service';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'hpi-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user: any;
  constructor(private userService: UserService, private auth: AuthService, public dialog: MatDialog) {}
  email: String;
  previousPassword = '';
  newPassword = '';
  isActiveInput: boolean = false;
  profileUrl = '';

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const userId = this.auth.getUserId();
    this.userService.getUser(userId).subscribe(
      (user) => {
        this.user = user;
        this.previousPassword = '';
        this.newPassword = '';
      },
      (err) => {},
    );
  }
  async updateUser() {
    const user = {
      email: this.user.email,
      password: this.newPassword,
      previousPassword: this.previousPassword,
      profileUrl: this.profileUrl
    };
    console.log(user);
    const upd = await this.userService.updateUser(user).subscribe(()=> this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px', data: 'Update Success!'}), ()=> this.dialog.open(DialogOverviewExampleDialog, {
        width: '400px', data: 'Update Failed!'}));
    this.getUser();
    this.isActiveInput = false;

  }

  handleImageUpload(imageUrl: string) {
    this.profileUrl = imageUrl;
  }
  handleImageError() {
      this.isActiveInput = false;
  }

  handleImageLoad() {
    this.isActiveInput = true;
  }

  cancel() {
    this.isActiveInput = false;
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: String
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}