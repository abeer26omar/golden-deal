import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModalErrorComponent } from '../response-modal-error/response-modal-error.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private dialogRef: MatDialog) { }
  openErrorModa(err: HttpErrorResponse){
    this.dialogRef.open(ResponseModalErrorComponent,{
      data: {
        response: err
      }
    })
  }
}
