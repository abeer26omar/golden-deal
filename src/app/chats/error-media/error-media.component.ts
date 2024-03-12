import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-media',
  templateUrl: './error-media.component.html',
  styleUrls: ['./error-media.component.css']
})
export class ErrorMediaComponent implements OnInit {
  message: string = '';
  icon: string = '';
  title: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>) {
    this.title = data.error;
    this.message = data.message;
    this.icon = data.icon
  }

  ngOnInit(): void {
  }

}
