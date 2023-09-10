import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Uploader, UploadWidgetConfig, UploadWidgetResult } from "uploader";

@Component({
  selector: 'app-send-images',
  templateUrl: './send-images.component.html',
  styleUrls: ['./send-images.component.css']
})
export class SendImagesComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>) { }
  uploader = Uploader({ 
    apiKey: "free" 
  });
  options: UploadWidgetConfig = {
    multi: false
  };
  ngOnInit(): void {
  }
  onUpdate = (files: UploadWidgetResult[]) => {
    // console.log(files.map(x => x.fileUrl).join("\n"));
    console.log(files);
    
  };
  onComplete = (files: UploadWidgetResult[]) => {
    console.log(files);
    
  };

}
