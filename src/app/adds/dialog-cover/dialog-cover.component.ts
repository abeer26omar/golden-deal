import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-dialog-cover',
  templateUrl: './dialog-cover.component.html',
  styleUrls: ['./dialog-cover.component.css']
})
export class DialogCoverComponent implements OnInit {
  imgSrc: any;
  load: boolean = false;
  file!: File;
  msg: string = '';
  msgErr: string = '';
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
    let formData = new FormData();
    formData.append('cover',this.file,this.file.name);
    this.profileService.updateCover(formData).subscribe({
      next: res=>{
        this.load = false;
        this.msg = 'تم التغيير بنجاح';
      },
      error: err=>{
        this.load = false;
        this.msgErr = 'حدث خطا';
      }
    })
  }
}
