import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-dialog-image',
  templateUrl: './dialog-image.component.html',
  styleUrls: ['./dialog-image.component.css']
})
export class DialogImageComponent implements OnInit {
  imgSrc: any;
  load: boolean = false;
  file!: File;
  error: string = '';
  resSuc: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private profileService: ProfileService) {
    this.imgSrc = data.imgSrc;
   }  

  ngOnInit(): void {
  }
  onFileChange(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc = reader.result;
    }
  }
  update(){
    this.load = true;
    this.resSuc = '';
    this.error = '';
    let formData = new FormData();
    formData.append('image',this.file,this.file.name);
    this.profileService.updatePhoto(formData).subscribe({
      next: (res: ResponseSuccess)=>{
        this.load = false;
        this.resSuc = res.data        
      },
      error: ()=>{
        this.load = false;
      }
    })
  }

}
